"use server";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? { error } : { success: true };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({ email, password });
  return error ? { error } : { success: true };
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  redirect("/auth/login");
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return error ? { error } : { success: true };
}

export async function updateName(
  userId: string,
  firstName: string,
  lastName: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ first_name: firstName.trim(), last_name: lastName.trim() })
    .eq("id", userId);
  return error ? { error } : { success: true };
}

export async function uploadProfilePicture(userId: string, file: File) {
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage
    .from("profile-pictures")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) return { error: uploadError };
  const { data } = supabase.storage
    .from("profile-pictures")
    .getPublicUrl(filePath);
  const publicUrl = data?.publicUrl;

  const { error: dbError } = await supabase
    .from("profiles")
    .update({ profile_picture: publicUrl })
    .eq("id", userId);
  return dbError ? { error: dbError } : { success: true, url: publicUrl };
}

export async function getUser() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return { error: error.message };
    }
    return data.user;
  } catch (error) {
    // @ts-ignore
    return { error: error.message };
  }
}

export async function request_lock(userId: string): Promise<boolean> {
  const supabase = await createClient();

  // 1) Check if a row exists for this user
  const { data: existing, error: selectError } = await supabase
    .from("request_lock")
    .select("is_available")
    .eq("user_id", userId)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("[request_lock] Unexpected selectError:", selectError);
    throw selectError;
  }

  // 2) If no row exists -> create one with is_available = true
  if (!existing) {
    const { error: insertError } = await supabase
      .from("request_lock")
      .insert({ user_id: userId, is_available: true });

    if (insertError) throw insertError;
    return true; // brand new user -> available
  }

  return !existing.is_available;
}


export async function set_request_lock(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("request_lock")
    .update({ is_available: false })
    .eq("user_id", userId)
    .eq("is_available", true)
    .select("user_id"); 

  if (error) {
    console.error("[set_request_lock] update error:", error);
    throw error;
  }

  return !!data?.length; // true = lock acquired; false = being used
}

export async function release_request_lock(userId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("request_lock")
    .update({ is_available: true })
    .eq("user_id", userId);
  if (error) console.error("[release_request_lock] release error:", error);
}