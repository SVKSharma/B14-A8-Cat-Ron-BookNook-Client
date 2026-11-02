import { BOOK_CATEGORIES } from "@/lib/constants";
import type { Book } from "@/lib/types";

export function isBook(value: unknown): value is Book {
  if (typeof value !== "object" || value === null) return false;

  const book = value as Record<string, unknown>;
  return (
    typeof book._id === "string" &&
    book._id.length > 0 &&
    typeof book.title === "string" &&
    book.title.trim().length > 0 &&
    typeof book.author === "string" &&
    book.author.trim().length > 0 &&
    typeof book.category === "string" &&
    BOOK_CATEGORIES.includes(book.category as (typeof BOOK_CATEGORIES)[number]) &&
    typeof book.image === "string" &&
    book.image.trim().length > 0 &&
    typeof book.description === "string" &&
    typeof book.addedByName === "string" &&
    typeof book.addedByEmail === "string" &&
    typeof book.createdAt === "string"
  );
}
