import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { getAllProducts } from "@/lib/getProducts";
import { getActiveCategories } from "@/lib/getCategories";

export const metadata = {
  title: "Shop All Products | ASTRODISHA",
  description:
    "Explore authentic gemstones, crystals, crystal jewellery, Rudraksha and puja essentials from AstroDisha.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getActiveCategories()]);

  return (
    <>
      <Header />

      <CategoryPage
        variant="shop"
        title="All Products"
        description="Our complete collection of gemstones, crystals, crystal jewellery, Rudraksha and puja essentials."
        products={products}
        categories={categories}
      />
    </>
  );
}
