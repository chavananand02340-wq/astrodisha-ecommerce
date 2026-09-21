import { createClient } from "@/utils/supabase/server";
import type { Product } from "@/components/ProductCard";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  price: number;
  rating: number | null;
  review_count: number | null;
  categories: { name: string } | null;
  product_images: { image_url: string; is_primary: boolean; sort_order: number }[] | null;
};

function mapRowToProduct(row: ProductRow): Product {
  const sortedImages = [...(row.product_images || [])].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });

  const imageUrls = sortedImages.map((img) => img.image_url);
  const primaryImage = imageUrls[0] || "/images/placeholder-product.svg";

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.categories?.name || "Uncategorized",
    description: row.short_description || "",
    price: Number(row.price),
    image: primaryImage,
    images: imageUrls.length > 0 ? imageUrls : [primaryImage],
    rating: row.rating ? Number(row.rating) : undefined,
    reviewCount: row.review_count ?? undefined,
  };
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, short_description, price, rating, review_count, categories(name), product_images(image_url, is_primary, sort_order)"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return (data as unknown as ProductRow[]).map(mapRowToProduct);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (!category) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, short_description, price, rating, review_count, categories(name), product_images(image_url, is_primary, sort_order)"
    )
    .eq("is_active", true)
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as unknown as ProductRow[]).map(mapRowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, short_description, price, rating, review_count, categories(name), product_images(image_url, is_primary, sort_order)"
    )
    .eq("is_active", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapRowToProduct(data as unknown as ProductRow);
}
