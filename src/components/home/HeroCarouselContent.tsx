"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowLeft, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { useRef } from "react";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";

import { Button } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    eyebrow: "A little more room for stories",
    title: "Good books are even better when they’re shared.",
    description:
      "Find your next favorite on a community shelf, or pass along a story that stayed with you.",
    note: "Read · Share · Repeat",
    art: "bg-[radial-gradient(ellipse_at_70%_36%,rgba(211,163,93,0.26),transparent_38%),linear-gradient(120deg,var(--background),var(--muted))]",
    book: "bg-[#315b45]",
    spine: "bg-[#d09b56]",
    label: "THE ART OF\nSLOW READING",
  },
  {
    eyebrow: "A new chapter is waiting",
    title: "Make space on your shelf for a new favorite.",
    description:
      "Browse thoughtful picks from readers like you and let curiosity choose what comes home next.",
    note: "Your next read is here",
    art: "bg-[radial-gradient(ellipse_at_72%_36%,rgba(178,117,80,0.23),transparent_38%),linear-gradient(120deg,var(--background),var(--muted))]",
    book: "bg-[#754c3b]",
    spine: "bg-[#a9b68a]",
    label: "A FIELD GUIDE\nTO WONDER",
  },
  {
    eyebrow: "Stories travel farther together",
    title: "Read it, love it, leave it for someone else.",
    description:
      "BookNook makes it easy to lend a beloved book and keep good stories moving through your community.",
    note: "Pass a story along",
    art: "bg-[radial-gradient(ellipse_at_72%_36%,rgba(125,155,130,0.28),transparent_38%),linear-gradient(120deg,var(--background),var(--muted))]",
    book: "bg-[#536b70]",
    spine: "bg-[#d0a36d]",
    label: "THE MAP OF\nSMALL MOMENTS",
  },
];

export default function HeroCarouselContent() {
  const swiperRef = useRef<SwiperRef>(null);

  return (
    <section className="home-hero-stage keep-content-center py-6 sm:py-9" aria-label="Welcome to BookNook">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_24px_70px_-42px_rgba(24,34,27,0.42)]">
        <Swiper
          ref={swiperRef}
          modules={[A11y, Autoplay, Pagination]}
          loop
          autoplay={{ delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true, el: ".hero-pagination" }}
          a11y={{ enabled: true }}
          className="hero-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.title}>
              <div className={`relative isolate flex min-h-[34rem] items-center overflow-hidden px-6 py-12 sm:min-h-[36rem] sm:px-12 lg:min-h-[39rem] lg:px-16 ${slide.art}`}>
                <div aria-hidden="true" className="absolute -right-20 top-1/2 -z-10 size-[28rem] -translate-y-1/2 rounded-full border border-primary/10 sm:right-2 sm:size-[38rem]" />
                <div aria-hidden="true" className="absolute -right-7 top-1/2 -z-10 size-[22rem] -translate-y-1/2 rounded-full border border-primary/10 sm:right-20 sm:size-[30rem]" />

                <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
                  <div className="max-w-2xl">
                    <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/75 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm backdrop-blur sm:text-sm">
                      <Sparkles className="size-4" aria-hidden="true" />
                      {slide.eyebrow}
                    </p>
                    <h1 className="mt-6 max-w-2xl text-balance font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                      {slide.description}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Button size="lg" className="h-12 rounded-full px-6 text-base shadow-md" nativeButton={false} render={<Link href="/books" />}>
                        Browse Books
                        <ArrowRight aria-hidden="true" />
                      </Button>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <BookOpen className="size-4 text-primary" aria-hidden="true" />
                        {slide.note}
                      </span>
                    </div>
                  </div>

                  <div className="relative mx-auto flex h-56 w-full max-w-md items-center justify-center sm:h-72 lg:h-[26rem]">
                    <div aria-hidden="true" className="absolute bottom-5 h-8 w-4/5 rounded-[50%] bg-foreground/10 blur-xl" />
                    <div aria-hidden="true" className={`absolute left-[18%] top-[22%] h-[68%] w-[39%] rotate-[-13deg] rounded-l-lg rounded-r-md ${slide.book} shadow-2xl`}>
                      <div className={`absolute inset-y-0 left-0 w-3 rounded-l-lg ${slide.spine}`} />
                      <div className="absolute inset-y-5 left-6 right-4 flex flex-col justify-between border-y border-white/25 py-4 text-left text-[10px] font-semibold leading-relaxed tracking-[0.2em] text-white/90 sm:text-xs">
                        <span>BOOKNOOK<br />COMMUNITY EDITION</span>
                        <span className="whitespace-pre-line font-heading text-sm leading-snug tracking-wide sm:text-lg">{slide.label}</span>
                        <span>EST. FOR READERS</span>
                      </div>
                    </div>
                    <div aria-hidden="true" className={`absolute right-[18%] top-[18%] h-[72%] w-[42%] rotate-[9deg] rounded-l-lg rounded-r-md ${slide.spine} shadow-xl`}>
                      <div className="absolute inset-y-3 left-3 right-3 rounded-sm border border-white/40" />
                      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center text-white/90">
                        <BookOpen className="size-12 stroke-[1.2] sm:size-16" />
                      </div>
                    </div>
                    <div className="absolute bottom-5 right-4 flex -rotate-6 items-center gap-2 rounded-2xl border border-border/80 bg-card px-4 py-3 text-sm font-medium text-foreground shadow-lg sm:bottom-8 sm:right-0">
                      <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground"><ArrowDownRight className="size-4" /></span>
                      Stories worth sharing
                    </div>
                    <span className="absolute right-8 top-6 font-heading text-5xl text-primary/30" aria-hidden="true">✳</span>
                    <span className="sr-only">Decorative illustration of books for slide {index + 1}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute bottom-5 left-6 z-10 flex items-center gap-3 sm:bottom-7 sm:left-12 lg:left-16">
          <button type="button" onClick={() => swiperRef.current?.swiper.slidePrev()} aria-label="Previous slide" className="flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <div className="hero-pagination flex items-center gap-1.5" aria-label="Choose a slide" />
          <button type="button" onClick={() => swiperRef.current?.swiper.slideNext()} aria-label="Next slide" className="flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <style jsx global>{`
        .hero-pagination .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          margin: 0 !important;
          opacity: 1;
          background: var(--muted-foreground);
          transition: width 180ms ease, background-color 180ms ease;
        }
        .hero-pagination .swiper-pagination-bullet-active {
          width: 22px;
          border-radius: 999px;
          background: var(--primary);
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-pagination .swiper-pagination-bullet { transition: none; }
        }
      `}</style>
    </section>
  );
}
