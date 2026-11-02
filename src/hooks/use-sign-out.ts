"use client";

import { useRouter } from "next/navigation";

import { useToastManager } from "@/components/ui/toast";
import { signOut } from "@/lib/auth-client";

export function useSignOut() {
  const router = useRouter();
  const toastManager = useToastManager();

  return async function handleSignOut() {
    try {
      const result = await signOut();
      if (result.error) {
        toastManager.add({ type: "error", title: "Couldn’t sign out", description: result.error.message });
        return;
      }

      toastManager.add({ type: "success", title: "Signed out", description: "You’ve been safely signed out of BookNook." });
      router.replace("/");
      router.refresh();
    } catch {
      toastManager.add({ type: "error", title: "Couldn’t sign out", description: "Please try again." });
    }
  };
}
