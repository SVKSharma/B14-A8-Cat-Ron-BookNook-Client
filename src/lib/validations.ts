import { z } from "zod";
import { BOOK_CATEGORIES } from "./constants";

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter");

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    image: z
      .string()
      .trim()
      .min(1, "Photo URL is required")
      .url("Enter a valid photo URL"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const bookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Book title must be at least 2 characters")
    .max(120, "Book title is too long"),
  author: z
    .string()
    .trim()
    .min(2, "Author name must be at least 2 characters")
    .max(80, "Author name is too long"),
  category: z.enum(BOOK_CATEGORIES, {
    message: "Choose a valid category",
  }),
  image: z
    .string()
    .trim()
    .min(1, "Upload a book cover first")
    .url("Book cover must be a valid image URL"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(1200, "Description is too long"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type BookFormValues = z.infer<typeof bookSchema>;
