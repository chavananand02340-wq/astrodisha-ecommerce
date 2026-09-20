import { createClient } from "@/utils/supabase/client";

export async function checkIsAdmin(): Promise<boolean> {
  const supabase = createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return false;
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return true;
}
