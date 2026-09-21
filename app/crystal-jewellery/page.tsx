import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { getProductsByCategory } from "@/lib/getProducts";

export default async function CrystalJewelleryPage() {
  const categoryProducts = await getProductsByCategory("crystal-jewellery");

  return (
    <>
      <Header />

      <CategoryPage
        title="Crystal Jewellery"
        description="Elegant crystal jewellery crafted for everyday wear and spiritual intention."
        products={categoryProducts}
      />
    </>
  );
}
