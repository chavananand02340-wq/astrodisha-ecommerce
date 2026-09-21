import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { getProductsByCategory } from "@/lib/getProducts";

export default async function CrystalsPage() {
  const categoryProducts = await getProductsByCategory("crystals");

  return (
    <>
      <Header />

      <CategoryPage
        title="Crystals"
        description="Beautiful crystals for intention, mindfulness and everyday spiritual practices."
        products={categoryProducts}
      />
    </>
  );
}
