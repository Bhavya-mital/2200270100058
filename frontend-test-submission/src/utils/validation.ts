export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function validateShortcode(shortcode: string): boolean {
  return /^[a-zA-Z0-9]{1,16}$/.test(shortcode);
}

export function validateValidityPeriod(period: string): boolean {
  const num = Number(period);
  return Number.isInteger(num) && num > 0;
} 