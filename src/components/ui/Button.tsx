import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "light" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full font-sans font-medium uppercase tracking-[0.2em] transition-[background-color,color,border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "border border-gold/70 bg-emerald text-ivory shadow-[0_12px_30px_-14px_var(--color-emerald)] hover:bg-emerald-deep hover:shadow-[0_16px_36px_-14px_var(--color-emerald)]",
  outline: "border border-gold bg-transparent text-emerald hover:bg-emerald hover:text-ivory",
  light: "border border-gold/80 bg-ivory/5 text-ivory backdrop-blur-sm hover:bg-gold hover:text-emerald-deep",
  ghost: "text-emerald hover:text-gold-ink",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.65rem]",
  md: "px-6 py-3 text-[0.7rem]",
  lg: "px-9 py-4 text-xs",
};

/** A soft sheen sweeps across the button on hover. */
function Sheen() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[400%] motion-reduce:hidden"
    />
  );
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ref,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> }) {
  return (
    <button ref={ref} type={type} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Sheen />
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  external,
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { external?: boolean }) {
  return (
    <a
      className={cn(base, variants[variant], sizes[size], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <Sheen />
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
