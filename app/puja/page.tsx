import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { products } from "@/data/products";

export default function PujaPage() {
  const categoryProducts = products.filter(
    (product) => product.category === "Puja Essentials"
  );

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
