import { MyBorrowsSkeleton } from "@/components/books/MyBorrowsSkeleton";

export default function LoadingMyBorrows() {
  return (
    <section className="keep-content-center w-full py-10 sm:py-14 lg:py-16">
      <MyBorrowsSkeleton />
    </section>
  );
}
