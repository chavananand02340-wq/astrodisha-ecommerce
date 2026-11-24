/** Shimmering placeholder block. Size it with className (e.g. "h-4 w-24"). */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`astro-skeleton rounded-xl ${className}`} />;
}

/** Matches the ProductCard layout so the grid doesn't jump when data arrives. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[22px] border border-astro-border bg-astro-card">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2.5 p-3.5 sm:p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-10 rounded-full sm:w-28" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
