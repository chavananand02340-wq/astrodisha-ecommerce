import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { getProductsByCategory } from "@/lib/getProducts";

export default async function PujaPage() {
  const categoryProducts = await getProductsByCategory("puja");

  return (
    <>
      <Header />

      <CategoryPage
        title="Puja Essentials"
        description="Traditional essentials curated for your everyday spiritual practices."
        products={categoryProducts}
      />
    </>
  );
}
