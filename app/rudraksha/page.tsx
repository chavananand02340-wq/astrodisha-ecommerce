import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { getProductsByCategory } from "@/lib/getProducts";

export default async function RudrakshaPage() {
  const categoryProducts = await getProductsByCategory("rudraksha");

  return (
    <>
      <Header />

      <CategoryPage
        slug="rudraksha"
        products={categoryProducts}
      />
    </>
  );
}
