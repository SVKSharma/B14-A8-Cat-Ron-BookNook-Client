/** Normalize prototype ISBN input by removing presentation separators only. */
export function normalizeIsbn(value: string) {
  return value.replace(/[\s-]/g, "");
}

/** The prototype only enforces the ISBN-13 digit count, not registry checksums. */
export function isValidIsbn(value: string) {
  return /^\d{13}$/.test(value);
}
