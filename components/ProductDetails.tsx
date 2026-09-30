"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product, PdpCertificate } from "./ProductCard";
import { useStore } from "./StoreProvider";
import { WHATSAPP_NUMBER, WHATSAPP_ICON_PATH } from "@/lib/site";
import { createClient } from "@/utils/supabase/client";
import {
  STANDARD_DELIVERY_DAYS,
  MUHURAT_DELIVERY_DAYS,
  SUPPORT_WHATSAPP_DISPLAY,
  CANCELLATION_WINDOW_HOURS,
  COD_ADVANCE_AMOUNT,
  REFUND_PROCESSING_DAYS,
} from "@/lib/legal-info";

const HEART_PATH =
  "M12 20s-7-4.4-9.2-8.6C1.2 8.2 3 4.8 6.4 4.5c2-.2 3.8.9 5.6 3 1.8-2.1 3.6-3.2 5.6-3 3.4.3 5.2 3.7 3.6 6.9C19 15.6 12 20 12 20z";

const CART_ICON_PATH_1 = "M6 7h12l-1 13H7L6 7z";
const CART_ICON_PATH_2 = "M9 7a3 3 0 0 1 6 0";

const STAR_PATH =
  "M12 2.5l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3l-6.2 3.5 1.6-6.8-5.2-4.6 6.9-.6z";

const GOLD = "#C6A15B";

const TRUST_STRIP = [
  {
    label: "100% Authentic",
    icon: (
      <>
        <path d="M6 3h12l3 6-9 12L3 9z" />
        <path d="M3 9h18" />
        <path d="M9 3l3 6 3-6" />
        <path d="M12 21L9 9M12 21l3-12" />
      </>
    ),
  },
  {
    label: "Lab Certified & Purity Check",
    icon: (
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="M9 14.5L7.5 21 12 18.5 16.5 21 15 14.5" />
        <path d="M9.5 9l1.8 1.8 3.2-3.3" />
      </>
    ),
  },
  {
    label: "Pan India Delivery",
    icon: (
      <>
        <path d="M3 6h11v9H3z" />
        <path d="M14 9h4l3 3v3h-7" />
        <circle cx="7" cy="17.5" r="1.6" />
        <circle cx="17" cy="17.5" r="1.6" />
      </>
    ),
  },
  {
    label: "Secure Payments",
    icon: (
      <>
        <path d="M12 3L4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

type ReviewRow = {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string | null;
  created_at: string;
};

function Star({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "var(--astro-accent)" : "none"}
      stroke={filled ? "var(--astro-accent)" : "var(--astro-border)"}
      strokeWidth={1.5}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

function ChevronIcon({ direction, className }: { direction: "left" | "right"; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

// ---------------- PDP ACCORDION HELPERS ----------------

const FREE_SHIPPING_THRESHOLD = 999; // keep same as Header + Supabase site_settings

// Line icons used by admin-selected keys (Batch 2 icon dropdown) + section headers.
const ICONS: Record<string, React.ReactNode> = {
  ring: (
    <>
      <circle cx="12" cy="14.5" r="6" />
      <path d="M9.5 8.8L12 5l2.5 3.8" />
      <path d="M10.2 5h3.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </>
  ),
  puja: (
    <>
      <path d="M3 15h18c-.6 2.8-3 4.5-9 4.5S3.6 17.8 3 15z" />
      <path d="M12 12.5c-1.4 0-2.2-.9-2.2-2 0-1.4 1.5-2.2 2.2-4.2.7 2 2.2 2.8 2.2 4.2 0 1.1-.8 2-2.2 2z" />
      <path d="M6.5 15v-1.5M17.5 15v-1.5" />
    </>
  ),
  om: (
    <text x="12" y="17.5" textAnchor="middle" fontSize="15" fill="currentColor" stroke="none">
      ॐ
    </text>
  ),
  hand: (
    <>
      <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M11 10V4a1.5 1.5 0 0 1 3 0v7" />
      <path d="M14 10.5V6a1.5 1.5 0 0 1 3 0v7.5c0 4-2.5 7-6 7-2.6 0-4-1.2-5.4-3.4L3.8 14a1.4 1.4 0 0 1 2.3-1.6L8 15" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  water: <path d="M12 3.5c3 4 6 7.2 6 10.5a6 6 0 0 1-12 0c0-3.3 3-6.5 6-10.5z" />,
  tag: (
    <>
      <path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9-8-8z" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.5 3.5 5.3 3.5 8.5s-1.2 6-3.5 8.5c-2.3-2.5-3.5-5.3-3.5-8.5S9.7 6 12 3.5z" />
    </>
  ),
  diamond: (
    <>
      <path d="M6 4h12l3 5-9 11L3 9z" />
      <path d="M3 9h18M9 4l3 5 3-5M12 20L9 9M12 20l3-11" />
    </>
  ),
  quality: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9 13.8L7.5 21 12 18.6 16.5 21 15 13.8" />
    </>
  ),
  weight: (
    <>
      <path d="M6.5 8h11l2.5 12H4z" />
      <circle cx="12" cy="5.5" r="2" />
      <path d="M10 14h4" />
    </>
  ),
  ruler: (
    <>
      <rect x="2.5" y="8" width="19" height="8" rx="1.5" />
      <path d="M6.5 8v3M10.5 8v4M14.5 8v3M18.5 8v4" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.5-1-2.6 0-1 .8-1.7 1.8-1.7h2.2a3.7 3.7 0 0 0 3.7-3.7c0-4.2-3.8-7.3-8.5-7.3z" />
      <circle cx="7.5" cy="11" r="1" />
      <circle cx="10" cy="7.5" r="1" />
      <circle cx="14.5" cy="7.5" r="1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3L4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  star: <path d="M12 3.5l2.6 5.5 6 .6-4.5 4 1.3 5.9L12 16.4l-5.4 3.1 1.3-5.9-4.5-4 6-.6z" />,
  note: (
    <>
      <path d="M6 3.5h8l4 4v13H6z" />
      <path d="M14 3.5v4h4M9 12h6M9 15.5h6" />
    </>
  ),
  // Section header icons
  namaste: (
    <>
      <path d="M12 4c-1 1.5-2.5 5-2.5 8.5V20" />
      <path d="M12 4c1 1.5 2.5 5 2.5 8.5V20" />
      <path d="M9.5 14l-4 3.5M14.5 14l4 3.5M9.5 20h5" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v9H3z" />
      <path d="M14 9h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17" cy="17.5" r="1.6" />
    </>
  ),
  box: (
    <>
      <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
      <path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
    </>
  ),
  cash: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  undo: (
    <>
      <path d="M4 8.5h14l-3.5-3.5" />
      <path d="M20 15.5H6l3.5 3.5" />
    </>
  ),
  refund: (
    <>
      <path d="M4 12a8 8 0 1 0 2.3-5.7" />
      <path d="M4 4v4h4" />
      <path d="M12 8v8M9.5 10.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
};

function PdpIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name] || ICONS.note}
    </svg>
  );
}

function IconCircle({ name, size = "h-12 w-12", iconSize = "h-6 w-6" }: { name: string; size?: string; iconSize?: string }) {
  return (
    <span
      style={{ backgroundColor: "rgba(198,161,91,0.16)", color: GOLD }}
      className={`flex shrink-0 items-center justify-center rounded-full ${size}`}
    >
      <PdpIcon name={name} className={iconSize} />
    </span>
  );
}

function AccordionSection({
  id,
  icon,
  title,
  subtitle,
  open,
  onToggle,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
      className="overflow-hidden rounded-2xl border"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5"
      >
        <PdpIcon name={icon} className="h-6 w-6 shrink-0 text-[color:var(--astro-primary)]" />
        <span className="min-w-0 flex-1">
          <span style={{ color: "var(--astro-text)" }} className="astro-serif block text-[17px] leading-snug sm:text-lg">
            {title}
          </span>
          {open && (
            <span style={{ color: "var(--astro-mauve)" }} className="mt-0.5 block text-[12.5px] leading-snug">
              {subtitle}
            </span>
          )}
        </span>
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 transition-transform duration-200"
          style={{ color: "var(--astro-primary)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        id={`${id}-panel`}
        role="region"
        aria-label={title}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-3 pb-4 sm:px-5 sm:pb-5">{children}</div>
        </div>
      </div>
    </section>
  );
}

// Inner card used inside every accordion
function InfoCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-bg)" }}
      className={`rounded-2xl border p-3.5 sm:p-4 ${className}`}
    >
      {children}
    </div>
  );
}

function NoteBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{ backgroundColor: "rgba(182,155,238,0.16)", borderColor: "rgba(182,155,238,0.35)" }}
      className="mt-3 flex gap-3 rounded-2xl border p-3.5 sm:p-4"
    >
      <PdpIcon name="note" className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--astro-primary)]" />
      <div>
        <p style={{ color: "var(--astro-text)" }} className="astro-serif text-[15px]">
          {title}
        </p>
        <div style={{ color: "var(--astro-mauve)" }} className="mt-0.5 text-[13px] leading-5">
          {children}
        </div>
      </div>
    </div>
  );
}

const CERT_LABELS: { key: keyof PdpCertificate; label: string }[] = [
  { key: "lab_name", label: "Laboratory" },
  { key: "report_number", label: "Report No." },
  { key: "weight", label: "Weight" },
  { key: "shape", label: "Shape & Cut" },
  { key: "dimensions", label: "Dimensions" },
  { key: "colour", label: "Colour" },
  { key: "species", label: "Species" },
  { key: "variety", label: "Variety" },
  { key: "treatment", label: "Treatment" },
  { key: "comments", label: "Comments" },
];

export default function ProductDetails({ product, related = [] }: { product: Product; related?: Product[] }) {
  const router = useRouter();
  const { cart, addToCart, updateQuantity, showToast, toggleWishlist, isWishlisted } = useStore();

  const galleryImages =
    product.images && product.images.length > 0 ? product.images : [product.image];
  const imageCount = galleryImages.length;

  // Gallery
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Lightbox (full-screen zoom)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const zoomBoxRef = useRef<HTMLDivElement>(null);

  // Purchase
  const [qty, setQty] = useState(1);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [viewingCertificate, setViewingCertificate] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [activeIndex]);

  function showImage(index: number) {
    const next = ((index % imageCount) + imageCount) % imageCount;
    if (next === activeIndex) return;
    setImageLoaded(false);
    setZoomed(false);
    setActiveIndex(next);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40 || imageCount < 2) return;
    showImage(dx < 0 ? activeIndex + 1 : activeIndex - 1);
  }

  // Lock page scroll + keyboard controls while the lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      else if (viewingCertificate) return;
      else if (e.key === "ArrowRight") showImage(activeIndex + 1);
      else if (e.key === "ArrowLeft") showImage(activeIndex - 1);
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, activeIndex, viewingCertificate]);

  // When zooming in, start from the centre of the image
  useEffect(() => {
    const box = zoomBoxRef.current;
    if (!zoomed || !box) return;
    const timer = window.setTimeout(() => {
      box.scrollLeft = (box.scrollWidth - box.clientWidth) / 2;
      box.scrollTop = (box.scrollHeight - box.clientHeight) / 2;
    }, 30);
    return () => window.clearTimeout(timer);
  }, [zoomed]);

  function openLightbox() {
    setZoomed(false);
    setViewingCertificate(false);
    setLightboxOpen(true);
  }

  function openCertificate() {
    setZoomed(false);
    setViewingCertificate(true);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setZoomed(false);
    setLightboxOpen(false);
    setViewingCertificate(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("reviews")
        .select("id, customer_name, rating, review_text, created_at")
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        setReviews(!error && data ? (data as ReviewRow[]) : []);
        setReviewsLoading(false);
      }
    }

    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  const liveCount = reviews.length;
  const liveAverage =
    liveCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / liveCount : 0;
  const liveStars = Math.round(liveAverage);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setReviewMsg("");

    if (!reviewerName.trim() || reviewRating === 0) {
      setReviewMsg("Please add your name and a star rating.");
      return;
    }

    setSubmittingReview(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        product_id: product.id,
        customer_name: reviewerName.trim(),
        rating: reviewRating,
        review_text: reviewText.trim() || null,
        is_approved: true,
      })
      .select("id, customer_name, rating, review_text, created_at")
      .single();

    setSubmittingReview(false);

    if (error) {
      setReviewMsg("Failed to submit: " + error.message);
      return;
    }

    if (data) {
      setReviews((current) => [data as ReviewRow, ...current]);
    }

    setReviewerName("");
    setReviewRating(0);
    setReviewText("");
    setReviewMsg("Thank you! Your review has been posted.");
  }

  const wishlisted = isWishlisted(product.id);

  const stock = product.stock ?? 0;
  const outOfStock = stock <= 0;
  const lowStock = !outOfStock && stock <= 5;
  const safeQty = Math.min(Math.max(qty, 1), Math.max(stock, 1));

  const categoryHref = product.categorySlug ? `/${product.categorySlug}` : "/shop";

  const specs = product.specifications || [];

  // ---- Accordion content (hidden automatically when empty) ----
  const benefits = (product.benefits || []).filter((b) => b.title);
  const howToWear = (product.howToWear || []).filter((s) => s.title);
  // New Product Details from admin; falls back to the old Specifications list if not filled yet
  const detailRows =
    product.productDetails && product.productDetails.length > 0
      ? product.productDetails.filter((d) => d.label && d.value)
      : specs.filter((s) => s.key && s.value).map((s) => ({ label: s.key, value: s.value, icon: "note" }));
  const certificate: PdpCertificate = product.certificate || {};
  const certRows = CERT_LABELS.filter(({ key }) => (certificate[key] || "").trim()).map(({ key, label }) => ({
    label,
    value: (certificate[key] || "").trim(),
  }));
  const certificateUrl = product.certificateImageUrl || "";
  const hasCertificate = certRows.length > 0 || !!certificateUrl;

  // Shipping & Returns — same values as the legal pages (lib/legal-info.ts)
  const shippingRows = [
    {
      icon: "box",
      title: "Free Shipping",
      text: `Free delivery on orders above ₹${FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}.`,
    },
    {
      icon: "calendar",
      title: "Delivery Timeline",
      text: `Standard delivery usually takes ${STANDARD_DELIVERY_DAYS}, depending on your location and courier partner.`,
    },
    {
      icon: "moon",
      title: "Muhurat / Ritual-Timed Delivery",
      text: `Need delivery on an auspicious date? Tell us when ordering. Such orders may take ${MUHURAT_DELIVERY_DAYS}.`,
    },
    { icon: "pin", title: "Pan India Delivery", text: "We deliver across India." },
    {
      icon: "cash",
      title: "Cash on Delivery (COD)",
      text: `Available with a ₹${COD_ADVANCE_AMOUNT} advance paid online, adjusted against your order total.`,
    },
    {
      icon: "undo",
      title: "Cancellation",
      text: `Cancel within ${CANCELLATION_WINDOW_HOURS} hours of ordering for a full refund. After that, the ₹${COD_ADVANCE_AMOUNT} advance is non-refundable.`,
    },
    {
      icon: "shield",
      title: "Returns",
      text: "Accepted only for defective or damaged products. A clear, continuous unboxing video is mandatory to claim a return.",
    },
    {
      icon: "refund",
      title: "Refunds",
      text: `Approved refunds are processed within ${REFUND_PROCESSING_DAYS}.`,
    },
    {
      icon: "chat",
      title: "Need Help?",
      text: `WhatsApp us at ${SUPPORT_WHATSAPP_DISPLAY} for any delivery or return query.`,
    },
  ];

  function toggleSection(key: string) {
    setOpenSections((current) => ({ ...current, [key]: !current[key] }));
  }

  // Cart/wishlist only need the basic fields — keeps the saved cart small.
  const baseProduct: Product = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    categorySlug: product.categorySlug,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image: product.image,
    images: product.images,
    rating: product.rating,
    reviewCount: product.reviewCount,
    specifications: product.specifications,
  };
  const longDescription = (product.description || "").length > 140;

  const askMessage = outOfStock
    ? `Hi ASTRODISHA, "${product.name}" is out of stock. Please let me know when it's back.`
    : `Hi ASTRODISHA, I am interested in "${product.name}". I would like expert guidance regarding this product.`;

  const askUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(askMessage)}`;

  // Adds the selected quantity. Returns false if nothing could be added.
  function addSelectedToCart(): boolean {
    if (outOfStock) return false;

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      if (existing.quantity >= stock) {
        showToast(`Only ${stock} of ${product.name} available`);
        return false;
      }
      updateQuantity(product.id, Math.min(existing.quantity + safeQty, stock));
      showToast(`${product.name} added to cart`);
      return true;
    }

    addToCart(baseProduct);
    if (safeQty > 1) {
      updateQuantity(product.id, safeQty);
    }
    return true;
  }

  // Buy Now: make sure the product is in the cart (without doubling it), then go to checkout.
  function handleBuyNow() {
    if (outOfStock) return;

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      if (existing.quantity < safeQty) {
        updateQuantity(product.id, safeQty);
      }
    } else {
      addToCart(baseProduct);
      if (safeQty > 1) {
        updateQuantity(product.id, safeQty);
      }
    }

    router.push("/checkout");
  }

  return (
    <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen px-4 pb-10 pt-3 sm:px-8 sm:pt-6">
      <div className="mx-auto max-w-6xl">
        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="no-scrollbar overflow-x-auto">
          <ol className="flex items-center gap-1.5 whitespace-nowrap text-[12px]">
            <li>
              <Link href="/" style={{ color: "var(--astro-mauve)" }} className="transition hover:opacity-75">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronIcon direction="right" className="h-3 w-3 opacity-60" />
            </li>
            <li>
              <Link href={categoryHref} style={{ color: "var(--astro-mauve)" }} className="transition hover:opacity-75">
                {product.category}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronIcon direction="right" className="h-3 w-3 opacity-60" />
            </li>
            <li style={{ color: "var(--astro-text)" }} className="font-medium" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-3 grid gap-6 md:mt-5 md:grid-cols-2 md:gap-12">
          {/* GALLERY */}
          <div>
            <div
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse opacity-60" style={{ backgroundColor: "var(--astro-border)" }} />
              )}

              <button
                type="button"
                onClick={openLightbox}
                aria-label="Open image full screen"
                className="block h-full w-full cursor-zoom-in"
              >
                <img
                  ref={imgRef}
                  src={galleryImages[activeIndex]}
                  alt={`${product.name} - image ${activeIndex + 1}`}
                  loading="eager"
                  className={`h-full w-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  } ${outOfStock ? "opacity-70 grayscale-[30%]" : ""}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(event) => {
                    const image = event.currentTarget;
                    if (!image.src.includes("placeholder-product.svg")) {
                      image.src = "/images/placeholder-product.svg";
                    }
                    setImageLoaded(true);
                  }}
                />
              </button>

              {/* Zoom button */}
              <button
                type="button"
                onClick={openLightbox}
                aria-label="Zoom image"
                style={{ backgroundColor: "var(--astro-card)", color: "var(--astro-primary)" }}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-[0_2px_8px_rgba(36,16,70,0.15)] transition active:scale-95"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5" />
                </svg>
              </button>

              {imageCount > 1 && (
                <span
                  style={{ backgroundColor: "rgba(22,8,40,0.55)" }}
                  className="pointer-events-none absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-medium text-white"
                >
                  {activeIndex + 1} / {imageCount}
                </span>
              )}

              {outOfStock && (
                <div
                  style={{ backgroundColor: "rgba(22,8,40,0.5)" }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <span
                    style={{ backgroundColor: "var(--astro-card)", color: "var(--astro-text)" }}
                    className="rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wide"
                  >
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* THUMBNAILS — 4 visible, scroll if more */}
            {imageCount > 1 && (
              <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto">
                {galleryImages.map((img, index) => (
                  <button
                    key={img + index}
                    type="button"
                    aria-label={`Show image ${index + 1}`}
                    aria-current={index === activeIndex}
                    onClick={() => showImage(index)}
                    style={{
                      borderColor: index === activeIndex ? "var(--astro-primary)" : "var(--astro-border)",
                      borderWidth: index === activeIndex ? "2px" : "1px",
                      flex: "0 0 calc((100% - 1.5rem) / 4)",
                    }}
                    className="aspect-[4/3] overflow-hidden rounded-lg border"
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="md:pt-1">
            <h1 style={{ color: "var(--astro-text)" }} className="astro-serif text-[28px] leading-tight sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating — real reviews only */}
            <div className="mt-2 min-h-[20px]">
              {!reviewsLoading &&
                (liveCount > 0 ? (
                  <a href="#reviews" className="flex items-center gap-1 text-sm">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} filled={n <= liveStars} className="h-4 w-4" />
                    ))}
                    <span style={{ color: "var(--astro-mauve)" }} className="ml-1 text-xs">
                      {liveAverage.toFixed(1)} ({liveCount} review{liveCount === 1 ? "" : "s"})
                    </span>
                  </a>
                ) : (
                  <a href="#reviews" style={{ color: "var(--astro-mauve)" }} className="text-xs">
                    No reviews yet
                  </a>
                ))}
            </div>

            <p style={{ color: "var(--astro-primary)" }} className="mt-2 text-[28px] font-bold leading-none">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            {/* Stock pill */}
            <div className="mt-3">
              {outOfStock ? (
                <span
                  style={{ backgroundColor: "rgba(194,65,42,0.12)", color: "#C2412A" }}
                  className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                >
                  Out of Stock
                </span>
              ) : (
                <span
                  style={{ backgroundColor: "rgba(63,163,77,0.15)", color: "#3FA34D" }}
                  className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                >
                  {lowStock ? `In Stock — only ${stock} left` : "In Stock"}
                </span>
              )}
            </div>

            {/* DESCRIPTION — Read More */}
            {product.description && (
              <div className="mt-3">
                <p
                  style={{ color: "var(--astro-mauve)" }}
                  className={`text-[15px] leading-7 ${descExpanded ? "" : "line-clamp-3"}`}
                >
                  {product.description}
                </p>
                {longDescription && (
                  <button
                    type="button"
                    onClick={() => setDescExpanded((v) => !v)}
                    style={{ color: "var(--astro-primary)" }}
                    className="mt-1 text-sm font-semibold underline underline-offset-2"
                  >
                    {descExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            )}

            {/* QUANTITY + WISHLIST */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <div
                style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
                className={`flex h-12 items-center rounded-[10px] border ${outOfStock ? "opacity-50" : ""}`}
              >
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={outOfStock || safeQty <= 1}
                  onClick={() => setQty(Math.max(1, safeQty - 1))}
                  style={{ color: "var(--astro-primary)" }}
                  className="flex h-12 w-12 items-center justify-center text-xl disabled:opacity-40"
                >
                  −
                </button>
                <span
                  style={{ color: "var(--astro-text)" }}
                  className="w-8 text-center text-[15px] font-semibold"
                  aria-live="polite"
                >
                  {outOfStock ? 0 : safeQty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={outOfStock || safeQty >= stock}
                  onClick={() => setQty(Math.min(stock, safeQty + 1))}
                  style={{ color: "var(--astro-primary)" }}
                  className="flex h-12 w-12 items-center justify-center text-xl disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(baseProduct)}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlisted}
                style={{
                  borderColor: wishlisted ? "var(--astro-accent)" : "var(--astro-border)",
                  backgroundColor: "var(--astro-card)",
                  color: wishlisted ? "var(--astro-accent)" : "var(--astro-primary)",
                }}
                className="flex h-12 w-12 items-center justify-center rounded-[10px] border transition active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill={wishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={HEART_PATH} />
                </svg>
              </button>
            </div>

            {/* ACTIONS */}
            <button
              type="button"
              disabled={outOfStock}
              onClick={addSelectedToCart}
              style={
                outOfStock
                  ? { backgroundColor: "var(--astro-border)", color: "var(--astro-mauve)" }
                  : { backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }
              }
              className={`mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] text-[15px] font-semibold transition duration-150 ${
                outOfStock ? "cursor-not-allowed" : "hover:opacity-90 active:scale-[0.99]"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={CART_ICON_PATH_1} />
                <path d={CART_ICON_PATH_2} />
              </svg>
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            {!outOfStock && (
              <button
                type="button"
                onClick={handleBuyNow}
                style={{ backgroundColor: "var(--astro-buy-bg, #E8B23F)", color: "var(--astro-buy-text, #160828)" }}
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] text-[15px] font-semibold transition duration-150 hover:opacity-90 active:scale-[0.99]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
                </svg>
                Buy Now
              </button>
            )}

            <a
              href={askUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderColor: "var(--astro-primary)", color: "var(--astro-primary)" }}
              className="mt-3 flex h-12 items-center justify-center gap-2 rounded-[10px] border text-[14px] font-semibold transition hover:opacity-80"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d={WHATSAPP_ICON_PATH} />
              </svg>
              {outOfStock ? "Ask When It's Back in Stock" : "Ask an Expert About This Product"}
            </a>

            {/* TRUST STRIP */}
            <div
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="mt-5 grid grid-cols-4 rounded-2xl border py-3"
            >
              {TRUST_STRIP.map((item, i) => (
                <div
                  key={item.label}
                  style={{ borderColor: "var(--astro-border)" }}
                  className={`flex flex-col items-center gap-1.5 px-1 text-center ${i > 0 ? "border-l" : ""}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke={GOLD}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </svg>
                  <span style={{ color: "var(--astro-text)" }} className="text-[10.5px] leading-[1.3] sm:text-xs">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* PRODUCT INFORMATION ACCORDIONS — all closed by default */}
        <div className="mt-8 space-y-3">
          {benefits.length > 0 && (
            <AccordionSection
              id="pdp-benefits"
              icon="diamond"
              title={`Benefits of ${product.name}`}
              subtitle="What this product is traditionally associated with."
              open={!!openSections.benefits}
              onToggle={() => toggleSection("benefits")}
            >
              <div className="space-y-2.5">
                {benefits.map((b, i) => (
                  <InfoCard key={b.title + i}>
                    <div className="flex gap-3">
                      <span style={{ backgroundColor: GOLD }} className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full" aria-hidden="true" />
                      <div className="min-w-0">
                        <h3 style={{ color: "var(--astro-text)" }} className="astro-serif text-[17px] leading-snug">
                          {b.title}
                        </h3>
                        {b.description && (
                          <p style={{ color: "var(--astro-mauve)" }} className="mt-1 text-[14px] leading-6">
                            {b.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </InfoCard>
                ))}
              </div>
              <p style={{ color: "var(--astro-mauve)" }} className="mt-4 text-[12px] leading-5 opacity-90">
                Benefits described above reflect traditional astrological beliefs and practices. They are not
                guarantees of specific health, financial, career or relationship outcomes.
              </p>
            </AccordionSection>
          )}

          {howToWear.length > 0 && (
            <AccordionSection
              id="pdp-how-to-wear"
              icon="namaste"
              title="How to Wear"
              subtitle="Follow these simple steps before wearing."
              open={!!openSections.wear}
              onToggle={() => toggleSection("wear")}
            >
              <ol>
                {howToWear.map((step, i) => (
                  <li key={step.title + i} className="relative flex gap-2.5 pb-2.5 last:pb-0 sm:gap-3">
                    {/* Number + dotted timeline */}
                    <div className="relative w-8 shrink-0 pt-[22px] sm:w-9 sm:pt-[21px]">
                      {i < howToWear.length - 1 && (
                        <span
                          aria-hidden="true"
                          style={{ borderColor: GOLD }}
                          className="absolute left-1/2 top-[38px] h-full -translate-x-1/2 border-l border-dashed opacity-60"
                        />
                      )}
                      <span
                        style={{ backgroundColor: "rgba(198,161,91,0.2)", color: GOLD }}
                        className="astro-serif relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[15px] font-semibold sm:h-9 sm:w-9"
                      >
                        {i + 1}
                      </span>
                    </div>
                    <InfoCard className="flex min-w-0 flex-1 items-start gap-3">
                      <IconCircle name={step.icon} />
                      <div className="min-w-0">
                        <h3 style={{ color: "var(--astro-text)" }} className="astro-serif text-[16px] leading-snug sm:text-[17px]">
                          {step.title}
                        </h3>
                        {step.description && (
                          <p style={{ color: "var(--astro-mauve)" }} className="mt-1 text-[13.5px] leading-[1.5]">
                            {step.description}
                          </p>
                        )}
                      </div>
                    </InfoCard>
                  </li>
                ))}
              </ol>
              <NoteBox title="Important Note">
                Always consult an expert for personalised guidance before wearing.{" "}
                <a href={askUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--astro-primary)" }} className="font-semibold underline underline-offset-2">
                  Ask an expert
                </a>
              </NoteBox>
            </AccordionSection>
          )}

          {detailRows.length > 0 && (
            <AccordionSection
              id="pdp-details"
              icon="note"
              title="Product Details"
              subtitle="Complete information about this product."
              open={!!openSections.details}
              onToggle={() => toggleSection("details")}
            >
              <div className="space-y-2.5">
                {detailRows.map((row, i) => (
                  <InfoCard key={row.label + i} className="flex items-center gap-3">
                    <IconCircle name={row.icon} />
                    <div className="min-w-0">
                      <h3 style={{ color: "var(--astro-text)" }} className="astro-serif text-[16px] leading-snug sm:text-[17px]">
                        {row.label}
                      </h3>
                      <p style={{ color: "var(--astro-mauve)" }} className="mt-0.5 whitespace-pre-line text-[14px] leading-[1.5]">
                        {row.value}
                      </p>
                    </div>
                  </InfoCard>
                ))}
              </div>
            </AccordionSection>
          )}

          {hasCertificate && (
            <AccordionSection
              id="pdp-certificate"
              icon="quality"
              title="Certification & Purity"
              subtitle="Certificate details for this product."
              open={!!openSections.certificate}
              onToggle={() => toggleSection("certificate")}
            >
              {certRows.length > 0 && (
                <InfoCard>
                  <dl>
                    {certRows.map((row, i) => (
                      <div
                        key={row.label}
                        style={{ borderColor: "var(--astro-border)" }}
                        className={`flex gap-3 py-2 text-[14px] ${i > 0 ? "border-t" : ""}`}
                      >
                        <dt style={{ color: "var(--astro-mauve)" }} className="w-[38%] shrink-0">
                          {row.label}
                        </dt>
                        <dd style={{ color: "var(--astro-text)" }} className="min-w-0 flex-1 font-medium">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </InfoCard>
              )}

              {certificateUrl && (
                <button
                  type="button"
                  onClick={openCertificate}
                  aria-label="View certificate full screen"
                  style={{ borderColor: "var(--astro-border)", backgroundColor: "#ffffff" }}
                  className="mt-3 block w-full overflow-hidden rounded-2xl border p-2 text-left"
                >
                  <img
                    src={certificateUrl}
                    alt={`${product.name} laboratory certificate`}
                    loading="lazy"
                    className="mx-auto max-h-[340px] w-auto object-contain"
                  />
                  <span style={{ color: "var(--astro-primary)" }} className="mt-2 flex items-center justify-center gap-1.5 text-[13px] font-semibold">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="6.5" />
                      <path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5" />
                    </svg>
                    Tap to view full certificate
                  </span>
                </button>
              )}

              <NoteBox title="Note">Certificate details may vary depending on the laboratory and product.</NoteBox>
            </AccordionSection>
          )}

          <AccordionSection
            id="pdp-shipping"
            icon="truck"
            title="Shipping & Returns"
            subtitle="Delivery, cancellation and return information."
            open={!!openSections.shipping}
            onToggle={() => toggleSection("shipping")}
          >
            <div className="space-y-2.5">
              {shippingRows.map((row) => (
                <InfoCard key={row.title} className="flex items-center gap-3">
                  <IconCircle name={row.icon} />
                  <div className="min-w-0">
                    <h3 style={{ color: "var(--astro-text)" }} className="astro-serif text-[16px] leading-snug sm:text-[17px]">
                      {row.title}
                    </h3>
                    <p style={{ color: "var(--astro-mauve)" }} className="mt-0.5 text-[13.5px] leading-[1.5]">
                      {row.text}
                    </p>
                  </div>
                </InfoCard>
              ))}
            </div>
            <NoteBox title="Note">
              Please make sure your address and phone number are correct, and record an unboxing video when you open
              your parcel. Full details:{" "}
              <Link href="/shipping-delivery" style={{ color: "var(--astro-primary)" }} className="font-semibold underline underline-offset-2">
                Shipping Policy
              </Link>{" "}
              ·{" "}
              <Link href="/cancellation-refund" style={{ color: "var(--astro-primary)" }} className="font-semibold underline underline-offset-2">
                Cancellation &amp; Refund Policy
              </Link>
            </NoteBox>
          </AccordionSection>
        </div>

        {/* REVIEWS */}
        <section id="reviews" style={{ scrollMarginTop: "90px" }} className="mt-10">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 style={{ color: "var(--astro-text)" }} className="astro-serif text-2xl sm:text-[28px]">
                Customer Reviews
              </h2>
              {!reviewsLoading && liveCount > 0 && (
                <p className="mt-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} filled={n <= liveStars} className="h-4 w-4" />
                  ))}
                  <span style={{ color: "var(--astro-mauve)" }} className="ml-1 text-xs">
                    {liveAverage.toFixed(1)} · {liveCount} review{liveCount === 1 ? "" : "s"}
                  </span>
                </p>
              )}
            </div>
            {liveCount > 1 && (
              <button
                type="button"
                onClick={() => setShowAllReviews((v) => !v)}
                style={{ color: "var(--astro-primary)" }}
                className="flex shrink-0 items-center gap-1 text-[13px] font-semibold"
              >
                {showAllReviews ? "Show Less" : "See All"}
                <ChevronIcon direction="right" className={`h-3.5 w-3.5 transition-transform ${showAllReviews ? "-rotate-90" : ""}`} />
              </button>
            )}
          </div>

          {reviewsLoading ? (
            <p style={{ color: "var(--astro-mauve)" }} className="mt-4 text-sm">
              Loading reviews...
            </p>
          ) : liveCount > 0 ? (
            <div
              className={
                showAllReviews
                  ? "mt-4 space-y-3"
                  : "no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
              }
            >
              {reviews.map((r) => (
                <article
                  key={r.id}
                  style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
                  className={`rounded-2xl border p-4 ${showAllReviews ? "" : "w-[86%] shrink-0 snap-start sm:w-[380px]"}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      style={{ backgroundColor: "rgba(182,155,238,0.28)", color: "var(--astro-primary)" }}
                      className="astro-serif flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-semibold"
                      aria-hidden="true"
                    >
                      {(r.customer_name.trim()[0] || "A").toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p style={{ color: "var(--astro-text)" }} className="truncate text-sm font-semibold">
                          {r.customer_name}
                        </p>
                        <p style={{ color: "var(--astro-mauve)" }} className="shrink-0 text-[11px]">
                          {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <p className="mt-0.5 flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} filled={n <= r.rating} className="h-3.5 w-3.5" />
                        ))}
                        <span style={{ color: "var(--astro-mauve)" }} className="ml-1 text-[11px]">
                          {r.rating.toFixed(1)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {r.review_text && (
                    <div className="mt-3 flex items-start gap-3">
                      <p
                        style={{ color: "var(--astro-mauve)" }}
                        className={`min-w-0 flex-1 text-[13.5px] leading-[1.55] ${showAllReviews ? "" : "line-clamp-4"}`}
                      >
                        {r.review_text}
                      </p>
                      <img
                        src={product.image}
                        alt=""
                        loading="lazy"
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="mt-4 rounded-2xl border p-5 text-center"
            >
              <p style={{ color: "var(--astro-mauve)" }} className="text-sm">
                No reviews yet. Be the first to review this product.
              </p>
            </div>
          )}

          {/* WRITE A REVIEW — opens on tap */}
          <div
            style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
            className="mt-4 overflow-hidden rounded-2xl border"
          >
            <button
              type="button"
              onClick={() => setShowReviewForm((v) => !v)}
              aria-expanded={showReviewForm}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left sm:px-5"
            >
              <span style={{ color: "var(--astro-text)" }} className="astro-serif text-[17px]">
                Write a Review
              </span>
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 transition-transform duration-200"
                style={{ color: "var(--astro-primary)", transform: showReviewForm ? "rotate(180deg)" : "rotate(0deg)" }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="px-4 pb-5 sm:px-5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`Rate ${n} star${n === 1 ? "" : "s"}`}
                      onClick={() => setReviewRating(n)}
                    >
                      <Star filled={n <= reviewRating} className="h-7 w-7" />
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Your name"
                  style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-bg)", color: "var(--astro-text)" }}
                  className="mt-3 h-11 w-full rounded-lg border px-3 text-sm outline-none"
                />

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product (optional)"
                  style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-bg)", color: "var(--astro-text)" }}
                  className="mt-3 min-h-[80px] w-full rounded-lg border p-3 text-sm outline-none"
                />

                <button
                  type="submit"
                  disabled={submittingReview}
                  style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                  className="mt-4 h-11 rounded-full px-6 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>

          {reviewMsg && (
            <p
              style={{ color: reviewMsg.startsWith("Thank") ? "var(--astro-accent)" : "#B00020" }}
              className="mt-2 text-xs font-semibold"
            >
              {reviewMsg}
            </p>
          )}
        </section>

        {/* YOU MAY ALSO LIKE */}
        {related.length > 0 && (
          <section className="mt-10">
            <div className="flex items-end justify-between gap-3">
              <h2 style={{ color: "var(--astro-text)" }} className="astro-serif text-2xl sm:text-[28px]">
                You May Also Like
              </h2>
              <Link href={categoryHref} style={{ color: "var(--astro-primary)" }} className="flex shrink-0 items-center gap-1 text-[13px] font-semibold">
                View All
                <ChevronIcon direction="right" className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              {related.map((item) => (
                <div key={item.id} className="flex w-[62%] shrink-0 snap-start sm:w-[260px]">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* LIGHTBOX — full-screen viewer with swipe + tap-to-zoom */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} images`}
          style={{ backgroundColor: "rgba(12,4,24,0.96)" }}
          className="fixed inset-0 z-[95] flex flex-col"
        >
          <div
            className="flex items-center justify-between px-4 pb-2"
            style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
          >
            <span className="text-xs text-white/80">
              {viewingCertificate ? "Certificate" : `${activeIndex + 1} / ${imageCount}`}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d={zoomed ? "M16 16l4.5 4.5M8.5 11h5" : "M16 16l4.5 4.5M11 8.5v5M8.5 11h5"} />
                </svg>
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={zoomBoxRef}
            className={`relative min-h-0 flex-1 ${zoomed ? "overflow-auto" : "flex items-center justify-center overflow-hidden px-3"}`}
            onTouchStart={zoomed || viewingCertificate ? undefined : handleTouchStart}
            onTouchEnd={zoomed || viewingCertificate ? undefined : handleTouchEnd}
          >
            <img
              src={viewingCertificate ? certificateUrl : galleryImages[activeIndex]}
              alt={viewingCertificate ? `${product.name} certificate` : `${product.name} - image ${activeIndex + 1}`}
              onClick={() => setZoomed((z) => !z)}
              style={zoomed ? { width: "250%", maxWidth: "none" } : undefined}
              className={zoomed ? "block cursor-zoom-out" : "max-h-full max-w-full cursor-zoom-in object-contain"}
            />

            {imageCount > 1 && !zoomed && !viewingCertificate && (
              <>
                <button
                  type="button"
                  onClick={() => showImage(activeIndex - 1)}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white"
                >
                  <ChevronIcon direction="left" className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => showImage(activeIndex + 1)}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white"
                >
                  <ChevronIcon direction="right" className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          <p
            className="px-4 pt-2 text-center text-[11px] text-white/60"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            {zoomed ? "Drag to move around · tap image to zoom out" : "Tap image to zoom · swipe for more"}
          </p>
        </div>
      )}
    </main>
  );
      }
