// Presentation copy for category pages (hero line, verse, local fallback image).
// Category name / description / image still come from Supabase (admin → Categories);
// this only adds the poetic layer. Edit any wording here freely — keep the
// "promises" to things the store actually guarantees. A new category added in admin works without an
// entry here — it simply falls back to DEFAULT_CONTENT.

export type CategoryContent = {
  /** Small uppercase line above the title */
  eyebrow: string;
  /** One short, poetic line shown under the title */
  verse: string;
  /** Local hero image used when the category has no image in admin */
  image?: string;
  /** Three short reassurance points shown in the hero */
  promises: string[];
};

const DEFAULT_CONTENT: CategoryContent = {
  eyebrow: "The ASTRODISHA Collection",
  verse: "Chosen with clarity, offered with intention.",
  promises: ["100% authentic", "Energised before dispatch", "Pan-India delivery"],
};

const CONTENT: Record<string, Partial<CategoryContent>> = {
  gemstones: {
    eyebrow: "Navratna & precious stones",
    verse: "Light held in stone, chosen for the planets that guide you.",
    image: "/images/category-gemstones.webp",
    promises: ["Authenticity assured", "Energised before dispatch", "Pan-India delivery"],
  },
  crystals: {
    eyebrow: "Healing crystals",
    verse: "Quiet companions for intention, calm and everyday energy.",
    image: "/images/category-crystals.webp",
    promises: ["Hand-selected pieces", "Energised before dispatch", "Pan-India delivery"],
  },
  rudraksha: {
    eyebrow: "Sacred seeds of Shiva",
    verse: "Ancient beads, worn close to the heart for steadiness and grace.",
    image: "/images/category-rudraksha.webp",
    promises: ["Authentic beads", "Energised before dispatch", "Pan-India delivery"],
  },
  "crystal-jewellery": {
    eyebrow: "Wearable intention",
    verse: "Everyday elegance, carrying the gentle energy of crystal.",
    image: "/images/category-crystal-jewellery.webp",
    promises: ["Genuine crystals", "Made for daily wear", "Pan-India delivery"],
  },
  puja: {
    eyebrow: "For your sacred space",
    verse: "Traditional essentials to bring devotion home, simply.",
    image: "/images/category-puja.webp",
  },
  "divine-products": {
    eyebrow: "Blessed objects",
    verse: "Sacred forms that turn a corner of home into a place of prayer.",
    image: "/images/category-divine-products.webp",
  },
};

export function getCategoryContent(slug?: string): CategoryContent {
  const extra = slug ? CONTENT[slug] : undefined;
  return { ...DEFAULT_CONTENT, ...(extra || {}) };
}

/** Local image for a slug, if we ship one in /public/images */
export function getCategoryFallbackImage(slug?: string): string | undefined {
  return slug ? CONTENT[slug]?.image : undefined;
}
