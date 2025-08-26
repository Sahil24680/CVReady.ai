import { supabase } from "@/app/utils/supabase/client";

export const checkProfileExists = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("No logged-in user");
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      first_name: "",
      last_name: "",
      profile_picture:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
    });

    if (insertError) {
      console.error("❌ Failed to create profile:", insertError.message);
    } else {
      console.log("✅ Profile created for new user");
    }
  } else {
    console.log("🟢 Profile already exists");
  }
};
