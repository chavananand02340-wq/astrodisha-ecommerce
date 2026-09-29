import Link from "next/link";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import Reveal from "@/components/Reveal";
import SwipeRow from "@/components/SwipeRow";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getFeaturedProducts } from "@/lib/getProducts";
import { getActiveBanner } from "@/lib/getBanner";
import { getActiveTestimonials } from "@/lib/getTestimonials";
import { WHATSAPP_URL, ALL_PRODUCTS_URL, WHATSAPP_ICON_PATH } from "@/lib/site";
import { createClient } from "@/utils/supabase/server";

/* Simple line icons (gold via --astro-accent) */
const ICONS = {
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z" />
      <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  gem: (
    <>
      <path d="M6.5 4h11L21 9l-9 11L3 9l3.5-5z" />
      <path d="M3 9h18M9.5 4L8 9l4 11M14.5 4L16 9l-4 11" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16z" />
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
  droplet: <path d="M12 3c3.5 4.2 6 7.3 6 10.5a6 6 0 0 1-12 0C6 10.3 8.5 7.2 12 3z" />,
  flame: (
    <path d="M12 3c1 3 4 4.5 4 8.5a4 4 0 0 1-8 0c0-1.6.7-2.7 1.5-3.6.3 1.3 1 1.9 1.7 2C11.3 7.6 11.3 5.3 12 3z" />
  ),
  truck: (
    <>
      <path d="M3 6h11v9H3z" />
      <path d="M14 9h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17" cy="17.5" r="1.6" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5v-16z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5a2.5 2.5 0 0 1 2.5 2.5v-16z" />
    </>
  ),
};

function LineIcon({ icon, className }: { icon: React.ReactNode; className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="var(--astro-accent)"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={WHATSAPP_ICON_PATH} />
    </svg>
  );
}

/* Hero photos: drop these files into public/images/ — until then the
   cream/gold gradient below shows (a missing file simply falls through). */
const HERO_MOBILE = "/images/hero-mobile-1.jpg";
const HERO_DESKTOP = "/images/hero-desktop.jpg";
const HERO_FALLBACK = "linear-gradient(150deg, #f7efe3 0%, #f0dcc2 55%, #e7cba7 100%)";

/* Journey photos: same idea — public/images/journey-*.jpg */
const JOURNEY_STEPS = [
  { n: "01", title: "DISCOVER", text: "Find what aligns with you.", icon: ICONS.lotus, img: "/images/journey-1-discover.jpg" },
  { n: "02", title: "AUTHENTICATE", text: "Tested for authenticity and quality.", icon: ICONS.gem, img: "/images/journey-2-authenticate.jpg" },
  { n: "03", title: "PURIFY", text: "Cleansed with traditional shuddhi process.", icon: ICONS.droplet, img: "/images/journey-3-purify.jpg" },
  { n: "04", title: "CONSECRATE", text: "Energised with mantra and sankalp.", icon: ICONS.flame, img: "/images/journey-4-consecrate.jpg" },
  { n: "05", title: "DELIVER", text: "Carefully packed and delivered to your doorstep.", icon: ICONS.truck, img: "/images/journey-5-deliver.jpg" },
  { n: "06", title: "ALIGN", text: "Guidance on how to wear and use for best results.", icon: ICONS.book, img: "/images/journey-6-align.jpg" },
];

const WHY_ITEMS = [
  {
    slug: "authenticity",
    icon: ICONS.shield,
    title: "Authenticity First",
    text: "Products presented with clear information and quality-focused selection.",
  },
  {
    slug: "secure-checkout",
    icon: ICONS.card,
    title: "Secure Checkout",
    text: "Simple, safe and seamless — every step kept secure and transparent.",
  },
  {
    slug: "quality-assured",
    icon: ICONS.gem,
    title: "Quality Assured",
    text: "Carefully selected products and clear information so you can choose with confidence.",
  },
  {
    slug: "expert-guidance",
    icon: ICONS.user,
    title: "Expert Guidance",
    text: "Get help understanding products before making your choice.",
  },
  {
    slug: "premium-experience",
    icon: ICONS.sparkle,
    title: "Premium Experience",
    text: "A calm, elegant shopping experience designed around your journey.",
  },
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8);
  const activeBanner = await getActiveBanner();
  const testimonials = await getActiveTestimonials(6);

  const supabase = await createClient();
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("name, slug, description, image_url")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const categories = (categoriesData || []).map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    image: c.image_url || "/images/placeholder-product.svg",
  }));

  // An active banner (festival etc.) set in admin overrides the default hero photo
  const heroMobileImage = activeBanner?.image_url || HERO_MOBILE;
  const heroDesktopImage = activeBanner?.image_url || HERO_DESKTOP;

  return (
    <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen">
      <Header />

      {/* HERO — photo behind, text on a soft cream fade (mobile-first) */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage: `url("${heroMobileImage}"), ${HERO_FALLBACK}`,
            backgroundSize: "cover",
            backgroundPosition: "72% center, center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage: `url("${heroDesktopImage}"), ${HERO_FALLBACK}`,
            backgroundSize: "cover",
            backgroundPosition: "right center, center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Readability fades (use the page background token, so they follow the theme).
            Mobile: strong + wide, since the heading/description text spans further right.
            Desktop: lighter + narrower, since that photo already has empty sky on the left. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(90deg, color-mix(in srgb, var(--astro-bg) 90%, transparent) 0%, color-mix(in srgb, var(--astro-bg) 78%, transparent) 45%, color-mix(in srgb, var(--astro-bg) 35%, transparent) 68%, transparent 90%), linear-gradient(0deg, var(--astro-bg) 0%, transparent 30%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, color-mix(in srgb, var(--astro-bg) 80%, transparent) 0%, color-mix(in srgb, var(--astro-bg) 55%, transparent) 20%, transparent 58%)",
          }}
        />

        <div className="relative mx-auto flex min-h-[600px] max-w-7xl flex-col justify-start px-5 pb-8 pt-7 sm:min-h-
