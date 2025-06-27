"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import {
  LoginSchema,
  RegisterSchema,
  MagicLinkSchema,
} from "@/lib/validations/auth";
import {
  hashPassword,
  verifyPassword,
} from "@/lib/auth/password";
import {
  setAuthCookie,
  removeAuthCookie,
} from "@/lib/auth/jwt";
import {
  generateMagicToken,
  sendMagicLink,
} from "@/lib/auth/email";

// In-memory mocks for demo
const mockUsers = new Map();
const mockMagicTokens = new Map();


// --- Login ---
export const loginAction = actionClient
  .inputSchema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const user = Array.from(mockUsers.values()).find((u: any) => u.email === email);

      if (!user) {
        return { error: "Invalid email or password" };
      }

      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return { error: "Invalid email or password" };
      }

      await setAuthCookie({
        userId: user.id,
        email: user.email,
        username: user.username,
      });

      return { success: "Login successful!" };
    } catch (error) {
      return { error: "Something went wrong. Please try again." };
    }
  });

// --- Register ---
export const registerAction = actionClient
  .inputSchema(RegisterSchema)
  .action(async ({ parsedInput: { username, name, email, password } }) => {
    try {
      const existingUser = Array.from(mockUsers.values()).find(
        (u: any) => u.email === email || u.username === username
      );

      if (existingUser) {
        if (existingUser.email === email) {
          return { error: "An account with this email already exists" };
        }
        if (existingUser.username === username) {
          return { error: "This username is already taken" };
        }
      }

      const hashedPassword = await hashPassword(password);
      const userId = `user_${Date.now()}`;
      const newUser = {
        id: userId,
        username,
        name,
        email,
        password: hashedPassword,
        avatar: `/placeholder.svg?height=40&width=40`,
        isVerified: false,
        profile: {
          stats: {
            totalWorkouts: 0,
            currentStreak: 0,
            longestStreak: 0,
            totalDistance: 0,
            totalWeight: 0,
            caloriesBurned: 0,
          },
          achievements: [],
          milestones: [],
          challengesParticipated: [],
          communitiesJoined: [],
        },
        privacy: {
          profileVisibility: "public",
          showStats: true,
          showAchievements: true,
          showWorkouts: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsers.set(userId, newUser);

      await setAuthCookie({
        userId: newUser.id,
        email: newUser.email,
        username: newUser.username,
      });

      return { success: "Account created successfully!" };
    } catch (error) {
      return { error: "Something went wrong. Please try again." };
    }
  });

// --- Send Magic Link ---
export const magicLinkAction = actionClient
  .inputSchema(MagicLinkSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const user = Array.from(mockUsers.values()).find((u: any) => u.email === email);

      if (!user) {
        return { error: "No account found with this email address" };
      }

      const token = generateMagicToken();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      mockMagicTokens.set(token, {
        email,
        token,
        expiresAt,
        used: false,
        createdAt: new Date(),
      });

      await sendMagicLink(email, token);

      return { success: "Magic link sent! Check your email." };
    } catch (error) {
      return { error: "Failed to send magic link. Please try again." };
    }
  });

// --- Verify Magic Link ---
export const verifyMagicLinkAction = actionClient
  .inputSchema(z.object({ token: z.string() }))
  .action(async ({ parsedInput: { token } }) => {
    try {
      const magicToken = mockMagicTokens.get(token);

      if (!magicToken) {
        return { error: "Invalid or expired magic link" };
      }

      if (magicToken.used) {
        return { error: "This magic link has already been used" };
      }

      if (new Date() > magicToken.expiresAt) {
        return { error: "This magic link has expired" };
      }

      const user = Array.from(mockUsers.values()).find(
        (u: any) => u.email === magicToken.email
      );

      if (!user) {
        return { error: "User not found" };
      }

      magicToken.used = true;
      mockMagicTokens.set(token, magicToken);

      await setAuthCookie({
        userId: user.id,
        email: user.email,
        username: user.username,
      });

      return {
        success: "Login successful!",
        expiresAt: magicToken.expiresAt.toISOString(),
      };
    } catch (error) {
      return { error: "Something went wrong. Please try again." };
    }
  });

// --- Logout ---
export const logoutAction = actionClient
  .inputSchema(z.object({}))
  .action(async () => {
    try {
      await removeAuthCookie();
      return { success: "Logged out successfully" };
    } catch (error) {
      return { error: "Something went wrong. Please try again." };
    }
  });
