"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import {
  LoginSchema,
  RegisterSchema,
  MagicLinkSchema,
} from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/server";

export const loginAction = actionClient
  .inputSchema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: "Invalid email or password" };
    }

    return { success: "Login successful!" };
  });

export const registerAction = actionClient
  .inputSchema(RegisterSchema)
  .action(async ({ parsedInput: { username, email, password } }) => {
    const supabase = await createClient();

    const { data: existing, error: lookupError } = await supabase
      .from("profiles")
      .select("id, email, username")
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle();

    if (lookupError) {
      return { error: "Something went wrong. Please try again." };
    }

    if (existing) {
      if (existing.email === email) {
        return { error: "An account with this email already exists" };
      }
      if (existing.username === username) {
        return { error: "This username is already taken" };
      }
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return { error: signUpError.message || "Registration failed" };
    }

    const userId = data.user?.id;
    if (!userId) {
      return { error: "User creation failed. Try again later." };
    }

    return { success: "Account created successfully!" };
  });

export const magicLinkAction = actionClient
  .inputSchema(MagicLinkSchema)
  .action(async ({ parsedInput: { email } }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message || "Failed to send magic link." };
    }

    return { success: "Magic link sent! Check your email." };
  });

// --- Verify Magic Link ---
// Usually handled by Supabase's built-in callback route
// But you can expose a check if needed (not required unless doing custom verification)

// --- Logout ---
export const logoutAction = actionClient
  .inputSchema(z.object({}))
  .action(async () => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: "Failed to log out. Please try again." };
    }

    return { success: "Logged out successfully." };
  });
