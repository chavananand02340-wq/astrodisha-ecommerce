import { notFound } from "next/navigation";
import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { createClient } from "@/utils/supabase/server";
import { getProductsByCategory } from "@/lib/getProducts";

export default async function DynamicCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name, description, image_url")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .maybeSingle();

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(categorySlug);

  return (
    <>
      <Header />
      <CategoryPage
        title={category.name}
        description={category.description || ""}
        image={category.image_url || undefined}
        products={products}
      />
    </>
  );
}
