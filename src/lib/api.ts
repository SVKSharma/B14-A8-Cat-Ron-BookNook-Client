import type { Book, Borrow } from "./types";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiFetchOptions = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export async function apiFetch<T>(
  path: string,
  init: ApiFetchOptions = {}
): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const data = (await response.json()) as { message?: unknown };
      if (typeof data?.message === "string") {
        message = data.message;
      }
    } catch {
      // Keep the fallback message when the response is not JSON.
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export type BookListParams = {
  limit?: number;
  email?: string;
  signal?: AbortSignal;
};

export async function getBooks(params: BookListParams = {}): Promise<Book[]> {
  const searchParams = new URLSearchParams();

  if (params.limit && params.limit > 0) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.email) {
    searchParams.set("email", params.email);
  }

  const query = searchParams.toString();

  return apiFetch<Book[]>(`/books${query ? `?${query}` : ""}`, {
    signal: params.signal,
  });
}

export async function getBook(id: string): Promise<Book> {
  return apiFetch<Book>(`/books/${encodeURIComponent(id)}`);
}

export type CreateBookPayload = Omit<Book, "_id" | "createdAt">;

export async function createBook(
  payload: CreateBookPayload
): Promise<{ acknowledged: boolean; insertedId: string }> {
  return apiFetch("/books", {
    method: "POST",
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30_000),
  });
}

export type UpdateBookPayload = Partial<
  Pick<Book, "title" | "author" | "category" | "isbn" | "image" | "description">
>;

export async function updateBook(
  id: string,
  payload: UpdateBookPayload
): Promise<{ acknowledged: boolean; matchedCount: number; modifiedCount: number }> {
  return apiFetch(`/books/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteBook(
  id: string
): Promise<{ acknowledged: boolean; deletedCount: number }> {
  return apiFetch(`/books/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export type CreateBorrowPayload = {
  bookId: string;
  userEmail: string;
  bookTitle?: string;
  bookImage?: string;
  returnDate?: string;
};

export async function getBorrows(email?: string): Promise<Borrow[]> {
  const query = email ? `?email=${encodeURIComponent(email)}` : "";
  return apiFetch<Borrow[]>(`/borrows${query}`);
}

export async function createBorrow(
  payload: CreateBorrowPayload
): Promise<{ acknowledged: boolean; insertedId: string }> {
  return apiFetch("/borrows", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteBorrow(
  id: string
): Promise<{ acknowledged: boolean; deletedCount: number }> {
  return apiFetch(`/borrows/${encodeURIComponent(id)}`, { method: "DELETE" });
}
