import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HowItWorks } from "@/components/home/HowItWorks";
import { NewArrivals } from "@/components/home/NewArrivals";
import { ReaderReviews } from "@/components/home/ReaderReviews";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <NewArrivals />
      <HowItWorks />
      <ReaderReviews />
    </>
  );
}
