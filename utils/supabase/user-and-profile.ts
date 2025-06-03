import { createClient } from "@/utils/supabase/server";

export async function getUserAndProfile() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  let profileData = null;
  if (user) {
    const { data } = await supabase
      .from("user_profiles")
      .select("user_id, full_name")
      .eq("user_id", user.id)
      .single();
    profileData = data;
  }
  // Ensure user.email is always a string (not undefined)
  const safeUser = user ? { email: user.email ?? "", ...user } : null;
  return { user: safeUser, profileData };
}
