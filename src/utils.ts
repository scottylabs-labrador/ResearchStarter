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
