import "server-only";
import crypto from "crypto";
import { encryptToken, decryptToken } from "@/lib/gmail/crypto";
import { sanitizeHtmlEmail } from "@/lib/gmail/sanitizer";
import { assessEmailRelevance } from "@/lib/gmail/relevance";

export class GmailServiceError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "GmailServiceError";
    this.code = code;
  }
}

export function isGmailEnabled(): boolean {
  return process.env.GMAIL_ENABLED !== "false";
}

export function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || "http://localhost:3000/api/gmail/callback";

  if (!clientId || !clientSecret) {
    throw new GmailServiceError(
      "MISSING_OAUTH_CREDENTIALS",
      "Google OAuth credentials (GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET) are not configured."
    );
  }

  return { clientId, clientSecret, redirectUri };
}

/**
 * Generates PKCE code_verifier and code_challenge (S256).
 */
export function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

/**
 * Builds Google OAuth 2.0 PKCE Authorization URL for Gmail Readonly.
 */
export function buildGmailAuthUrl(state: string, codeChallenge: string): string {
  const { clientId, redirectUri } = getGoogleOAuthConfig();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.readonly",
    access_type: "offline",
    prompt: "consent",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchanges authorization code and PKCE verifier for OAuth tokens.
 */
export async function exchangeCodeForTokens(code: string, codeVerifier: string) {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
    code_verifier: codeVerifier,
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new GmailServiceError("TOKEN_EXCHANGE_FAILED", `Failed to exchange authorization code: ${errorText}`);
  }

  const data = await res.json();
  const accessToken = data.access_token as string;
  const refreshToken = (data.refresh_token as string) || null;
  const expiresIn = (data.expires_in as number) || 3600;

  // Retrieve user email profile
  const profileRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  let emailAddress = "unknown";
  if (profileRes.ok) {
    const profile = await profileRes.json();
    emailAddress = profile.emailAddress || "unknown";
  }

  return {
    accessToken,
    refreshToken,
    expiresIn,
    emailAddress,
  };
}

/**
 * Refreshes an expired access token using the encrypted refresh token.
 */
export async function refreshAccessToken(encryptedRefreshToken: string) {
  const { clientId, clientSecret } = getGoogleOAuthConfig();
  const refreshToken = decryptToken(encryptedRefreshToken);

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new GmailServiceError("TOKEN_REFRESH_FAILED", "Google OAuth refresh token has expired or was revoked.");
  }

  const data = await res.json();
  return {
    accessToken: data.access_token as string,
    expiresIn: (data.expires_in as number) || 3600,
  };
}

/**
 * Revokes Google OAuth token.
 */
export async function revokeGoogleToken(rawToken: string): Promise<boolean> {
  try {
    const res = await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(rawToken)}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Searches messages and returns in-memory metadata with sponsorship relevance scoring.
 */
export async function listGmailMessages(
  accessToken: string,
  searchQuery?: string,
  maxResults = 20
) {
  const defaultQuery = 'subject:(collab OR sponsorship OR campaign OR "brand deal" OR commercials OR partner)';
  const q = searchQuery ? `${searchQuery}` : defaultQuery;

  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(q)}&maxResults=${maxResults}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new GmailServiceError("UNAUTHORIZED_TOKEN", "Gmail access token is invalid or expired.");
    }
    throw new GmailServiceError("SEARCH_FAILED", `Failed to list Gmail messages: ${res.statusText}`);
  }

  const data = await res.json();
  const messageItems: Array<{ id: string; threadId: string }> = data.messages || [];

  if (messageItems.length === 0) {
    return [];
  }

  // Fetch metadata for each message
  const metadataList = await Promise.all(
    messageItems.slice(0, maxResults).map(async (item) => {
      try {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date&metadataHeaders=Reply-To`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!msgRes.ok) return null;
        const msg = await msgRes.json();
        const headers: Array<{ name: string; value: string }> = msg.payload?.headers || [];

        const getHeader = (name: string) => headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || null;

        const fromHeader = getHeader("From") || "";
        const subject = getHeader("Subject") || "No Subject";
        const date = getHeader("Date") || null;
        const replyTo = getHeader("Reply-To") || null;
        const snippet = msg.snippet || "";

        // Parse sender name and email from "Name <email@domain.com>"
        let senderName = fromHeader;
        let senderEmail = fromHeader;
        const emailMatch = fromHeader.match(/<([^>]+)>/);
        if (emailMatch) {
          senderEmail = emailMatch[1];
          senderName = fromHeader.replace(/<[^>]+>/, "").trim().replace(/^"|"$/g, "");
        }
        const senderDomain = senderEmail.includes("@") ? senderEmail.split("@")[1].toLowerCase() : null;

        const relevance = assessEmailRelevance(subject, snippet, senderEmail);

        return {
          id: item.id,
          threadId: item.threadId,
          senderName: senderName || null,
          senderEmail: senderEmail || null,
          senderDomain,
          replyToEmail: replyTo,
          subject,
          date,
          snippet,
          isLikelyBrandOffer: relevance.isLikelyBrandOffer,
          reasons: relevance.reasons,
          isAlreadyImported: false, // will be augmented by caller comparing with deals table
        };
      } catch {
        return null;
      }
    })
  );

  return metadataList.filter(Boolean);
}

/**
 * Fetches full email body and sanitizes it to plain text.
 */
export async function getSanitizedEmailBody(accessToken: string, messageId: string): Promise<string> {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new GmailServiceError("MESSAGE_FETCH_FAILED", `Failed to fetch message body: ${res.statusText}`);
  }

  const msg = await res.json();
  const rawBody = extractBodyFromPayload(msg.payload);
  return sanitizeHtmlEmail(rawBody);
}

function extractBodyFromPayload(payload: any): string {
  if (!payload) return "";

  // Check body data directly
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, "base64url").toString("utf8");
  }

  // If multipart, search parts
  if (Array.isArray(payload.parts)) {
    // Prefer HTML part for richer extraction, falling back to plain
    let htmlPart = payload.parts.find((p: any) => p.mimeType === "text/html");
    if (htmlPart?.body?.data) {
      return Buffer.from(htmlPart.body.data, "base64url").toString("utf8");
    }

    let plainPart = payload.parts.find((p: any) => p.mimeType === "text/plain");
    if (plainPart?.body?.data) {
      return Buffer.from(plainPart.body.data, "base64url").toString("utf8");
    }

    // Recursively check nested parts
    for (const part of payload.parts) {
      const text = extractBodyFromPayload(part);
      if (text) return text;
    }
  }

  return "";
}

