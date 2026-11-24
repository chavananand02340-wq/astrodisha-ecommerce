import type { SVGProps } from "react";

/**
 * One shared line-icon set (24×24, stroke = currentColor).
 * Usage: <Icon name="heart" className="h-5 w-5" />
 */
const PATHS = {
  heart: (
    <path d="M12 20s-7-4.4-9.2-8.6C1.2 8.2 3 4.8 6.4 4.5c2-.2 3.8.9 5.6 3 1.8-2.1 3.6-3.2 5.6-3 3.4.3 5.2 3.7 3.6 6.9C19 15.6 12 20 12 20z" />
  ),
  bag: (
    <>
      <path d="M6 7h12l-1 13H7L6 7z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  sort: <path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z" />
      <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16z" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  lotus: (
    <>
      <path d="M12 4c-1.8 2-2.7 4.2-2.7 6.5S10.2 15 12 17c1.8-2 2.7-4.2 2.7-6.5S13.8 6 12 4z" />
      <path d="M12 17c-2.5-.3-4.6-1.5-6-3.5.3-2.3 1.5-4 3.4-5" />
      <path d="M12 17c2.5-.3 4.6-1.5 6-3.5-.3-2.3-1.5-4-3.4-5" />
      <path d="M12 17c-3.3.6-6.3-.1-9-2 1.2-1.3 2.6-2.1 4.2-2.4" />
      <path d="M12 17c3.3.6 6.3-.1 9-2-1.2-1.3-2.6-2.1-4.2-2.4" />
    </>
  ),
  gem: (
    <>
      <path d="M6.5 4h11L21 9l-9 11L3 9l3.5-5z" />
      <path d="M3 9h18M9.5 4L8 9l4 11M14.5 4L16 9l-4 11" />
    </>
  ),
  certificate: (
    <>
      <rect x="4" y="3" width="16" height="13" rx="2" />
      <path d="M8 8h8M8 11h5" />
      <path d="M9 16l-1 5 4-2 4 2-1-5" />
    </>
  ),
  star: (
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5z" />
  ),
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({
  name,
  strokeWidth = 1.7,
  filled = false,
  ...rest
}: { name: IconName; filled?: boolean } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
