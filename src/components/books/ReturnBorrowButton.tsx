"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, LoaderCircle, RotateCcw } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToastManager } from "@/components/ui/toast";
import { deleteBorrow } from "@/lib/api";
import { getBrowserAccessToken } from "@/lib/auth-token-client";

export function ReturnBorrowButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const toastManager = useToastManager();
  const [open, setOpen] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [returned, setReturned] = useState(false);

  async function returnBook() {
    if (isReturning) return;
    setIsReturning(true);
    try {
      await deleteBorrow(id, await getBrowserAccessToken());
      setOpen(false);
      setReturned(true);
      toastManager.add({ type: "success", title: "Book returned", description: `“${title}” has been removed from My Borrows.` });
      router.refresh();
    } catch (error) {
      toastManager.add({
        type: "error",
        title: "Couldn’t return this book",
        description: error instanceof Error && error.name === "TimeoutError"
          ? "The request took too long. Please try again."
          : error instanceof Error ? error.message : "Please try again in a moment.",
      });
    } finally {
      setIsReturning(false);
    }
  }

  if (returned) return <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Check className="size-4" aria-hidden="true" /> Returned</span>;

  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !isReturning && setOpen(nextOpen)}>
      <AlertDialogTrigger render={<Button type="button" variant="outline" className="h-10 rounded-full px-4 text-sm"><RotateCcw aria-hidden="true" /> Return book</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-primary/10 text-primary"><RotateCcw aria-hidden="true" /></AlertDialogMedia>
          <AlertDialogTitle>Return this book?</AlertDialogTitle>
          <AlertDialogDescription>Mark “{title}” as returned and remove it from your active borrows.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isReturning}>Keep borrowing</AlertDialogCancel>
          <Button onClick={() => void returnBook()} disabled={isReturning}>
            {isReturning ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}
            {isReturning ? "Returning…" : "Confirm return"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
