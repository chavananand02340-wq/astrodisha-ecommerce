import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { products } from "@/data/products";

export default function CrystalsPage() {
  const categoryProducts = products.filter(
    (product) => product.category === "Crystals"
  );

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
