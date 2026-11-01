/**
 * YouTube Channel URL and Handle Parser
 * Strict domain validation and format normalization.
 */

export interface ParsedYouTubeChannel {
  type: "handle" | "id" | "username";
  value: string;
}

const ALLOWED_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
]);

export function parseChannelInput(input: string): ParsedYouTubeChannel | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Case 1: Direct handle e.g. "@username"
  if (trimmed.startsWith("@")) {
    const handle = trimmed.slice(1).replace(/[^a-zA-Z0-9._-]/g, "");
    if (!handle) return null;
    return { type: "handle", value: handle };
  }

  // Case 2: URL parsing
  if (trimmed.includes("http://") || trimmed.includes("https://") || trimmed.includes("youtube.com/")) {
    let urlString = trimmed;
    if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
      urlString = "https://" + urlString;
    }

    try {
      const parsedUrl = new URL(urlString);
      const host = parsedUrl.hostname.toLowerCase();

      if (!ALLOWED_HOSTS.has(host)) {
        return null;
      }

      const pathname = parsedUrl.pathname.replace(/\/+$/, ""); // strip trailing slash
      const parts = pathname.split("/").filter(Boolean);

      if (parts.length === 0) return null;

      // /@handle
      if (parts[0].startsWith("@")) {
        const handle = parts[0].slice(1).replace(/[^a-zA-Z0-9._-]/g, "");
        return handle ? { type: "handle", value: handle } : null;
      }

      // /channel/UC...
      if (parts[0] === "channel" && parts[1]) {
        return { type: "id", value: parts[1] };
      }

      // /c/CustomName
      if (parts[0] === "c" && parts[1]) {
        return { type: "username", value: parts[1] };
      }

      // /user/LegacyUser
      if (parts[0] === "user" && parts[1]) {
        return { type: "username", value: parts[1] };
      }

      // If single path part, treat as username or handle
      if (parts.length === 1) {
        return { type: "handle", value: parts[0] };
      }

      return null;
    } catch {
      return null;
    }
  }

  // Case 3: Raw Channel ID (UC...)
  if (/^UC[a-zA-Z0-9_-]{22}$/.test(trimmed)) {
    return { type: "id", value: trimmed };
  }

  // Case 4: Plain handle without '@'
  if (/^[a-zA-Z0-9._-]{3,30}$/.test(trimmed)) {
    return { type: "handle", value: trimmed };
  }

  return null;
}

