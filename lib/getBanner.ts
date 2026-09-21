import { createClient } from "@/utils/supabase/server";

export type Banner = {
  title: string;
  subtitle: string | null;
  image_url: string;
  button_text: string | null;
  button_link: string | null;
};

export async function getActiveBanner(): Promise<Banner | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("banners")
    .select("title, subtitle, image_url, button_text, button_link")
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}
