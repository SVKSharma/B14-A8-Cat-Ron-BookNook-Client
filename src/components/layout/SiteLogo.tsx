import Link from "next/link";
import { BookOpenIcon } from "lucide-react";

import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
};

export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${SITE_CONFIG.name} home`}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3">
        <BookOpenIcon className="size-5" aria-hidden="true" />
      </span>
      <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
        {SITE_CONFIG.name}
      </span>
    </Link>
  );
}
