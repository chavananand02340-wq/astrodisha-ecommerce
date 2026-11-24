import Icon, { type IconName } from "./ui/Icon";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site";

const TRUST: { icon: IconName; title: string; text: string }[] = [
  { icon: "shield", title: "100% Authentic", text: "Quality-checked pieces" },
  { icon: "sparkle", title: "Energised", text: "Mantra & sankalp" },
  { icon: "truck", title: "Free Shipping", text: `On orders above ₹${FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}` },
  { icon: "lotus", title: "Expert Guidance", text: "Help choosing, on WhatsApp" },
];

/** Four reassurance points. "row" scrolls on mobile; "grid" is 2×2 on mobile. */
export default function TrustStrip({ layout = "row" }: { layout?: "row" | "grid" }) {
  return (
    <section className="border-b border-astro-border bg-astro-bg">
      <ul
        className={
          layout === "grid"
            ? "mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-5 px-5 py-6 sm:px-8 lg:grid-cols-4 lg:gap-8 lg:py-6"
            : "no-scrollbar mx-auto flex max-w-7xl gap-6 overflow-x-auto px-5 py-4 sm:px-8 lg:grid lg:grid-cols-4 lg:gap-8 lg:py-5"
        }
      >
        {TRUST.map((t) => (
          <li key={t.title} className="flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-astro-border bg-astro-card text-astro-accent">
              <Icon name={t.icon} className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-astro-text">{t.title}</p>
              <p className="text-[12px] leading-snug text-astro-mauve">{t.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
