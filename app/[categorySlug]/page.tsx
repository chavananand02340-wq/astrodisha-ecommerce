import { notFound } from "next/navigation";
import Header from "@/components/Header";
import CategoryPage from "@/components/CategoryPage";
import { createClient } from "@/utils/supabase/server";
import { getProductsByCategory } from "@/lib/getProducts";
import { getActiveCategories } from "@/lib/getCategories";

export default async function DynamicCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { categorySlug } = await params;
  const { q } = await searchParams;
  const initialQuery = (Array.isArray(q) ? q[0] : q)?.slice(0, 60) || "";

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

  const [products, categories] = await Promise.all([
    getProductsByCategory(categorySlug),
    getActiveCategories(),
  ]);

  return (
    <>
      <Header />
      <CategoryPage
        slug={categorySlug}
        title={category.name}
        description={category.description || ""}
        image={category.image_url || undefined}
        products={products}
        categories={categories}
        initialQuery={initialQuery}
      />
    </>
  );
}
