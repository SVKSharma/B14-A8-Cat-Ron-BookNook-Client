/** Normalize prototype ISBN input by removing presentation separators only. */
export function normalizeIsbn(value: string) {
  return value.replace(/[\s-]/g, "");
}

/** The prototype only enforces the ISBN-13 digit count, not registry checksums. */
export function isValidIsbn(value: string) {
  return /^\d{13}$/.test(value);
}

export function formatIsbnForDisplay(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  const groups = digits.slice(0, 9).match(/.{1,3}/g) ?? [];
  const finalGroup = digits.slice(9);
  return [...groups, finalGroup].filter(Boolean).join("-");
}
