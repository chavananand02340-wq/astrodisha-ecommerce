import { Skeleton, ProductGridSkeleton } from "../ui/Skeleton";

/** Loading state for /shop and category pages — mirrors the real layout. */
export default function CatalogSkeleton() {
  return (
    <main className="min-h-screen bg-astro-bg" aria-busy="true">
      <section className="border-b border-astro-border bg-astro-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-10 pt-12 sm:px-8 md:grid-cols-12 lg:pb-20 lg:pt-14">
          <div className="space-y-4 md:col-span-7">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-14 w-3/4 sm:h-20" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="hidden md:col-span-5 md:block">
            <Skeleton className="mx-auto aspect-[4/5] w-full max-w-[400px] rounded-t-full rounded-b-[32px]" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-8">
        <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-10 xl:gap-12">
          <div className="hidden space-y-5 lg:block">
            <Skeleton className="h-7 w-24" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
          <div>
            <div className="mb-6 flex gap-3">
              <Skeleton className="h-11 flex-1 rounded-full lg:max-w-sm" />
              <Skeleton className="h-11 w-40 rounded-full" />
            </div>
            <ProductGridSkeleton count={8} />
          </div>
        </div>
      </section>
    </main>
  );
}
