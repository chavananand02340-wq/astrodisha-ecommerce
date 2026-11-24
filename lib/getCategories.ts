import { createClient } from "@/utils/supabase/server";
import { getCategoryFallbackImage } from "@/lib/categoryContent";

export type CategoryNavCard = { name: string; slug: string; image?: string };

// Active categories in admin order — used for the /shop quick nav and the
// "Explore other collections" row on empty categories. Card photo order matches
// the homepage: homepage card photo → bundled WebP → category banner.
export async function getActiveCategories(): Promise<CategoryNavCard[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("name, slug, image_url, home_image_url")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error || !data) return [];

  return data.map((c) => ({
    name: c.name,
    slug: c.slug,
    image: c.home_image_url || getCategoryFallbackImage(c.slug) || c.image_url || undefined,
  }));
}
