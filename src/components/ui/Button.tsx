import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary";
type Size = "md" | "sm";

const base =
  "text-button inline-flex items-center justify-center gap-2 rounded-md transition-all duration-150 ease-out active:scale-[0.97] active:duration-75 disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-fg-muted disabled:active:scale-100";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-light",
  secondary:
    "bg-transparent text-fg border border-fg-secondary hover:bg-surface-alt",
};

const sizes: Record<Size, string> = {
  md: "px-7 py-3",
  sm: "px-4 py-2",
};

function classes(variant: Variant, size: Size, className?: string) {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return <button className={classes(variant, size, className)} {...props} />;
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({ href, variant = "primary", size = "md", className, ...props }: ButtonLinkProps) {
  return <Link href={href} className={classes(variant, size, className)} {...props} />;
}
