import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { getProductsByCategory } from "@/lib/getProducts";

export default async function CrystalsPage() {
  const categoryProducts = await getProductsByCategory("crystals");

  return (
    <>
      <Header />

      <CategoryPage
        slug="crystals"
        products={categoryProducts}
      />
    </>
  );
}
