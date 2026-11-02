export const SITE_CONFIG = {
  name: "BookNook",
  tagline: "A small online library",
  description:
    "A cozy online library where readers share books, borrow stories, and return them for the next reader.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hello@booknook.app",
  phone: "+1 (555) 012-3456",
  social: {
    x: "https://x.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    github: "https://github.com",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
] as const;

export const PRIVATE_NAV_LINKS = [
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
] as const;

export const BOOK_CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];
