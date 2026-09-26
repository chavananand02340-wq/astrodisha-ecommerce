import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { getProductsByCategory } from "@/lib/getProducts";

export default async function CrystalJewelleryPage() {
  const categoryProducts = await getProductsByCategory("crystal-jewellery");

  return (
    <>
      <Header />

      <CategoryPage
        slug="crystal-jewellery"
        products={categoryProducts}
      />
    </>
  );
}
