import Link from "next/link";
import Header from "@/components/Header";
import ProductDetails from "@/components/ProductDetails";
import { getProductBySlug } from "@/lib/getProducts";

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <>
        <Header />

        <main
          style={{ backgroundColor: "var(--astro-bg)" }}
          className="flex min-h-[70vh] items-center justify-center px-5 text-center"
        >
          <div>
            <h1 style={{ color: "var(--astro-text)" }} className="astro-serif text-4xl">
              Product Not Found
            </h1>

            <p style={{ color: "var(--astro-mauve)" }} className="mt-3 text-sm">
              This product may have been removed or is not available.
            </p>

            <Link
              href="/shop"
              style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
              className="mt-6 inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold transition hover:opacity-90"
            >
              Browse All Products
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <ProductDetails product={product} />
    </>
  );
}
