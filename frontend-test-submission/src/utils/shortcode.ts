const ALPHANUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateShortcode(existing: Set<string>, length = 6): string {
  let code = "";
  do {
    code = Array.from({ length }, () => ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)]).join("");
  } while (existing.has(code));
  return code;
} 