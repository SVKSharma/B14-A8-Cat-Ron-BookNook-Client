"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BOOK_CATEGORIES } from "@/lib/constants";
import type { Book } from "@/lib/types";

type BooksCatalogProps = {
  books: Book[];
};

export function BooksCatalog({ books }: BooksCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return books.filter((book) => {
      const matchesCategory = category === "all" || book.category === category;
      const searchableText = `${book.title} ${book.author} ${book.description}`.toLowerCase();
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [books, category, query]);

  const hasFilters = query.trim().length > 0 || category !== "all";

  function clearFilters() {
    setQuery("");
    setCategory("all");
  }

  return (
    <div>
      <div className="rounded-2xl border border-border/75 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_15rem] sm:items-end">
          <div>
            <label htmlFor="book-search" className="mb-2 block text-sm font-semibold text-foreground">
              Search the shelves
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="book-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search titles, authors, or descriptions"
                className="h-11 rounded-xl bg-background pl-10 pr-4"
              />
            </div>
          </div>

          <div>
            <label htmlFor="book-category" className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
              Category
            </label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value ?? "all")}
            >
              <SelectTrigger
                id="book-category"
                className="h-11 w-full rounded-xl border-input bg-background px-3 text-sm text-foreground shadow-sm transition hover:border-primary/30 hover:bg-muted/50 dark:bg-card"
              >
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent
                align="start"
                className="rounded-xl border border-border/80 bg-popover p-1.5 shadow-xl"
              >
                <SelectItem value="all" className="rounded-lg py-2">All categories</SelectItem>
                {BOOK_CATEGORIES.map((bookCategory) => (
                  <SelectItem key={bookCategory} value={bookCategory} className="rounded-lg py-2">
                    {bookCategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex min-h-8 items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Showing <span className="font-semibold text-foreground">{filteredBooks.length}</span> of {books.length} {books.length === 1 ? "book" : "books"}
        </p>
        {hasFilters ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X aria-hidden="true" /> Clear filters
          </Button>
        ) : null}
      </div>

      {filteredBooks.length > 0 ? (
        <div className="mt-3 grid min-w-0 grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filteredBooks.map((book) => <BookCard key={book._id} book={book} />)}
        </div>
      ) : (
        <div className="mt-3 rounded-2xl border border-dashed border-border bg-card/65 px-5 py-12 text-center sm:py-16">
          <Search className="mx-auto size-8 text-primary/70" aria-hidden="true" />
          <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">No books match those filters.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Try another title or category to keep exploring.</p>
          <Button type="button" variant="outline" onClick={clearFilters} className="mt-5 rounded-full">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
