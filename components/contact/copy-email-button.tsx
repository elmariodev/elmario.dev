"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyEmailButton({
  email,
  className,
}: {
  email: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the address stays visible to copy by hand.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "focus-ring inline-flex h-12 items-center gap-2 rounded-md border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      {copied ? (
        <CheckIcon className="size-4 text-emerald-500" />
      ) : (
        <CopyIcon className="size-4" />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
