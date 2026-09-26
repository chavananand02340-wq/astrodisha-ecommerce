import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { getProductsByCategory } from "@/lib/getProducts";

export default async function GemstonesPage() {
  const categoryProducts = await getProductsByCategory("gemstones");

  return (
    <>
      <Header />

      <CategoryPage
        slug="gemstones"
        products={categoryProducts}
      />
    </>
  );
}
