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
  accessToken?: string;
};

export async function apiFetch<T>(
  path: string,
  init: ApiFetchOptions = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  const { accessToken, ...requestInit } = init;

  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestInit,
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
  accessToken?: string;
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
    accessToken: params.accessToken,
  });
}

export async function getBook(id: string, accessToken?: string): Promise<Book> {
  const ownerQuery = accessToken ? "?owner=true" : "";
  return apiFetch<Book>(`/books/${encodeURIComponent(id)}${ownerQuery}`, { accessToken });
}

export async function getBookAvailability(
  id: string,
  signal?: AbortSignal,
  accessToken?: string,
): Promise<{ availableCopies: number; borrowableCopies?: number; ownsBook?: boolean }> {
  return apiFetch<{ availableCopies: number; borrowableCopies?: number; ownsBook?: boolean }>(
    `/books/${encodeURIComponent(id)}/availability`,
    { signal, accessToken },
  );
}

export type CreateBookPayload = Omit<Book, "_id" | "createdAt" | "addedByName" | "addedByEmail">;

export async function createBook(
  payload: CreateBookPayload,
  accessToken: string,
): Promise<{ acknowledged: boolean; insertedId: string }> {
  return apiFetch("/books", {
    method: "POST",
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30_000),
    accessToken,
  });
}

export type UpdateBookPayload = Partial<
  Pick<Book, "title" | "author" | "category" | "isbn" | "image" | "description">
>;

export async function updateBook(
  id: string,
  payload: UpdateBookPayload,
  accessToken: string,
): Promise<{ acknowledged: boolean; matchedCount: number; modifiedCount: number }> {
  return apiFetch(`/books/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    accessToken,
  });
}

export async function deleteBook(
  id: string,
  accessToken: string,
): Promise<{ acknowledged: boolean; deletedCount: number }> {
  return apiFetch(`/books/${encodeURIComponent(id)}`, {
    method: "DELETE",
    signal: AbortSignal.timeout(30_000),
    accessToken,
  });
}

export type CreateBorrowPayload = {
  bookId: string;
  returnDate?: string;
};

export async function getBorrows(email: string | undefined, signal: AbortSignal | undefined, accessToken: string): Promise<Borrow[]> {
  const query = email ? `?email=${encodeURIComponent(email)}` : "";
  return apiFetch<Borrow[]>(`/borrows${query}`, { signal, accessToken });
}

export async function createBorrow(
  payload: CreateBorrowPayload,
  accessToken: string,
): Promise<{ acknowledged: boolean; insertedId: string }> {
  return apiFetch("/borrows", {
    method: "POST",
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30_000),
    accessToken,
  });
}

export async function deleteBorrow(
  id: string,
  accessToken: string,
): Promise<{ acknowledged: boolean; deletedCount: number }> {
  return apiFetch(`/borrows/${encodeURIComponent(id)}`, {
    method: "DELETE",
    signal: AbortSignal.timeout(30_000),
    accessToken,
  });
}
