import { createClient } from "@/utils/supabase/server";

export type ProductInput = {
  category_id: string;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  price: number;
  compare_at_price?: number | null;
  stock?: number;
  sku?: string | null;
  rating?: number | null;
  review_count?: number;
  is_active?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
};

export type ProductUpdate = Partial<ProductInput>;

export async function getProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      category_id,
      name,
      slug,
      short_description,
      description,
      price,
      compare_at_price,
      stock,
      sku,
      rating,
      review_count,
      is_active,
      is_featured,
      is_bestseller,
      seo_title,
      seo_description,
      created_at,
      updated_at
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return data ?? [];
}

export async function getProductById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      category_id,
      name,
      slug,
      short_description,
      description,
      price,
      compare_at_price,
      stock,
      sku,
      rating,
      review_count,
      is_active,
      is_featured,
      is_bestseller,
      seo_title,
      seo_description,
      created_at,
      updated_at
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return data;
}

export async function createProduct(input: ProductInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      category_id: input.category_id,
      name: input.name,
      slug: input.slug,
      short_description: input.short_description ?? null,
      description: input.description ?? null,
      price: input.price,
      compare_at_price: input.compare_at_price ?? null,
      stock: input.stock ?? 0,
      sku: input.sku ?? null,
      rating: input.rating ?? null,
      review_count: input.review_count ?? 0,
      is_active: input.is_active ?? true,
      is_featured: input.is_featured ?? false,
      is_bestseller: input.is_bestseller ?? false,
      seo_title: input.seo_title ?? null,
      seo_description: input.seo_description ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  }

  return data;
}

export async function updateProduct(
  id: string,
  updates: ProductUpdate
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }

  return data;
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .update({
      is_active: false,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to deactivate product: ${error.message}`);
  }

  return data;
}
