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
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
          {NAV_LINKS.map((link) => {
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
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Your library starts here
          </p>
          <Button
            nativeButton={false}
            render={
              <Link href="/register" onClick={() => setOpen(false)} />
            }
          >
            Create an account
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/login" onClick={() => setOpen(false)} />}
          >
            Login
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
