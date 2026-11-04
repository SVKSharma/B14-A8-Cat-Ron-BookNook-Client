import { MyBooksSkeleton } from "@/components/books/MyBooksSkeleton";

export default function LoadingMyBooks() {
  return (
    <section className="keep-content-center w-full py-10 sm:py-14 lg:py-16">
      <MyBooksSkeleton showPageHeader />
    </section>
  );
}
