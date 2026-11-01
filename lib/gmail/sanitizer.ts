/**
 * HTML Email Sanitizer & Body Normalizer
 * Converts messy HTML emails into clean plain text for Gemini extraction.
 * Strips script tags, tracking pixels, CSS, and quoted reply trails.
 */

export function sanitizeHtmlEmail(html: string): string {
  if (!html || typeof html !== "string") return "";

  let text = html;

  // 1. Remove script, style, head, and xml tags with contents
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");
  text = text.replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, " ");
  text = text.replace(/<xml\b[^<]*(?:(?!<\/xml>)<[^<]*)*<\/xml>/gi, " ");

  // 2. Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, " ");

  // 3. Remove 1x1 tracking pixels
  text = text.replace(/<img[^>]+(?:width=["']?[01]["']?[^>]+height=["']?[01]["']?|height=["']?[01]["']?[^>]+width=["']?[01]["']?)[^>]*>/gi, "");

  // 4. Convert block breaks to newlines
  text = text.replace(/<br\s*[\/]?>/gi, "\n");
  text = text.replace(/<\/(p|div|tr|li|h[1-6])>/gi, "\n");

  // 5. Strip all remaining HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // 6. Decode common HTML entities
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));

  // 7. Strip quoted email reply trails
  // - "On [date], [person] wrote:"
  // - "-----Original Message-----"
  // - "From: ... To: ... Subject: ..."
  // - Lines starting with ">"
  const lines = text.split(/\r?\n/);
  const cleanLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for start of reply quote header
    if (
      /^On\s+.+wrote:?$/i.test(trimmed) ||
      /^-----Original Message-----/i.test(trimmed) ||
      /^_{10,}/.test(trimmed) ||
      /^-{10,}/.test(trimmed) ||
      /^From:\s+.+@.+\s+Sent:/i.test(trimmed)
    ) {
      break; // Stop at quoted thread boundary
    }

    // Skip individual blockquoted lines
    if (trimmed.startsWith(">")) {
      continue;
    }

    cleanLines.push(line);
  }

  // 8. Normalize whitespace and collapse multiple empty lines
  return cleanLines
    .join("\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}

