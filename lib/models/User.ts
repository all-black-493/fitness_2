import { z } from "zod"

// User Schema for MongoDB
export const UserSchema = z.object({
  _id: z.string().optional(),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).optional(), // Optional for magic link users
  name: z.string().min(1).max(50),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  isVerified: z.boolean().default(false),

  // Fitness Profile Data
  profile: z
    .object({
      fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      goals: z.array(z.string()).default([]),
      preferredWorkouts: z.array(z.string()).default([]),
      stats: z
        .object({
          totalWorkouts: z.number().default(0),
          currentStreak: z.number().default(0),
          longestStreak: z.number().default(0),
          totalDistance: z.number().default(0), // in km
          totalWeight: z.number().default(0), // in kg lifted
          caloriesBurned: z.number().default(0),
        })
        .default({}),
      achievements: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            icon: z.string(),
            unlockedAt: z.date(),
            category: z.enum(["workout", "social", "challenge", "streak"]),
          }),
        )
        .default([]),
      milestones: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            target: z.number(),
            current: z.number(),
            unit: z.string(),
            completedAt: z.date().optional(),
          }),
        )
        .default([]),
      challengesParticipated: z
        .array(
          z.object({
            challengeId: z.string(),
            name: z.string(),
            status: z.enum(["active", "completed", "abandoned"]),
            joinedAt: z.date(),
            completedAt: z.date().optional(),
            rank: z.number().optional(),
          }),
        )
        .default([]),
      communitiesJoined: z
        .array(
          z.object({
            communityId: z.string(),
            name: z.string(),
            role: z.enum(["member", "moderator", "admin"]).default("member"),
            joinedAt: z.date(),
          }),
        )
        .default([]),
    })
    .default({}),

  // Privacy Settings
  privacy: z
    .object({
      profileVisibility: z.enum(["public", "friends", "private"]).default("public"),
      showStats: z.boolean().default(true),
      showAchievements: z.boolean().default(true),
      showWorkouts: z.boolean().default(true),
    })
    .default({}),

  // Timestamps
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  lastLoginAt: z.date().optional(),
})

export type User = z.infer<typeof UserSchema>

// Magic Link Token Schema
export const MagicLinkTokenSchema = z.object({
  _id: z.string().optional(),
  email: z.string().email(),
  token: z.string(),
  expiresAt: z.date(),
  used: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
})

export type MagicLinkToken = z.infer<typeof MagicLinkTokenSchema>

// Session Schema
export const SessionSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.date(),
  createdAt: z.date().default(() => new Date()),
  lastUsedAt: z.date().default(() => new Date()),
})

export type Session = z.infer<typeof SessionSchema>
