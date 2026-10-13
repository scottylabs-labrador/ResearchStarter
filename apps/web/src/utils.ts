/**
 * Parses a Contact field that may come as a Python dict string
 * like "{'Lauren Herckis': 'lrhercki'}" into a JS object { "Lauren Herckis": "lrhercki" }.
 * If it's already an object, returns it as-is.
 */
export function parseContact(val: unknown): Record<string, string> {
  if (val != null && typeof val === "object" && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  if (typeof val === "string") {
    try {
      // Replace Python-style single quotes with double quotes
      const jsonStr = val.replace(/'/g, '"');
      const parsed = JSON.parse(jsonStr);
      if (parsed != null && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, string>;
      }
    } catch {
      // ignore parse errors
    }
  }
  return {};
}

/**
 * Safely coerces a value to a string array.
 * If it's already an array, returns it.
 * If it's a Python-style string like "['a', 'b']", parses it into an array.
 * Otherwise returns [].
 */
export function toArray(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const jsonStr = val.replace(/'/g, '"');
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Not a parseable array string — return as single-element array if non-empty
      if (val.trim()) return [val];
    }
  }
  return [];
}

function normalizeBioKey(key: string): string {
  return key.toLowerCase().replace(/[\s_-]/g, "");
}

/** Decode common HTML entities (e.g. &amp; → &) for plain-text bios. */
export function decodeHtmlEntities(text: string): string {
  if (typeof document === "undefined") return text;
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

/** Turn HTML into readable plain text (block breaks preserved loosely). */
export function stripHtmlToPlainText(html: string): string {
  const withBreaks = html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*p\s*>/gi, "\n\n");
  if (typeof document === "undefined") {
    return withBreaks
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  const doc = new DOMParser().parseFromString(withBreaks, "text/html");
  const text = doc.body.textContent ?? "";
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Professor Bio objects often include both raw HTML and a stripped field.
 * Prefer htmlstripped (any spelling/casing) so we do not show duplicate content.
 */
export function professorBioPlainText(bio: unknown): string {
  if (bio == null || typeof bio !== "object" || Array.isArray(bio)) return "";

  const record = bio as Record<string, unknown>;
  const stringEntries = Object.entries(record).filter(
    (e): e is [string, string] => typeof e[1] === "string" && e[1].trim() !== ""
  );

  const strippedEntry = stringEntries.find(
    ([k]) => normalizeBioKey(k) === "htmlstripped"
  );
  if (strippedEntry) {
    return decodeHtmlEntities(strippedEntry[1].trim());
  }

  const htmlEntry = stringEntries.find(([k]) => {
    const n = normalizeBioKey(k);
    return n === "html" || n.endsWith("html");
  });
  if (htmlEntry) {
    return stripHtmlToPlainText(htmlEntry[1]);
  }

  if (stringEntries.length === 1) {
    return stripHtmlToPlainText(stringEntries[0][1]);
  }

  return stringEntries.map(([, v]) => stripHtmlToPlainText(v)).join("\n\n");
}
