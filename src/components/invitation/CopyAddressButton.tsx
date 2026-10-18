"use client";

import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "copied" | "failed";

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers / non-secure contexts.
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  } catch {
    return false;
  }
}

export function CopyAddressButton({ address }: { address: string }) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const t = window.setTimeout(() => setStatus("idle"), 2500);
    return () => window.clearTimeout(t);
  }, [status]);

  return (
    <>
      <Button variant="outline" onClick={async () => setStatus((await copyText(address)) ? "copied" : "failed")}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={status === "copied" ? "check" : "copy"}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="inline-flex"
            aria-hidden="true"
          >
            {status === "copied" ? <Check className="h-4 w-4" strokeWidth={1.5} /> : <Copy className="h-4 w-4" strokeWidth={1.5} />}
          </motion.span>
        </AnimatePresence>
        {status === "copied" ? "Copied" : "Copy Address"}
      </Button>
      <span role="status" className="sr-only">
        {status === "copied" ? "Address copied to clipboard" : status === "failed" ? "Could not copy the address" : ""}
      </span>
      {status === "failed" && <span className="text-xs text-ink-muted">Copy failed — please select the address above.</span>}
    </>
  );
}
