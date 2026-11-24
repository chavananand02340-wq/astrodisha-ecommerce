// MRP / discount helpers shared by product cards, product page and admin.

/** Whole-number % saved when an MRP higher than the selling price is set, else 0. */
export function discountPercent(price: number, mrp?: number | null): number {
  if (!mrp || !(mrp > price) || price < 0) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function formatINR(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}
