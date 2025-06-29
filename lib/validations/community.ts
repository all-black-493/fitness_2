import { z } from "zod"

export const createCommunitySchema = z.object({
  name: z
    .string()
    .min(3, "Community name must be at least 3 characters")
    .max(50, "Community name must be less than 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  isPrivate: z.boolean().default(false),
  avatarUrl: z.string().url().optional(),
})

export const createPostSchema = z.object({
  content: z.string().min(1, "Post content is required").max(2000, "Post content must be less than 2000 characters"),
  imageUrl: z.string().url().optional(),
  communityId: z.string().uuid("Invalid community ID"),
})

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required").max(500, "Comment must be less than 500 characters"),
  postId: z.string().uuid("Invalid post ID"),
})

export const joinCommunitySchema = z.object({
  communityId: z.string().uuid("Invalid community ID"),
})

export const sendMessageSchema = z
  .object({
    content: z.string().min(1, "Message content is required").max(1000, "Message must be less than 1000 characters"),
    recipientId: z.string().uuid("Invalid recipient ID").optional(),
    communityId: z.string().uuid("Invalid community ID").optional(),
  })
  .refine((data) => data.recipientId || data.communityId, {
    message: "Either recipient ID or community ID must be provided",
  })

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type JoinCommunityInput = z.infer<typeof joinCommunitySchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
