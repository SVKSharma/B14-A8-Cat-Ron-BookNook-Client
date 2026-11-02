"use client";

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

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;
  const links = user ? [...NAV_LINKS, ...PRIVATE_NAV_LINKS] : NAV_LINKS;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 shadow-[0_4px_24px_-20px_rgba(30,45,35,0.35)] backdrop-blur-xl">
      <div className="keep-content-center flex h-18 items-center justify-between gap-4">
        <SiteLogo />

        <nav
          className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/75 p-1 shadow-sm lg:flex"
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
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <MobileNav user={user} isPending={isPending} />
        </div>
      </div>
    </header>
  );
}
