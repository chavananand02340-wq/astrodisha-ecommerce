"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard, { type Product } from "../ProductCard";
import Icon from "../ui/Icon";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { WHATSAPP_URL } from "@/lib/site";

/* =====================================================================
   ProductBrowser — client-side search, filter and sort for any list of
   products (category pages + /shop). Everything is derived from the
   products already loaded on the server, so no extra requests are made.

   Filter groups are built automatically:
   • Price        — fixed ₹ bands (only bands that contain products show)
   • Category     — /shop only
   • Spec facets  — any admin "Specification" key used by 2+ products with
                    2–15 distinct values (e.g. Mukhi, Type, Origin, Planet)
   • Benefits     — admin Benefit titles shared by 2+ products
   • Availability — in-stock only
   ===================================================================== */

export type BrowserCategory = { name: string; slug: string; image?: string };

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

const PRICE_BANDS = [
  { id: "u500", label: "Under ₹500", min: 0, max: 500 },
  { id: "500-1000", label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { id: "1000-2500", label: "₹1,000 – ₹2,500", min: 1000, max: 2500 },
  { id: "2500-5000", label: "₹2,500 – ₹5,000", min: 2500, max: 5000 },
  { id: "5000-10000", label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { id: "10000+", label: "₹10,000 & above", min: 10000, max: Infinity },
];

const BENEFITS_KEY = "__benefits";
// Spec keys that are measurements, not useful as filters
const EXCLUDED_SPEC_KEYS = /^(weight|carat|ratti|size|dimension|dimensions|length|width|height|sku|code|certificate|report)/i;

type FacetGroup = { key: string; label: string; values: { value: string; count: number }[] };

const norm = (v: string) => v.trim().toLowerCase();
const titleCase = (v: string) => v.replace(/\s+/g, " ").trim().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

function matchesQuery(p: Product, query: string): boolean {
  const q = norm(query);
  if (!q) return true;
  const hay = [
    p.name,
    p.category,
    p.description,
    ...(p.specifications || []).map((s) => `${s.key} ${s.value}`),
    ...(p.benefits || []).map((b) => b.title),
  ]
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((word) => hay.includes(word));
}

function productFacetValues(p: Product, key: string): string[] {
  if (key === BENEFITS_KEY) {
    return (p.benefits || []).map((b) => b?.title?.trim()).filter(Boolean).map((t) => titleCase(t as string));
  }
  return (p.specifications || [])
    .filter((s) => s?.key && norm(s.key) === key && s.value?.trim())
    .map((s) => titleCase(s.value));
}

function buildFacets(products: Product[]): FacetGroup[] {
  const specMap = new Map<string, { label: string; values: Map<string, number>; products: Set<string> }>();

  for (const p of products) {
    for (const s of p.specifications || []) {
      if (!s?.key?.trim() || !s.value?.trim()) continue;
      const key = norm(s.key);
      if (EXCLUDED_SPEC_KEYS.test(key)) continue;
      const value = titleCase(s.value);
      if (value.length > 40) continue;
      if (!specMap.has(key)) specMap.set(key, { label: titleCase(s.key), values: new Map(), products: new Set() });
      const entry = specMap.get(key)!;
      entry.products.add(p.id);
      entry.values.set(value, (entry.values.get(value) || 0) + 1);
    }
  }

  const groups: FacetGroup[] = [];
  const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

  for (const [key, entry] of specMap) {
    if (entry.products.size < 2 || entry.values.size < 2 || entry.values.size > 15) continue;
    groups.push({
      key,
      label: entry.label,
      values: [...entry.values.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => collator.compare(a.value, b.value)),
    });
  }

  // Prefer the most useful groups first (Type / Mukhi / Planet …), then by coverage
  const priority = ["type", "mukhi", "planet", "rashi", "zodiac", "chakra", "origin", "colour", "color", "shape", "metal"];
  groups.sort((a, b) => {
    const pa = priority.indexOf(a.key);
    const pb = priority.indexOf(b.key);
    if (pa !== -1 || pb !== -1) return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
    return b.values.reduce((n, v) => n + v.count, 0) - a.values.reduce((n, v) => n + v.count, 0);
  });

  // Benefits: only titles shared by 2+ products, top 10
  const benefitCounts = new Map<string, number>();
  for (const p of products) {
    for (const v of new Set(productFacetValues(p, BENEFITS_KEY))) {
      benefitCounts.set(v, (benefitCounts.get(v) || 0) + 1);
    }
  }
  const benefitValues = [...benefitCounts.entries()]
    .filter(([v, c]) => c >= 2 && v.length <= 40)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([value, count]) => ({ value, count }));
  if (benefitValues.length >= 2) groups.push({ key: BENEFITS_KEY, label: "Benefits", values: benefitValues });

  return groups.slice(0, 6);
}

/* ---------------------------------------------------------------- */

export default function ProductBrowser({
  products,
  categories = [],
  showCategoryFilter = false,
  collectionName,
  initialQuery = "",
}: {
  products: Product[];
  categories?: BrowserCategory[];
  showCategoryFilter?: boolean;
  collectionName: string;
  initialQuery?: string;
}) {
  // A pre-filled search that matches nothing falls back to the full collection
  // with a gentle note, instead of opening on an empty grid.
  const [initialMatches] = useState(() => !initialQuery || products.some((p) => matchesQuery(p, initialQuery)));
  const [query, setQuery] = useState(initialMatches ? initialQuery : "");
  const [missedQuery, setMissedQuery] = useState(initialMatches ? "" : initialQuery);
  const [sort, setSort] = useState<SortKey>("featured");
  const [priceBands, setPriceBands] = useState<string[]>([]);
  const [facetSel, setFacetSel] = useState<Record<string, string[]>>({});
  const [inStockOnly, setInStockOnly] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const gridTopRef = useRef<HTMLDivElement>(null);

  const facets = useMemo(() => buildFacets(products), [products]);

  const availableBands = useMemo(
    () => PRICE_BANDS.filter((b) => products.some((p) => p.price >= b.min && p.price < b.max)),
    [products]
  );

  // Category chips for /shop — only categories that actually have products, with counts
  const categoryChips = useMemo(() => {
    if (!showCategoryFilter) return [];
    const counts = new Map<string, number>();
    for (const p of products) if (p.categorySlug) counts.set(p.categorySlug, (counts.get(p.categorySlug) || 0) + 1);
    const known = categories.filter((c) => counts.has(c.slug));
    // categories present on products but missing from the list
    for (const p of products) {
      if (p.categorySlug && !known.some((c) => c.slug === p.categorySlug)) {
        known.push({ name: p.category, slug: p.categorySlug });
      }
    }
    return known.map((c) => ({ ...c, count: counts.get(c.slug) || 0 }));
  }, [products, categories, showCategoryFilter]);

  const filtered = useMemo(() => {
    const q = norm(query);
    const bands = PRICE_BANDS.filter((b) => priceBands.includes(b.id));

    let list = products.filter((p) => {
      if (category && p.categorySlug !== category) return false;
      if (inStockOnly && (p.stock ?? 0) <= 0) return false;
      if (bands.length && !bands.some((b) => p.price >= b.min && p.price < b.max)) return false;
      for (const [key, values] of Object.entries(facetSel)) {
        if (!values.length) continue;
        const pv = productFacetValues(p, key);
        if (!values.some((v) => pv.includes(v))) return false;
      }
      if (q && !matchesQuery(p, q)) return false;
      return true;
    });

    if (sort !== "featured") {
      list = [...list].sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        return (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0);
      });
    }
    // Keep sold-out pieces at the end so the grid always opens with buyable items
    return [...list.filter((p) => (p.stock ?? 0) > 0), ...list.filter((p) => (p.stock ?? 0) <= 0)];
  }, [products, query, sort, priceBands, facetSel, inStockOnly, category]);

  const activeCount =
    priceBands.length + Object.values(facetSel).reduce((n, v) => n + v.length, 0) + (inStockOnly ? 1 : 0);

  function toggleIn<T>(list: T[], v: T) {
    return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
  }

  function toggleFacet(key: string, value: string) {
    setFacetSel((cur) => ({ ...cur, [key]: toggleIn(cur[key] || [], value) }));
  }

  function clearAll() {
    setPriceBands([]);
    setFacetSel({});
    setInStockOnly(false);
    setQuery("");
    setCategory(null);
  }

  function selectCategory(slug: string | null) {
    setCategory(slug);
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Lock page scroll + close on Escape while the mobile sheet is open
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  const activePills: { label: string; onRemove: () => void }[] = [
    ...priceBands.map((id) => ({
      label: PRICE_BANDS.find((b) => b.id === id)?.label || id,
      onRemove: () => setPriceBands((c) => c.filter((x) => x !== id)),
    })),
    ...Object.entries(facetSel).flatMap(([key, values]) =>
      values.map((v) => ({ label: v, onRemove: () => toggleFacet(key, v) }))
    ),
    ...(inStockOnly ? [{ label: "In stock", onRemove: () => setInStockOnly(false) }] : []),
  ];

  const filterPanel = (
    <FilterPanel
      facets={facets}
      availableBands={availableBands}
      priceBands={priceBands}
      onTogglePrice={(id) => setPriceBands((c) => toggleIn(c, id))}
      facetSel={facetSel}
      onToggleFacet={toggleFacet}
      inStockOnly={inStockOnly}
      onToggleStock={() => setInStockOnly((v) => !v)}
      activeCount={activeCount}
      onClear={() => {
        setPriceBands([]);
        setFacetSel({});
        setInStockOnly(false);
      }}
    />
  );

  return (
    <div>
      {/* CATEGORY QUICK NAV (/shop) */}
      {categoryChips.length > 1 && (
        <div className="-mx-4 mb-8 sm:mx-0">
          <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-4 pb-1 sm:flex-wrap sm:px-0">
            <CategoryChip label="All" count={products.length} active={!category} onClick={() => selectCategory(null)} />
            {categoryChips.map((c) => (
              <CategoryChip
                key={c.slug}
                label={c.name}
                image={c.image}
                count={c.count}
                active={category === c.slug}
                onClick={() => selectCategory(category === c.slug ? null : c.slug)}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={gridTopRef} className="scroll-mt-24 lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-10 xl:gap-12">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="no-scrollbar sticky top-[92px] max-h-[calc(100vh-110px)] overflow-y-auto pb-6">{filterPanel}</div>
        </aside>

        <div className="min-w-0">
          {/* TOOLBAR — sticky under the header on mobile */}
          <div className="sticky top-[68px] z-30 -mx-4 border-b border-astro-border bg-astro-bg/95 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div className="flex items-center gap-2.5">
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${collectionName.toLowerCase()}…`}
                aria-label={`Search in ${collectionName}`}
                leading={<Icon name="search" className="h-4 w-4" />}
                trailing={
                  query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-astro-mauve hover:bg-astro-surface"
                    >
                      <Icon name="close" className="h-3.5 w-3.5" />
                    </button>
                  ) : null
                }
                className="flex-1 lg:max-w-sm"
              />

              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="relative inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-astro-border bg-astro-card px-4 text-[13px] font-semibold text-astro-text transition hover:border-astro-gold lg:hidden"
                aria-haspopup="dialog"
              >
                <Icon name="filter" className="h-4 w-4" />
                <span className="hidden min-[380px]:inline">Filter</span>
                {activeCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-astro-primary px-1 text-[10px] text-astro-on-primary">
                    {activeCount}
                  </span>
                )}
              </button>

              <SortSelect value={sort} onChange={setSort} className="hidden sm:flex lg:ml-auto" />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 lg:mt-5">
              <p className="text-[13px] text-astro-mauve" aria-live="polite">
                <span className="font-semibold text-astro-text">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "piece" : "pieces"}
                {category && categoryChips.find((c) => c.slug === category) && (
                  <> in {categoryChips.find((c) => c.slug === category)?.name}</>
                )}
              </p>
              <SortSelect value={sort} onChange={setSort} compact className="sm:hidden" />
            </div>

            {activePills.length > 0 && (
              <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
                {activePills.map((pill) => (
                  <button
                    key={pill.label}
                    type="button"
                    onClick={pill.onRemove}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-astro-gold-soft px-3 py-1.5 text-[12px] font-medium text-astro-text transition hover:brightness-95"
                    aria-label={`Remove filter ${pill.label}`}
                  >
                    {pill.label}
                    <Icon name="close" className="h-3 w-3" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearAll}
                  className="shrink-0 px-2 text-[12px] font-semibold text-astro-primary underline-offset-4 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {missedQuery && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-astro-border bg-astro-gold-soft/60 px-4 py-3 text-[13px] text-astro-body">
              <Icon name="sparkle" className="mt-0.5 h-4 w-4 shrink-0 text-astro-accent" />
              <p className="flex-1">
                <span className="font-semibold capitalize text-astro-text">{missedQuery}</span> isn&apos;t in stock online right
                now — here&apos;s the full collection.{" "}
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-astro-primary underline underline-offset-2">
                  Ask us to source it
                </a>
              </p>
              <button type="button" onClick={() => setMissedQuery("")} aria-label="Dismiss" className="text-astro-mauve">
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* GRID */}
          <div className="pt-5 lg:pt-6">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 4} />
                ))}
              </div>
            ) : (
              <NoResults onClear={clearAll} />
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER SHEET */}
      {sheetOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            className="astro-backdrop absolute inset-0 bg-[rgba(22,8,40,0.45)]"
            onClick={() => setSheetOpen(false)}
          />
          <div className="astro-sheet absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[28px] bg-astro-bg shadow-astro-lg">
            <div className="flex items-center justify-between border-b border-astro-border px-5 pb-3 pt-3">
              <div>
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-astro-border" aria-hidden="true" />
                <h2 className="astro-serif text-[24px] text-astro-text">Refine</h2>
              </div>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Close filters"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-astro-surface text-astro-text"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="mb-6 sm:hidden">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-astro-mauve">Sort by</p>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setSort(o.value)}
                      aria-pressed={sort === o.value}
                      className={`rounded-full border px-3.5 py-2 text-[13px] transition ${
                        sort === o.value
                          ? "border-astro-primary bg-astro-primary text-astro-on-primary"
                          : "border-astro-border bg-astro-card text-astro-text"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              {filterPanel}
            </div>
            <div className="flex gap-3 border-t border-astro-border px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => {
                  setPriceBands([]);
                  setFacetSel({});
                  setInStockOnly(false);
                }}
              >
                Reset
              </Button>
              <Button size="lg" className="flex-[2]" onClick={() => setSheetOpen(false)}>
                Show {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */

function FilterPanel({
  facets,
  availableBands,
  priceBands,
  onTogglePrice,
  facetSel,
  onToggleFacet,
  inStockOnly,
  onToggleStock,
  activeCount,
  onClear,
}: {
  facets: FacetGroup[];
  availableBands: typeof PRICE_BANDS;
  priceBands: string[];
  onTogglePrice: (id: string) => void;
  facetSel: Record<string, string[]>;
  onToggleFacet: (key: string, value: string) => void;
  inStockOnly: boolean;
  onToggleStock: () => void;
  activeCount: number;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="mb-2 hidden items-center justify-between lg:flex">
        <h2 className="astro-serif text-[22px] text-astro-text">Refine</h2>
        {activeCount > 0 && (
          <button type="button" onClick={onClear} className="text-[12px] font-semibold text-astro-primary hover:underline">
            Clear ({activeCount})
          </button>
        )}
      </div>

      {availableBands.length > 1 && (
        <FilterGroup title="Price">
          {availableBands.map((b) => (
            <CheckRow key={b.id} label={b.label} checked={priceBands.includes(b.id)} onChange={() => onTogglePrice(b.id)} />
          ))}
        </FilterGroup>
      )}

      {facets.map((g) => (
        <FilterGroup key={g.key} title={g.label} collapsible={g.values.length > 6}>
          {g.values.map((v) => (
            <CheckRow
              key={v.value}
              label={v.value}
              count={v.count}
              checked={(facetSel[g.key] || []).includes(v.value)}
              onChange={() => onToggleFacet(g.key, v.value)}
            />
          ))}
        </FilterGroup>
      ))}

      <FilterGroup title="Availability">
        <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5 text-[14px] text-astro-body">
          In stock only
          <span className="relative inline-flex">
            <input type="checkbox" checked={inStockOnly} onChange={onToggleStock} className="peer sr-only" />
            <span className="h-6 w-11 rounded-full bg-astro-border transition peer-checked:bg-astro-emerald peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-astro-gold" />
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
          </span>
        </label>
      </FilterGroup>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 block rounded-[20px] border border-astro-border bg-astro-surface p-4 transition hover:border-astro-gold"
      >
        <Icon name="lotus" className="h-6 w-6 text-astro-accent" />
        <p className="astro-serif mt-2 text-[18px] leading-tight text-astro-text">Not sure what suits you?</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-astro-mauve">Message us on WhatsApp and we&apos;ll help you choose.</p>
        <span className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-astro-primary">
          Chat with us <Icon name="arrowRight" className="h-3.5 w-3.5" />
        </span>
      </a>
    </div>
  );
}

function FilterGroup({
  title,
  collapsible = false,
  children,
}: {
  title: string;
  collapsible?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const [showAll, setShowAll] = useState(!collapsible);
  const items = Array.isArray(children) ? children : [children];

  return (
    <section className="border-b border-astro-border py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-astro-mauve">{title}</span>
        <Icon
          name="chevronDown"
          className={`h-4 w-4 text-astro-mauve transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-2.5">
          {showAll ? items : items.slice(0, 6)}
          {collapsible && (
            <button
              type="button"
              onClick={() => setShowAll((s) => !s)}
              className="mt-1 text-[12.5px] font-semibold text-astro-primary hover:underline"
            >
              {showAll ? "Show less" : `Show all (${items.length})`}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-[7px] text-[14px] text-astro-body">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-astro-gold ${
          checked ? "border-astro-primary bg-astro-primary text-astro-on-primary" : "border-astro-border bg-astro-card group-hover:border-astro-gold"
        }`}
      >
        {checked && <Icon name="check" className="h-3 w-3" strokeWidth={2.6} />}
      </span>
      <span className={`flex-1 ${checked ? "font-medium text-astro-text" : ""}`}>{label}</span>
      {typeof count === "number" && <span className="text-[12px] text-astro-mauve">{count}</span>}
    </label>
  );
}

function SortSelect({
  value,
  onChange,
  compact = false,
  className = "",
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
  compact?: boolean;
  className?: string;
}) {
  return (
    <label
      className={`relative items-center gap-2 ${compact ? "flex text-[13px]" : "h-11 rounded-full border border-astro-border bg-astro-card pl-4 pr-9 text-[13px] transition hover:border-astro-gold"} ${className}`}
    >
      <Icon name="sort" className="h-4 w-4 shrink-0 text-astro-mauve" />
      <span className="sr-only">Sort products</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className={`cursor-pointer appearance-none bg-transparent font-semibold text-astro-text outline-none ${compact ? "pr-5" : ""}`}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevronDown"
        className={`pointer-events-none absolute h-3.5 w-3.5 text-astro-mauve ${compact ? "right-0" : "right-3.5"}`}
      />
    </label>
  );
}

function CategoryChip({
  label,
  image,
  count,
  active,
  onClick,
}: {
  label: string;
  image?: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group inline-flex shrink-0 items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 text-[13.5px] font-medium transition-all duration-300 ${
        active
          ? "border-astro-primary bg-astro-primary text-astro-on-primary shadow-astro-md"
          : "border-astro-border bg-astro-card text-astro-text hover:-translate-y-0.5 hover:border-astro-gold hover:shadow-astro-sm"
      } ${image ? "" : "pl-4"}`}
    >
      {image && (
        <span className="h-9 w-9 overflow-hidden rounded-full bg-astro-surface ring-1 ring-black/5">
          <img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        </span>
      )}
      {label}
      <span className={`text-[11.5px] ${active ? "opacity-75" : "text-astro-mauve"}`}>{count}</span>
    </button>
  );
}

function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-[28px] border border-dashed border-astro-border bg-astro-card px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-astro-gold-soft text-astro-accent">
        <Icon name="search" className="h-6 w-6" />
      </span>
      <h3 className="astro-serif mt-4 text-[26px] text-astro-text">Nothing matches just yet</h3>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-astro-mauve">
        Try loosening a filter or two — or ask us, and we&apos;ll help you find the right piece.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={onClear}>Clear all filters</Button>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center rounded-full border border-astro-border bg-astro-card px-6 text-[14px] font-semibold text-astro-text transition hover:border-astro-gold"
        >
          Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}
