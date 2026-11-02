import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, Mail, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your BookNook account profile.",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin?callbackUrl=%2Fprofile");

  const user = session.user;

  return (
    <section className="keep-content-center w-full py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
            <BookOpen className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your BookNook account</p>
            <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Reader profile</h1>
          </div>
        </div>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">Your reader details and profile photo, all together in one place.</p>

        <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-border/75 bg-card/90 shadow-xl shadow-foreground/5 backdrop-blur-sm">
          <div className="h-28 bg-[radial-gradient(ellipse_at_12%_0%,color-mix(in_srgb,var(--accent)_58%,transparent),transparent_52%),radial-gradient(ellipse_at_88%_15%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_48%),linear-gradient(115deg,color-mix(in_srgb,var(--primary)_9%,var(--card)),color-mix(in_srgb,var(--accent)_20%,var(--card)))] sm:h-36" />
          <div className="relative -mt-12 flex flex-col items-center gap-4 px-6 pb-7 text-center sm:-mt-14 sm:flex-row sm:items-end sm:gap-5 sm:px-8 sm:text-left">
            <Avatar className="size-20 shrink-0 border-4 border-card bg-card shadow-lg shadow-foreground/10">
              {user.image ? <AvatarImage src={user.image} alt={`${user.name}'s profile photo`} /> : null}
              <AvatarFallback className="bg-primary/10 font-heading text-2xl font-semibold text-primary">
                {getInitials(user.name) || <UserRound className="size-8" aria-hidden="true" />}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 pb-1">
              <h2 className="truncate font-heading text-2xl font-semibold text-foreground">{user.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">BookNook reader</p>
            </div>
          </div>

          <dl className="grid gap-3 px-6 pb-6 sm:grid-cols-2 sm:px-8 sm:pb-8">
            <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-border/70 bg-background/65 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 pt-0.5">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Email address</dt>
                <dd className="mt-1 break-all text-sm font-medium text-foreground">{user.email}</dd>
              </div>
            </div>
            <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-border/70 bg-background/65 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/55 text-accent-foreground">
                <UserRound className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 pt-0.5">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Display name</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{user.name}</dd>
              </div>
            </div>
          </dl>

          <div className="flex justify-center border-t border-border/70 bg-muted/20 p-5 sm:justify-end sm:px-8">
            <Button className="w-full rounded-full sm:w-auto" nativeButton={false} render={<Link href="/books" />}>
              Browse books <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
