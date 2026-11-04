import { BooksLoadingSkeleton } from "@/components/books/BooksLoadingSkeleton";

export default function LoadingBooks() {
  return (
    <section className="w-full py-10 sm:py-14 lg:py-16">
      <div className="keep-content-center">
        <BooksLoadingSkeleton showPageHeader />
      </div>
    </section>
  );
}
