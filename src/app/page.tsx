import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HowItWorks } from "@/components/home/HowItWorks";
import { NewArrivals } from "@/components/home/NewArrivals";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <NewArrivals />
      <HowItWorks />
    </>
  );
}
