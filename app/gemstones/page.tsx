import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { products } from "@/data/products";

export default function GemstonesPage() {
  const categoryProducts = products.filter(
    (product) => product.category === "Gemstones"
  );

  return (
    <>
      <Header />

      <CategoryPage
        title="Gemstones"
        description="Natural gemstones selected with traditional wisdom and presented with clarity."
        products={categoryProducts}
      />
    </>
  );
}
