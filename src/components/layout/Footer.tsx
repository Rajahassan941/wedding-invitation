import { Heart } from "lucide-react";
import { weddingConfig } from "@/config/wedding";

export function Footer() {
  const { footer } = weddingConfig;
  return (
    <footer className="border-t border-gold/25 bg-emerald-deep px-5 py-8 text-center text-ivory/70">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs tracking-[0.18em] uppercase">
        <span>{footer.madeWith}</span>
        <Heart className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden="true" />
        {footer.credit && <span className="normal-case tracking-wide">{footer.credit}</span>}
      </p>
    </footer>
  );
}
