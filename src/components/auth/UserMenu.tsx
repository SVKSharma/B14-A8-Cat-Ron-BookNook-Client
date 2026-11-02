"use client";

import Link from "next/link";
import { ChevronDown, LogOut, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/hooks/use-sign-out";
import type { AuthUser } from "@/lib/auth-client";

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function UserMenu({ user }: { user: AuthUser }) {
  const handleSignOut = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="h-11 gap-2 rounded-full border-border bg-card px-2.5 pr-3 text-foreground shadow-sm hover:bg-muted" />
        }
        aria-label={`Open account menu for ${user.name}`}
      >
        <Avatar className="size-8" size="sm">
          {user.image ? <AvatarImage src={user.image} alt="" /> : null}
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials(user.name) || "BN"}</AvatarFallback>
        </Avatar>
        <span className="max-w-28 truncate text-sm font-medium">{user.name}</span>
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl border border-border/80 bg-popover p-1.5 shadow-xl">
        <div className="px-2 py-2">
          <span className="block truncate text-sm font-semibold text-foreground">{user.name}</span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{user.email}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/profile" />} className="rounded-lg py-2">
          <UserRound aria-hidden="true" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => void handleSignOut()}
          className="rounded-lg py-2"
        >
          <LogOut aria-hidden="true" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
