"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import Marquee from "react-fast-marquee";

import { SectionHeading } from "@/components/shared/SectionHeading";

const reviews = [
  {
    quote:
      "I found a thoughtful little novel I would never have picked up otherwise. It felt like a recommendation from a friend.",
    name: "Maya L.",
    initials: "ML",
    detail: "Found a new favorite",
    tone: "bg-accent text-accent-foreground",
  },
  {
    quote:
      "Passing a book along is such a lovely idea. I finished one I adored, then sent it on for someone else to enjoy.",
    name: "Daniel R.",
    initials: "DR",
    detail: "Shared a well-loved story",
    tone: "bg-primary/10 text-primary",
  },
  {
    quote:
      "The shelf makes browsing feel calm again. I can take my time, follow a curiosity, and see where the story goes.",
    name: "Ari S.",
    initials: "AS",
    detail: "Enjoyed a slower browse",
    tone: "bg-secondary text-secondary-foreground",
  },
  {
    quote:
      "I found a book just when I needed something new to read. The whole experience feels warm and welcoming.",
    name: "Nina K.",
    initials: "NK",
    detail: "Discovered a new read",
    tone: "bg-primary/10 text-primary",
  },
  {
    quote:
      "It feels good knowing a book I loved can bring a little joy to another reader, too.",
    name: "Omar H.",
    initials: "OH",
    detail: "Passed a book along",
    tone: "bg-accent text-accent-foreground",
  },
  {
    quote:
      "I came to browse and left with a story I keep recommending to everyone I know.",
    name: "Leah M.",
    initials: "LM",
    detail: "Found a story to share",
    tone: "bg-secondary text-secondary-foreground",
  },
];

export function ReaderReviews() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePlayState = () => setPlay(!motionPreference.matches);

    updatePlayState();
    motionPreference.addEventListener("change", updatePlayState);
    return () => motionPreference.removeEventListener("change", updatePlayState);
  }, []);

  return (
    <section className="w-full py-14 sm:py-16 lg:py-20" aria-label="Reader reviews">
      <div className="keep-content-center">
        <SectionHeading
          eyebrow="A few kind words"
          title="Stories are better when shared"
          description="A little note from readers finding their way around the community shelf."
        />

        <div className="review-marquee-viewport relative mt-8 overflow-hidden sm:mt-10">
          <div aria-hidden="true">
            <Marquee
              className="review-marquee"
              play={play}
              pauseOnHover
              speed={45}
              gradient
              gradientColor="var(--background)"
              gradientWidth={32}
            >
              {reviews.map((review) => (
                <figure
                  key={review.name}
                  className="mx-2 flex min-h-64 w-[min(84vw,24rem)] shrink-0 flex-col rounded-2xl border border-border/75 bg-card/90 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:mx-3 sm:min-h-72 sm:w-[min(42vw,27rem)] sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Quote className="size-5" aria-hidden="true" />
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/70 px-3 py-1.5 text-xs font-semibold text-accent-foreground">
                      <Star className="size-3.5 fill-current" aria-hidden="true" />
                      Reader note
                    </span>
                  </div>

                  <blockquote className="mt-5 flex-1 font-heading text-lg leading-7 text-card-foreground sm:text-xl sm:leading-8">
                    “{review.quote}”
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border/70 pt-4">
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${review.tone}`}>
                      {review.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">{review.name}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">{review.detail}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </Marquee>
          </div>
          <ul className="sr-only">
            {reviews.map((review) => (
              <li key={review.name}>
                {review.name}: “{review.quote}” {review.detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
