import type { BookCategory } from "./constants";

export type Book = {
  _id: string;
  isbn?: string;
  title: string;
  author: string;
  category: BookCategory;
  image: string;
  description: string;
  addedByName: string;
  addedByEmail: string;
  createdAt: string;
};

export type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};
