"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BookOpen, ChevronRight, LogOut, MenuIcon, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PRIVATE_NAV_LINKS, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/auth-client";
import { useSignOut } from "@/hooks/use-sign-out";

type MobileNavProps = {
  user: AuthUser | null;
  isPending: boolean;
};

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function MobileNav({ user, isPending }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const handleSignOut = useSignOut();
  const links = user ? [...NAV_LINKS, ...PRIVATE_NAV_LINKS] : NAV_LINKS;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="size-10 rounded-xl border-border/70 bg-card/80 text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95 md:hidden"
            aria-label="Open navigation menu"
          />
        }
      >
        <MenuIcon aria-hidden="true" className="size-5" />
      </SheetTrigger>

      <SheetContent side="right" className="w-[min(88vw,23rem)] gap-0 border-l-border/70 bg-background/95 p-0 backdrop-blur-2xl">
        <SheetHeader className="border-b border-border/70 bg-gradient-to-br from-primary/[0.09] via-background to-background px-6 pb-5 pt-12">
          <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <BookOpen className="size-5" aria-hidden="true" />
          </div>
          <SheetTitle className="text-xl font-semibold tracking-tight">Your BookNook</SheetTitle>
          <SheetDescription className="text-[13px]">
            Browse the shelves and manage your library.
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1.5 p-4" aria-label="Mobile navigation">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/75">Explore</p>
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex min-h-12 items-center justify-between rounded-2xl px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                    : "text-foreground/75 hover:bg-muted hover:text-foreground active:scale-[0.98]"
                )}
              >
                <span>{link.label}</span>
                <ChevronRight className={cn("size-4 transition-transform group-hover:translate-x-0.5", active ? "text-primary-foreground/75" : "text-muted-foreground/60")} aria-hidden="true" />
              </Link>
            );
          })}
        </nav>

        <SheetFooter className="mt-auto border-t border-border/70 bg-muted/20 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {isPending ? (
            <div className="h-[4.5rem] animate-pulse rounded-2xl bg-muted" aria-label="Loading account" />
          ) : user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/[0.035] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]"
              >
                <Avatar className="size-11 ring-2 ring-primary/10" size="sm">
                  {user.image ? <AvatarImage src={user.image} alt="" /> : null}
                  <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">{initials(user.name) || "BN"}</AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{user.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">View your profile</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
              </Link>
              <Button
                variant="outline"
                className="h-11 w-full justify-start gap-2.5 rounded-xl border-border/70 bg-transparent px-3.5 text-muted-foreground transition-colors hover:border-destructive/25 hover:bg-destructive/5 hover:text-destructive"
                onClick={() => {
                  setOpen(false);
                  void handleSignOut();
                }}
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <div className="mb-1 rounded-2xl bg-primary/[0.06] p-3.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <UserRound className="size-4 text-primary" aria-hidden="true" />
                  Your library starts here
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Sign in to save books and manage your reading.</p>
              </div>
              <Button
                className="h-11 w-full justify-between rounded-xl px-4 shadow-sm"
                nativeButton={false}
                render={<Link href="/signup" onClick={() => setOpen(false)} />}
              >
                Create an account <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                className="h-11 w-full rounded-xl border-border/70 bg-card"
                nativeButton={false}
                render={<Link href="/signin" onClick={() => setOpen(false)} />}
              >
                Sign in
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
