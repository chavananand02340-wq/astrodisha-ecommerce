import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { getAllProducts } from "@/lib/getProducts";

export const metadata = {
  title: "Shop All Products | ASTRODISHA",
  description:
    "Explore authentic gemstones, crystals, crystal jewellery, Rudraksha and puja essentials from AstroDisha.",
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <>
      <Header />

      <CategoryPage
        title="All Products"
        description="Our complete collection of gemstones, crystals, crystal jewellery, Rudraksha and puja essentials."
        products={products}
      />
    </>
  );
}
