"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "./schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AuthActionState } from "./types";

export async function login(_prevState: unknown, formData: FormData): Promise<AuthActionState> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validation = loginSchema.safeParse(data);

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(_prevState: unknown, formData: FormData): Promise<AuthActionState> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validation = signupSchema.safeParse(data);

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
