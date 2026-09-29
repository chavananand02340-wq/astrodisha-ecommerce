import { createClient } from "@/utils/supabase/server";

export type Testimonial = {
  id: string;
  customer_name: string;
  testimonial_text: string;
  image_url: string | null;
  rating: number | null;
  media_type: "image" | "video" | "audio" | null;
  media_url: string | null;
};

export async function getActiveTestimonials(limit = 6): Promise<Testimonial[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, customer_name, testimonial_text, image_url, rating, media_type, media_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data;
}
