import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { products } from "@/data/products";

export default function RudrakshaPage() {
  const categoryProducts = products.filter(
    (product) => product.category === "Rudraksha"
  );

  return (
    <>
      <Header />

      <CategoryPage
        title="Rudraksha"
        description="Sacred Rudraksha rooted in traditional Indian practices and spiritual heritage."
        products={categoryProducts}
      />
    </>
  );
}
