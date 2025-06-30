export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          variables?: Json
          operationName?: string
          query?: string
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activities: {
        Row: {
          action: string
          comments: number | null
          created_at: string | null
          id: string
          likes: number | null
          profile_id: string
          type: Database["public"]["Enums"]["activity_type"]
          workout_id: string | null
        }
        Insert: {
          action: string
          comments?: number | null
          created_at?: string | null
          id?: string
          likes?: number | null
          profile_id: string
          type: Database["public"]["Enums"]["activity_type"]
          workout_id?: string | null
        }
        Update: {
          action?: string
          comments?: number | null
          created_at?: string | null
          id?: string
          likes?: number | null
          profile_id?: string
          type?: Database["public"]["Enums"]["activity_type"]
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_comments: {
        Row: {
          activity_id: string
          content: string
          created_at: string
          id: string
          profile_id: string
        }
        Insert: {
          activity_id: string
          content: string
          created_at?: string
          id?: string
          profile_id: string
        }
        Update: {
          activity_id?: string
          content?: string
          created_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_comments_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_likes: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          profile_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          profile_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_likes_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_workout_plans: {
        Row: {
          body_weight: number | null
          created_at: string | null
          equipment: string[] | null
          fitness_level: string
          generated_plan: Json
          goals: string[]
          id: string
          injuries_limitations: string | null
          nutrition_plan: Json | null
          profile_id: string
          session_duration: number
          workout_days: number
        }
        Insert: {
          body_weight?: number | null
          created_at?: string | null
          equipment?: string[] | null
          fitness_level: string
          generated_plan: Json
          goals: string[]
          id?: string
          injuries_limitations?: string | null
          nutrition_plan?: Json | null
          profile_id: string
          session_duration: number
          workout_days: number
        }
        Update: {
          body_weight?: number | null
          created_at?: string | null
          equipment?: string[] | null
          fitness_level?: string
          generated_plan?: Json
          goals?: string[]
          id?: string
          injuries_limitations?: string | null
          nutrition_plan?: Json | null
          profile_id?: string
          session_duration?: number
          workout_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_workout_plans_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          item_type: string
          price_ksh: number
          profile_id: string
          quantity: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          item_type: string
          price_ksh: number
          profile_id: string
          quantity?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          item_type?: string
          price_ksh?: number
          profile_id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          current_progress: number | null
          id: string
          joined_at: string | null
          profile_id: string
        }
        Insert: {
          challenge_id: string
          current_progress?: number | null
          id?: string
          joined_at?: string | null
          profile_id: string
        }
        Update: {
          challenge_id?: string
          current_progress?: number | null
          id?: string
          joined_at?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string
          id: string
          participants_count: number | null
          prize_ksh: number | null
          start_date: string
          target_value: number | null
          title: string
          type: string
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date: string
          id?: string
          participants_count?: number | null
          prize_ksh?: number | null
          start_date: string
          target_value?: number | null
          title: string
          type: string
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string
          id?: string
          participants_count?: number | null
          prize_ksh?: number | null
          start_date?: string
          target_value?: number | null
          title?: string
          type?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          profile_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          profile_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_private: boolean | null
          member_count: number | null
          name: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          member_count?: number | null
          name: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          member_count?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string | null
          profile_id: string
          role: string | null
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string | null
          profile_id: string
          role?: string | null
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string | null
          profile_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          profile_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          profile_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          profile_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friends_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          community_id: string | null
          created_at: string | null
          encrypted_content: string
          id: string
          message_type: string
          recipient_id: string | null
          sender_id: string
        }
        Insert: {
          community_id?: string | null
          created_at?: string | null
          encrypted_content: string
          id?: string
          message_type: string
          recipient_id?: string | null
          sender_id: string
        }
        Update: {
          community_id?: string | null
          created_at?: string | null
          encrypted_content?: string
          id?: string
          message_type?: string
          recipient_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          profile_id: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          profile_id: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          profile_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          profile_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          community_id: string
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          likes_count: number | null
          profile_id: string
        }
        Insert: {
          comments_count?: number | null
          community_id: string
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number | null
          profile_id: string
        }
        Update: {
          comments_count?: number | null
          community_id?: string
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          calories_burned: number | null
          created_at: string | null
          current_streak: number | null
          display_name: string | null
          email: string | null
          fitness_level: string | null
          goals: string[] | null
          id: string
          longest_streak: number | null
          public_key: string | null
          total_weight_lifted: number | null
          total_workouts: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          calories_burned?: number | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          email?: string | null
          fitness_level?: string | null
          goals?: string[] | null
          id: string
          longest_streak?: number | null
          public_key?: string | null
          total_weight_lifted?: number | null
          total_workouts?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          calories_burned?: number | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          email?: string | null
          fitness_level?: string | null
          goals?: string[] | null
          id?: string
          longest_streak?: number | null
          public_key?: string | null
          total_weight_lifted?: number | null
          total_workouts?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      purchased_items: {
        Row: {
          id: string
          item_id: string
          item_type: string
          price_paid_ksh: number
          profile_id: string
          purchased_at: string | null
          stripe_payment_intent_id: string
        }
        Insert: {
          id?: string
          item_id: string
          item_type: string
          price_paid_ksh: number
          profile_id: string
          purchased_at?: string | null
          stripe_payment_intent_id: string
        }
        Update: {
          id?: string
          item_id?: string
          item_type?: string
          price_paid_ksh?: number
          profile_id?: string
          purchased_at?: string | null
          stripe_payment_intent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchased_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          profile_id: string
          rating: number
          session_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          profile_id: string
          rating: number
          session_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          profile_id?: string
          rating?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          client_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          price_ksh: number
          scheduled_at: string
          status: string | null
          stripe_payment_intent_id: string | null
          title: string
          trainer_id: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          price_ksh: number
          scheduled_at: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          title: string
          trainer_id: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          price_ksh?: number
          scheduled_at?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          title?: string
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      trainers: {
        Row: {
          bio: string | null
          certifications: string[] | null
          created_at: string | null
          hourly_rate_ksh: number
          id: string
          is_verified: boolean | null
          profile_id: string
          rating: number | null
          specialties: string[] | null
          total_sessions: number | null
        }
        Insert: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          hourly_rate_ksh: number
          id?: string
          is_verified?: boolean | null
          profile_id: string
          rating?: number | null
          specialties?: string[] | null
          total_sessions?: number | null
        }
        Update: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          hourly_rate_ksh?: number
          id?: string
          is_verified?: boolean | null
          profile_id?: string
          rating?: number | null
          specialties?: string[] | null
          total_sessions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trainers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          profile_id: string
          workout_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          profile_id: string
          workout_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          profile_id?: string
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_comments_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_likes: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string
          workout_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id: string
          workout_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_likes_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty: string | null
          duration_weeks: number
          exercises: Json
          id: string
          price_ksh: number
          stripe_price_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          duration_weeks: number
          exercises: Json
          id?: string
          price_ksh: number
          stripe_price_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          duration_weeks?: number
          exercises?: Json
          id?: string
          price_ksh?: number
          stripe_price_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          calories_burned: number | null
          completed: boolean | null
          created_at: string | null
          duration_minutes: number | null
          exercises: Json
          id: string
          name: string
          notes: string | null
          profile_id: string
          tags: string[] | null
          type: Database["public"]["Enums"]["workout_type"] | null
          workout_date: string
        }
        Insert: {
          calories_burned?: number | null
          completed?: boolean | null
          created_at?: string | null
          duration_minutes?: number | null
          exercises: Json
          id?: string
          name: string
          notes?: string | null
          profile_id: string
          tags?: string[] | null
          type?: Database["public"]["Enums"]["workout_type"] | null
          workout_date?: string
        }
        Update: {
          calories_burned?: number | null
          completed?: boolean | null
          created_at?: string | null
          duration_minutes?: number | null
          exercises?: Json
          id?: string
          name?: string
          notes?: string | null
          profile_id?: string
          tags?: string[] | null
          type?: Database["public"]["Enums"]["workout_type"] | null
          workout_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_workouts_profile_id"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workouts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          profile_id: string
          message: string
          notification_type: string
          title: string
          data?: Json
        }
        Returns: string
      }
    }
    Enums: {
      activity_type: "workout" | "challenge" | "achievement" | "milestone"
      exercise_type: "strength" | "cardio" | "flexibility" | "bodyweight"
      workout_type:
        | "strength"
        | "cardio"
        | "flexibility"
        | "mobility"
        | "hiit"
        | "yoga"
        | "crossfit"
        | "recovery"
        | "general"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      activity_type: ["workout", "challenge", "achievement", "milestone"],
      exercise_type: ["strength", "cardio", "flexibility", "bodyweight"],
      workout_type: [
        "strength",
        "cardio",
        "flexibility",
        "mobility",
        "hiit",
        "yoga",
        "crossfit",
        "recovery",
        "general",
      ],
    },
  },
} as const

