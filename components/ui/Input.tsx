import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Optional icon rendered inside the field on the left */
  leading?: ReactNode;
  /** Optional element (e.g. clear button) rendered on the right */
  trailing?: ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leading, trailing, className = "", ...rest },
  ref
) {
  return (
    <div
      className={`group flex h-11 items-center gap-2 rounded-full border border-astro-border bg-astro-card px-4 text-astro-text transition-[border-color,box-shadow] duration-300 focus-within:border-astro-gold focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--astro-gold)_18%,transparent)] ${className}`}
    >
      {leading && <span className="shrink-0 text-astro-mauve">{leading}</span>}
      <input
        ref={ref}
        className="h-full w-full min-w-0 bg-transparent text-[14px] outline-none placeholder:text-astro-mauve/70 focus-visible:outline-none"
        {...rest}
      />
      {trailing}
    </div>
  );
});

export default Input;
