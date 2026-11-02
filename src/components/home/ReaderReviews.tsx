import { Quote, Star } from "lucide-react";

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
];

export function ReaderReviews() {
  return (
    <section className="w-full py-14 sm:py-16 lg:py-20" aria-label="Reader reviews">
      <div className="keep-content-center">
        <SectionHeading
          eyebrow="A few kind words"
          title="Stories are better when shared"
          description="A little note from readers finding their way around the community shelf."
        />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {reviews.map((review) => (
            <figure key={review.name} className="flex h-full min-w-0 flex-col rounded-2xl border border-border/75 bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6">
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
        </div>
      </div>
    </section>
  );
}
