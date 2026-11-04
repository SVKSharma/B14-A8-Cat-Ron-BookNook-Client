"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { PRIVATE_NAV_LINKS, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { UserMenu } from "@/components/auth/UserMenu";
import { MobileNav } from "./MobileNav";
import { SiteLogo } from "./SiteLogo";
import { ThemeToggle } from "./ThemeToggle";

function NavbarContent() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;
  const links = user ? [...NAV_LINKS, ...PRIVATE_NAV_LINKS] : NAV_LINKS;

  return (
    <header className="sticky top-0 z-40 isolate border-b border-border/50 bg-background/85 shadow-[0_8px_32px_-18px_rgba(20,35,27,0.3)] backdrop-blur-2xl supports-[backdrop-filter]:bg-background/45 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/40 after:to-transparent after:content-['']">
      <div className="keep-content-center relative z-10 flex h-18 items-center justify-between gap-4">
        <SiteLogo />

        <nav
          className="hidden items-center gap-1 rounded-full border border-border/55 bg-card/40 p-1 shadow-[0_4px_20px_-10px_rgba(20,35,27,0.3)] backdrop-blur-2xl lg:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-1 ring-primary-foreground/10"
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <span aria-hidden="true" className="mx-1 h-7 w-px bg-border" />
          {isPending ? (
            <div className="h-10 w-36 animate-pulse rounded-full bg-muted" aria-label="Loading account" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button
                variant="outline"
                size="lg"
                className="border-input bg-card px-4 text-foreground shadow-sm hover:border-primary/40 hover:bg-muted"
                nativeButton={false}
                render={<Link href="/signin" />}
              >
                Sign in
              </Button>
              <Button
                size="lg"
                className="px-4"
                nativeButton={false}
                render={<Link href="/signup" />}
              >
                Sign up
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <MobileNav user={user} isPending={isPending} />
        </div>
      </div>
    </header>
  );
}

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-40 isolate border-b border-border/50 bg-background/85 shadow-[0_8px_32px_-18px_rgba(20,35,27,0.3)] backdrop-blur-2xl supports-[backdrop-filter]:bg-background/45 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/40 after:to-transparent after:content-['']">
      <div className="keep-content-center relative z-10 flex h-18 items-center justify-between gap-4">
        <SiteLogo />
        <div className="h-10 w-28 animate-pulse rounded-full bg-muted lg:w-56" aria-hidden="true" />
      </div>
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarContent />
    </Suspense>
  );
}
