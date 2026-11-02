"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

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
            className="border-input bg-card text-foreground shadow-sm hover:border-primary/40 hover:bg-muted md:hidden"
            aria-label="Open navigation menu"
          />
        }
      >
        <MenuIcon aria-hidden="true" />
      </SheetTrigger>

      <SheetContent side="right" className="gap-0">
        <SheetHeader className="border-b pt-12">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Browse the shelves or manage your library.
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <SheetFooter className="border-t">
          {isPending ? (
            <div className="h-24 animate-pulse rounded-xl bg-muted" aria-label="Loading account" />
          ) : user ? (
            <>
              <div className="mb-2 rounded-xl bg-muted/70 p-3">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{user.name}</p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  void handleSignOut();
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Your library starts here
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/signup" onClick={() => setOpen(false)} />}
              >
                Sign up
              </Button>
              <Button
                variant="outline"
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
