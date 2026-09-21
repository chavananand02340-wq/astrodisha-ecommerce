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

        <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f3ec] px-5 text-center">
          <div>
            <h1 className="astro-serif text-4xl text-[#3e2237]">
              Product Not Found
            </h1>

            <p className="mt-3 text-sm text-[#8a607a]">
              This product may have been removed or is not available.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-sm bg-[#5a3150] px-6 py-3 text-xs font-semibold text-white"
            >
              Back to Home
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
