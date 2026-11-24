import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[0.01em] " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-astro)] " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-astro-primary text-astro-on-primary shadow-astro-sm hover:bg-astro-primary-hover hover:shadow-astro-md",
  secondary:
    "border border-astro-border bg-astro-card text-astro-text hover:border-astro-gold hover:shadow-astro-sm",
  ghost: "text-astro-text hover:bg-astro-surface",
  gold: "bg-astro-gold text-[#1d0b38] shadow-astro-sm hover:brightness-105 hover:shadow-astro-md",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-6 text-[14px]",
  lg: "h-[52px] px-8 text-[15px]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${extra}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export default function Button({ variant = "primary", size = "md", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...rest} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  external = false,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  children: ReactNode;
}) {
  const cls = buttonClasses(variant, size, className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
