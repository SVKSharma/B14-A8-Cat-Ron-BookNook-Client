import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { FaFacebookF, FaGithub, FaInstagram, FaXTwitter } from "react-icons/fa6";

import { SiteLogo } from "@/components/layout/SiteLogo";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10 hover:text-primary hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-card/75" aria-label="Site footer">
      <div className="keep-content-center">
        <div className="relative isolate mt-8 overflow-hidden rounded-3xl bg-primary px-6 py-7 text-primary-foreground shadow-lg shadow-primary/10 sm:mt-10 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-9 sm:py-8">
          <div aria-hidden="true" className="absolute -right-8 -top-24 -z-10 size-64 rounded-full border border-primary-foreground/10 sm:right-36 sm:size-72" />
          <div aria-hidden="true" className="absolute -right-2 -top-16 -z-10 size-48 rounded-full border border-primary-foreground/10 sm:right-44 sm:size-56" />
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">Your next chapter starts here</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">There’s always room for one more story.</h2>
            <p className="mt-2 text-sm leading-6 opacity-80">Browse the community shelf and find a book to take along.</p>
          </div>
          <Button
            variant="secondary"
            className="mt-5 h-11 shrink-0 rounded-full px-5 shadow-sm sm:mt-0"
            nativeButton={false}
            render={<Link href="/books" />}
          >
            Explore books <ArrowRight aria-hidden="true" />
          </Button>
        </div>

        <div className="grid gap-10 py-11 sm:grid-cols-2 sm:gap-12 sm:py-14 lg:grid-cols-[1.5fr_0.8fr_1fr] lg:gap-16 lg:py-16">
          <div className="max-w-sm">
            <SiteLogo />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              A cozy community shelf for sharing books, finding your next read, and passing good stories along.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              <SocialLink href={SITE_CONFIG.social.x} label="BookNook on X"><FaXTwitter size={16} aria-hidden="true" /></SocialLink>
              <SocialLink href={SITE_CONFIG.social.instagram} label="BookNook on Instagram"><FaInstagram size={16} aria-hidden="true" /></SocialLink>
              <SocialLink href={SITE_CONFIG.social.facebook} label="BookNook on Facebook"><FaFacebookF size={15} aria-hidden="true" /></SocialLink>
              <SocialLink href={SITE_CONFIG.social.github} label="BookNook on GitHub"><FaGithub size={16} aria-hidden="true" /></SocialLink>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">Explore</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/" className="text-muted-foreground transition hover:text-primary">Home</Link></li>
              <li><Link href="/books" className="text-muted-foreground transition hover:text-primary">All Books</Link></li>
              <li><Link href="/signin" className="text-muted-foreground transition hover:text-primary">Sign in</Link></li>
              <li><Link href="/signup" className="text-muted-foreground transition hover:text-primary">Sign up</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">Get in touch</h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Have a question or a book to share? We’d love to hear from you.
            </p>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:underline"
            >
              <Mail className="size-4" aria-hidden="true" />
              {SITE_CONFIG.email}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border/70 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {SITE_CONFIG.name}. Made for readers and the stories they share.</p>
          <Link href="/books" className="inline-flex items-center gap-1 font-medium transition hover:text-primary">
            Find your next read <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
