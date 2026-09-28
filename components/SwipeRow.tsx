"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SwipeRowProps = {
  items: ReactNode[];
  /** Optional connector rendered between items (e.g. an arrow). */
  separator?: ReactNode;
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;
  dotsClassName?: string;
  ariaLabel?: string;
};

/** Horizontal snap-scroll row with a dot indicator that follows the scroll. */
export default function SwipeRow({
  items,
  separator,
  className = "",
  itemClassName = "",
  separatorClassName = "",
  dotsClassName = "",
  ariaLabel,
}: SwipeRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const updateActive = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const nodes = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-swipe-item]")
    );
    if (nodes.length === 0) return;

    if (scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 4) {
      setActive(nodes.length - 1);
      return;
    }

    const padLeft = parseFloat(getComputedStyle(scroller).paddingLeft || "0");
    let best = 0;
    let bestDist = Infinity;

    nodes.forEach((node, i) => {
      const dist = Math.abs(node.offsetLeft - scroller.scrollLeft - padLeft);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });

    setActive(best);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.addEventListener("scroll", updateActive, { passive: true });
    return () => scroller.removeEventListener("scroll", updateActive);
  }, [updateActive]);

  function goTo(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const node = scroller.querySelectorAll<HTMLElement>("[data-swipe-item]")[index];
    if (!node) return;

    const padLeft = parseFloat(getComputedStyle(scroller).paddingLeft || "0");
    scroller.scrollTo({ left: node.offsetLeft - padLeft, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={scrollerRef}
        role="region"
        aria-label={ariaLabel}
        className={`no-scrollbar relative flex snap-x snap-mandatory overflow-x-auto ${className}`}
      >
        {items.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && separator && (
              <div aria-hidden="true" className={`shrink-0 ${separatorClassName}`}>
                {separator}
              </div>
            )}
            <div data-swipe-item className={`shrink-0 snap-start ${itemClassName}`}>
              {item}
            </div>
          </Fragment>
        ))}
      </div>

      <div className={`mt-4 flex justify-center gap-2 ${dotsClassName}`}>
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to item ${i + 1}`}
            onClick={() => goTo(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: active === i ? 20 : 8,
              backgroundColor: active === i ? "var(--astro-accent)" : "var(--astro-border)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
