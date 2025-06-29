create table "public"."ai_workout_plans" (
    "id" uuid not null default uuid_generate_v4(),
    "profile_id" uuid not null,
    "goals" text[] not null,
    "fitness_level" text not null,
    "workout_days" integer not null,
    "session_duration" integer not null,
    "equipment" text[],
    "generated_plan" jsonb not null,
    "nutrition_plan" jsonb,
    "created_at" timestamp with time zone default now()
);


alter table "public"."ai_workout_plans" enable row level security;

create table "public"."cart_items" (
    "id" uuid not null default uuid_generate_v4(),
    "profile_id" uuid not null,
    "item_type" text not null,
    "item_id" uuid not null,
    "quantity" integer default 1,
    "price_ksh" integer not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."cart_items" enable row level security;

create table "public"."challenge_participants" (
    "id" uuid not null default uuid_generate_v4(),
    "challenge_id" uuid not null,
    "profile_id" uuid not null,
    "current_progress" integer default 0,
    "joined_at" timestamp with time zone default now()
);


alter table "public"."challenge_participants" enable row level security;

create table "public"."challenges" (
    "id" uuid not null default uuid_generate_v4(),
    "title" text not null,
    "description" text,
    "type" text not null,
    "target_value" integer,
    "unit" text,
    "start_date" date not null,
    "end_date" date not null,
    "prize_ksh" integer default 0,
    "participants_count" integer default 0,
    "created_by" uuid not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."challenges" enable row level security;

create table "public"."comments" (
    "id" uuid not null default uuid_generate_v4(),
    "post_id" uuid not null,
    "profile_id" uuid not null,
    "content" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."comments" enable row level security;

create table "public"."communities" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "avatar_url" text,
    "is_private" boolean default false,
    "member_count" integer default 0,
    "created_by" uuid not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."communities" enable row level security;

create table "public"."community_members" (
    "id" uuid not null default uuid_generate_v4(),
    "community_id" uuid not null,
    "profile_id" uuid not null,
    "role" text default 'member'::text,
    "joined_at" timestamp with time zone default now()
);


alter table "public"."community_members" enable row level security;

create table "public"."friends" (
    "id" uuid not null default uuid_generate_v4(),
    "profile_id" uuid not null,
    "friend_id" uuid not null,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone default now()
);


alter table "public"."friends" enable row level security;

create table "public"."messages" (
    "id" uuid not null default uuid_generate_v4(),
    "sender_id" uuid not null,
    "recipient_id" uuid,
    "community_id" uuid,
    "encrypted_content" text not null,
    "message_type" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."messages" enable row level security;

create table "public"."notifications" (
    "id" uuid not null default uuid_generate_v4(),
    "profile_id" uuid not null,
    "title" text not null,
    "message" text not null,
    "type" text not null,
    "is_read" boolean default false,
    "data" jsonb,
    "created_at" timestamp with time zone default now()
);


alter table "public"."notifications" enable row level security;

create table "public"."posts" (
    "id" uuid not null default uuid_generate_v4(),
    "community_id" uuid not null,
    "profile_id" uuid not null,
    "content" text not null,
    "image_url" text,
    "likes_count" integer default 0,
    "comments_count" integer default 0,
    "created_at" timestamp with time zone default now()
);


alter table "public"."posts" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "username" text not null,
    "display_name" text not null,
    "bio" text,
    "avatar_url" text,
    "public_key" text,
    "fitness_level" text,
    "goals" text[],
    "total_workouts" integer default 0,
    "current_streak" integer default 0,
    "longest_streak" integer default 0,
    "total_weight_lifted" numeric default 0,
    "calories_burned" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."profiles" enable row level security;

create table "public"."purchased_items" (
    "id" uuid not null default uuid_generate_v4(),
    "profile_id" uuid not null,
    "item_type" text not null,
    "item_id" uuid not null,
    "price_paid_ksh" integer not null,
    "stripe_payment_intent_id" text not null,
    "purchased_at" timestamp with time zone default now()
);


alter table "public"."purchased_items" enable row level security;

create table "public"."ratings" (
    "id" uuid not null default uuid_generate_v4(),
    "session_id" uuid not null,
    "profile_id" uuid not null,
    "rating" integer not null,
    "comment" text,
    "created_at" timestamp with time zone default now()
);


alter table "public"."ratings" enable row level security;

create table "public"."sessions" (
    "id" uuid not null default uuid_generate_v4(),
    "trainer_id" uuid not null,
    "client_id" uuid not null,
    "title" text not null,
    "description" text,
    "scheduled_at" timestamp with time zone not null,
    "duration_minutes" integer not null,
    "price_ksh" integer not null,
    "status" text default 'scheduled'::text,
    "stripe_payment_intent_id" text,
    "created_at" timestamp with time zone default now()
);


alter table "public"."sessions" enable row level security;

create table "public"."trainers" (
    "id" uuid not null default uuid_generate_v4(),
    "profile_id" uuid not null,
    "specialties" text[],
    "hourly_rate_ksh" integer not null,
    "bio" text,
    "certifications" text[],
    "rating" numeric(3,2) default 0,
    "total_sessions" integer default 0,
    "is_verified" boolean default false,
    "created_at" timestamp with time zone default now()
);


alter table "public"."trainers" enable row level security;

create table "public"."workout_plans" (
    "id" uuid not null default uuid_generate_v4(),
    "title" text not null,
    "description" text,
    "price_ksh" integer not null,
    "duration_weeks" integer not null,
    "difficulty" text,
    "exercises" jsonb not null,
    "stripe_price_id" text,
    "created_by" uuid,
    "created_at" timestamp with time zone default now()
);


alter table "public"."workout_plans" enable row level security;

create table "public"."workouts" (
    "id" uuid not null default uuid_generate_v4(),
    "profile_id" uuid not null,
    "name" text not null,
    "exercises" jsonb not null,
    "duration_minutes" integer,
    "calories_burned" integer,
    "notes" text,
    "workout_date" date not null default CURRENT_DATE,
    "created_at" timestamp with time zone default now()
);


alter table "public"."workouts" enable row level security;

CREATE UNIQUE INDEX ai_workout_plans_pkey ON public.ai_workout_plans USING btree (id);

CREATE UNIQUE INDEX cart_items_pkey ON public.cart_items USING btree (id);

CREATE UNIQUE INDEX challenge_participants_challenge_id_profile_id_key ON public.challenge_participants USING btree (challenge_id, profile_id);

CREATE UNIQUE INDEX challenge_participants_pkey ON public.challenge_participants USING btree (id);

CREATE UNIQUE INDEX challenges_pkey ON public.challenges USING btree (id);

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX communities_pkey ON public.communities USING btree (id);

CREATE UNIQUE INDEX community_members_community_id_profile_id_key ON public.community_members USING btree (community_id, profile_id);

CREATE UNIQUE INDEX community_members_pkey ON public.community_members USING btree (id);

CREATE UNIQUE INDEX friends_pkey ON public.friends USING btree (id);

CREATE UNIQUE INDEX friends_profile_id_friend_id_key ON public.friends USING btree (profile_id, friend_id);

CREATE INDEX idx_friends_friend_id ON public.friends USING btree (friend_id);

CREATE INDEX idx_friends_profile_id ON public.friends USING btree (profile_id);

CREATE INDEX idx_messages_community_id ON public.messages USING btree (community_id);

CREATE INDEX idx_messages_recipient_id ON public.messages USING btree (recipient_id);

CREATE INDEX idx_messages_sender_id ON public.messages USING btree (sender_id);

CREATE INDEX idx_notifications_profile_id ON public.notifications USING btree (profile_id);

CREATE INDEX idx_posts_community_id ON public.posts USING btree (community_id);

CREATE INDEX idx_workouts_date ON public.workouts USING btree (workout_date);

CREATE INDEX idx_workouts_profile_id ON public.workouts USING btree (profile_id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX purchased_items_pkey ON public.purchased_items USING btree (id);

CREATE UNIQUE INDEX ratings_pkey ON public.ratings USING btree (id);

CREATE UNIQUE INDEX ratings_session_id_profile_id_key ON public.ratings USING btree (session_id, profile_id);

CREATE UNIQUE INDEX sessions_pkey ON public.sessions USING btree (id);

CREATE UNIQUE INDEX trainers_pkey ON public.trainers USING btree (id);

CREATE UNIQUE INDEX workout_plans_pkey ON public.workout_plans USING btree (id);

CREATE UNIQUE INDEX workouts_pkey ON public.workouts USING btree (id);

alter table "public"."ai_workout_plans" add constraint "ai_workout_plans_pkey" PRIMARY KEY using index "ai_workout_plans_pkey";

alter table "public"."cart_items" add constraint "cart_items_pkey" PRIMARY KEY using index "cart_items_pkey";

alter table "public"."challenge_participants" add constraint "challenge_participants_pkey" PRIMARY KEY using index "challenge_participants_pkey";

alter table "public"."challenges" add constraint "challenges_pkey" PRIMARY KEY using index "challenges_pkey";

alter table "public"."comments" add constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

alter table "public"."communities" add constraint "communities_pkey" PRIMARY KEY using index "communities_pkey";

alter table "public"."community_members" add constraint "community_members_pkey" PRIMARY KEY using index "community_members_pkey";

alter table "public"."friends" add constraint "friends_pkey" PRIMARY KEY using index "friends_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."purchased_items" add constraint "purchased_items_pkey" PRIMARY KEY using index "purchased_items_pkey";

alter table "public"."ratings" add constraint "ratings_pkey" PRIMARY KEY using index "ratings_pkey";

alter table "public"."sessions" add constraint "sessions_pkey" PRIMARY KEY using index "sessions_pkey";

alter table "public"."trainers" add constraint "trainers_pkey" PRIMARY KEY using index "trainers_pkey";

alter table "public"."workout_plans" add constraint "workout_plans_pkey" PRIMARY KEY using index "workout_plans_pkey";

alter table "public"."workouts" add constraint "workouts_pkey" PRIMARY KEY using index "workouts_pkey";

alter table "public"."ai_workout_plans" add constraint "ai_workout_plans_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."ai_workout_plans" validate constraint "ai_workout_plans_profile_id_fkey";

alter table "public"."cart_items" add constraint "cart_items_item_type_check" CHECK ((item_type = ANY (ARRAY['workout_plan'::text, 'session'::text]))) not valid;

alter table "public"."cart_items" validate constraint "cart_items_item_type_check";

alter table "public"."cart_items" add constraint "cart_items_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."cart_items" validate constraint "cart_items_profile_id_fkey";

alter table "public"."challenge_participants" add constraint "challenge_participants_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE not valid;

alter table "public"."challenge_participants" validate constraint "challenge_participants_challenge_id_fkey";

alter table "public"."challenge_participants" add constraint "challenge_participants_challenge_id_profile_id_key" UNIQUE using index "challenge_participants_challenge_id_profile_id_key";

alter table "public"."challenge_participants" add constraint "challenge_participants_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."challenge_participants" validate constraint "challenge_participants_profile_id_fkey";

alter table "public"."challenges" add constraint "challenges_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."challenges" validate constraint "challenges_created_by_fkey";

alter table "public"."comments" add constraint "comments_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_post_id_fkey";

alter table "public"."comments" add constraint "comments_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_profile_id_fkey";

alter table "public"."communities" add constraint "communities_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."communities" validate constraint "communities_created_by_fkey";

alter table "public"."community_members" add constraint "community_members_community_id_fkey" FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE not valid;

alter table "public"."community_members" validate constraint "community_members_community_id_fkey";

alter table "public"."community_members" add constraint "community_members_community_id_profile_id_key" UNIQUE using index "community_members_community_id_profile_id_key";

alter table "public"."community_members" add constraint "community_members_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."community_members" validate constraint "community_members_profile_id_fkey";

alter table "public"."community_members" add constraint "community_members_role_check" CHECK ((role = ANY (ARRAY['admin'::text, 'moderator'::text, 'member'::text]))) not valid;

alter table "public"."community_members" validate constraint "community_members_role_check";

alter table "public"."friends" add constraint "friends_check" CHECK ((profile_id <> friend_id)) not valid;

alter table "public"."friends" validate constraint "friends_check";

alter table "public"."friends" add constraint "friends_friend_id_fkey" FOREIGN KEY (friend_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "friends_friend_id_fkey";

alter table "public"."friends" add constraint "friends_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "friends_profile_id_fkey";

alter table "public"."friends" add constraint "friends_profile_id_friend_id_key" UNIQUE using index "friends_profile_id_friend_id_key";

alter table "public"."friends" add constraint "friends_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'blocked'::text]))) not valid;

alter table "public"."friends" validate constraint "friends_status_check";

alter table "public"."messages" add constraint "messages_check" CHECK ((((message_type = 'direct'::text) AND (recipient_id IS NOT NULL) AND (community_id IS NULL)) OR ((message_type = 'community'::text) AND (recipient_id IS NULL) AND (community_id IS NOT NULL)))) not valid;

alter table "public"."messages" validate constraint "messages_check";

alter table "public"."messages" add constraint "messages_community_id_fkey" FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_community_id_fkey";

alter table "public"."messages" add constraint "messages_message_type_check" CHECK ((message_type = ANY (ARRAY['direct'::text, 'community'::text]))) not valid;

alter table "public"."messages" validate constraint "messages_message_type_check";

alter table "public"."messages" add constraint "messages_recipient_id_fkey" FOREIGN KEY (recipient_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_recipient_id_fkey";

alter table "public"."messages" add constraint "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_sender_id_fkey";

alter table "public"."notifications" add constraint "notifications_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_profile_id_fkey";

alter table "public"."posts" add constraint "posts_community_id_fkey" FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE not valid;

alter table "public"."posts" validate constraint "posts_community_id_fkey";

alter table "public"."posts" add constraint "posts_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."posts" validate constraint "posts_profile_id_fkey";

alter table "public"."profiles" add constraint "profiles_fitness_level_check" CHECK ((fitness_level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_fitness_level_check";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."purchased_items" add constraint "purchased_items_item_type_check" CHECK ((item_type = ANY (ARRAY['workout_plan'::text, 'session'::text]))) not valid;

alter table "public"."purchased_items" validate constraint "purchased_items_item_type_check";

alter table "public"."purchased_items" add constraint "purchased_items_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."purchased_items" validate constraint "purchased_items_profile_id_fkey";

alter table "public"."ratings" add constraint "ratings_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."ratings" validate constraint "ratings_profile_id_fkey";

alter table "public"."ratings" add constraint "ratings_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."ratings" validate constraint "ratings_rating_check";

alter table "public"."ratings" add constraint "ratings_session_id_fkey" FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE not valid;

alter table "public"."ratings" validate constraint "ratings_session_id_fkey";

alter table "public"."ratings" add constraint "ratings_session_id_profile_id_key" UNIQUE using index "ratings_session_id_profile_id_key";

alter table "public"."sessions" add constraint "sessions_client_id_fkey" FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."sessions" validate constraint "sessions_client_id_fkey";

alter table "public"."sessions" add constraint "sessions_status_check" CHECK ((status = ANY (ARRAY['scheduled'::text, 'completed'::text, 'cancelled'::text]))) not valid;

alter table "public"."sessions" validate constraint "sessions_status_check";

alter table "public"."sessions" add constraint "sessions_trainer_id_fkey" FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE not valid;

alter table "public"."sessions" validate constraint "sessions_trainer_id_fkey";

alter table "public"."trainers" add constraint "trainers_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."trainers" validate constraint "trainers_profile_id_fkey";

alter table "public"."workout_plans" add constraint "workout_plans_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."workout_plans" validate constraint "workout_plans_created_by_fkey";

alter table "public"."workout_plans" add constraint "workout_plans_difficulty_check" CHECK ((difficulty = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text]))) not valid;

alter table "public"."workout_plans" validate constraint "workout_plans_difficulty_check";

alter table "public"."workouts" add constraint "workouts_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."workouts" validate constraint "workouts_profile_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_notification(profile_id uuid, title text, message text, notification_type text, data jsonb DEFAULT NULL::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (profile_id, title, message, type, data)
  VALUES (profile_id, title, message, notification_type, data)
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_community_member_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities
    SET member_count = member_count + 1
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities
    SET member_count = GREATEST(member_count - 1, 0)
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_post_comment_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET comments_count = GREATEST(comments_count - 1, 0)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_trainer_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  trainer_uuid UUID;
BEGIN
  SELECT trainer_id INTO trainer_uuid
  FROM public.sessions
  WHERE id = NEW.session_id;

  UPDATE public.trainers
  SET 
    rating = (
      SELECT AVG(r.rating)::DECIMAL(3,2)
      FROM public.ratings r
      JOIN public.sessions s ON r.session_id = s.id
      WHERE s.trainer_id = trainer_uuid
    ),
    total_sessions = (
      SELECT COUNT(*)
      FROM public.sessions
      WHERE trainer_id = trainer_uuid AND status = 'completed'
    )
  WHERE id = trainer_uuid;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_workout_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles
    SET 
      total_workouts = total_workouts + 1,
      calories_burned = calories_burned + COALESCE(NEW.calories_burned, 0),
      updated_at = NOW()
    WHERE id = NEW.profile_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles
    SET 
      total_workouts = GREATEST(total_workouts - 1, 0),
      calories_burned = GREATEST(calories_burned - COALESCE(OLD.calories_burned, 0), 0),
      updated_at = NOW()
    WHERE id = OLD.profile_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$
;

grant delete on table "public"."ai_workout_plans" to "anon";

grant insert on table "public"."ai_workout_plans" to "anon";

grant references on table "public"."ai_workout_plans" to "anon";

grant select on table "public"."ai_workout_plans" to "anon";

grant trigger on table "public"."ai_workout_plans" to "anon";

grant truncate on table "public"."ai_workout_plans" to "anon";

grant update on table "public"."ai_workout_plans" to "anon";

grant delete on table "public"."ai_workout_plans" to "authenticated";

grant insert on table "public"."ai_workout_plans" to "authenticated";

grant references on table "public"."ai_workout_plans" to "authenticated";

grant select on table "public"."ai_workout_plans" to "authenticated";

grant trigger on table "public"."ai_workout_plans" to "authenticated";

grant truncate on table "public"."ai_workout_plans" to "authenticated";

grant update on table "public"."ai_workout_plans" to "authenticated";

grant delete on table "public"."ai_workout_plans" to "service_role";

grant insert on table "public"."ai_workout_plans" to "service_role";

grant references on table "public"."ai_workout_plans" to "service_role";

grant select on table "public"."ai_workout_plans" to "service_role";

grant trigger on table "public"."ai_workout_plans" to "service_role";

grant truncate on table "public"."ai_workout_plans" to "service_role";

grant update on table "public"."ai_workout_plans" to "service_role";

grant delete on table "public"."cart_items" to "anon";

grant insert on table "public"."cart_items" to "anon";

grant references on table "public"."cart_items" to "anon";

grant select on table "public"."cart_items" to "anon";

grant trigger on table "public"."cart_items" to "anon";

grant truncate on table "public"."cart_items" to "anon";

grant update on table "public"."cart_items" to "anon";

grant delete on table "public"."cart_items" to "authenticated";

grant insert on table "public"."cart_items" to "authenticated";

grant references on table "public"."cart_items" to "authenticated";

grant select on table "public"."cart_items" to "authenticated";

grant trigger on table "public"."cart_items" to "authenticated";

grant truncate on table "public"."cart_items" to "authenticated";

grant update on table "public"."cart_items" to "authenticated";

grant delete on table "public"."cart_items" to "service_role";

grant insert on table "public"."cart_items" to "service_role";

grant references on table "public"."cart_items" to "service_role";

grant select on table "public"."cart_items" to "service_role";

grant trigger on table "public"."cart_items" to "service_role";

grant truncate on table "public"."cart_items" to "service_role";

grant update on table "public"."cart_items" to "service_role";

grant delete on table "public"."challenge_participants" to "anon";

grant insert on table "public"."challenge_participants" to "anon";

grant references on table "public"."challenge_participants" to "anon";

grant select on table "public"."challenge_participants" to "anon";

grant trigger on table "public"."challenge_participants" to "anon";

grant truncate on table "public"."challenge_participants" to "anon";

grant update on table "public"."challenge_participants" to "anon";

grant delete on table "public"."challenge_participants" to "authenticated";

grant insert on table "public"."challenge_participants" to "authenticated";

grant references on table "public"."challenge_participants" to "authenticated";

grant select on table "public"."challenge_participants" to "authenticated";

grant trigger on table "public"."challenge_participants" to "authenticated";

grant truncate on table "public"."challenge_participants" to "authenticated";

grant update on table "public"."challenge_participants" to "authenticated";

grant delete on table "public"."challenge_participants" to "service_role";

grant insert on table "public"."challenge_participants" to "service_role";

grant references on table "public"."challenge_participants" to "service_role";

grant select on table "public"."challenge_participants" to "service_role";

grant trigger on table "public"."challenge_participants" to "service_role";

grant truncate on table "public"."challenge_participants" to "service_role";

grant update on table "public"."challenge_participants" to "service_role";

grant delete on table "public"."challenges" to "anon";

grant insert on table "public"."challenges" to "anon";

grant references on table "public"."challenges" to "anon";

grant select on table "public"."challenges" to "anon";

grant trigger on table "public"."challenges" to "anon";

grant truncate on table "public"."challenges" to "anon";

grant update on table "public"."challenges" to "anon";

grant delete on table "public"."challenges" to "authenticated";

grant insert on table "public"."challenges" to "authenticated";

grant references on table "public"."challenges" to "authenticated";

grant select on table "public"."challenges" to "authenticated";

grant trigger on table "public"."challenges" to "authenticated";

grant truncate on table "public"."challenges" to "authenticated";

grant update on table "public"."challenges" to "authenticated";

grant delete on table "public"."challenges" to "service_role";

grant insert on table "public"."challenges" to "service_role";

grant references on table "public"."challenges" to "service_role";

grant select on table "public"."challenges" to "service_role";

grant trigger on table "public"."challenges" to "service_role";

grant truncate on table "public"."challenges" to "service_role";

grant update on table "public"."challenges" to "service_role";

grant delete on table "public"."comments" to "anon";

grant insert on table "public"."comments" to "anon";

grant references on table "public"."comments" to "anon";

grant select on table "public"."comments" to "anon";

grant trigger on table "public"."comments" to "anon";

grant truncate on table "public"."comments" to "anon";

grant update on table "public"."comments" to "anon";

grant delete on table "public"."comments" to "authenticated";

grant insert on table "public"."comments" to "authenticated";

grant references on table "public"."comments" to "authenticated";

grant select on table "public"."comments" to "authenticated";

grant trigger on table "public"."comments" to "authenticated";

grant truncate on table "public"."comments" to "authenticated";

grant update on table "public"."comments" to "authenticated";

grant delete on table "public"."comments" to "service_role";

grant insert on table "public"."comments" to "service_role";

grant references on table "public"."comments" to "service_role";

grant select on table "public"."comments" to "service_role";

grant trigger on table "public"."comments" to "service_role";

grant truncate on table "public"."comments" to "service_role";

grant update on table "public"."comments" to "service_role";

grant delete on table "public"."communities" to "anon";

grant insert on table "public"."communities" to "anon";

grant references on table "public"."communities" to "anon";

grant select on table "public"."communities" to "anon";

grant trigger on table "public"."communities" to "anon";

grant truncate on table "public"."communities" to "anon";

grant update on table "public"."communities" to "anon";

grant delete on table "public"."communities" to "authenticated";

grant insert on table "public"."communities" to "authenticated";

grant references on table "public"."communities" to "authenticated";

grant select on table "public"."communities" to "authenticated";

grant trigger on table "public"."communities" to "authenticated";

grant truncate on table "public"."communities" to "authenticated";

grant update on table "public"."communities" to "authenticated";

grant delete on table "public"."communities" to "service_role";

grant insert on table "public"."communities" to "service_role";

grant references on table "public"."communities" to "service_role";

grant select on table "public"."communities" to "service_role";

grant trigger on table "public"."communities" to "service_role";

grant truncate on table "public"."communities" to "service_role";

grant update on table "public"."communities" to "service_role";

grant delete on table "public"."community_members" to "anon";

grant insert on table "public"."community_members" to "anon";

grant references on table "public"."community_members" to "anon";

grant select on table "public"."community_members" to "anon";

grant trigger on table "public"."community_members" to "anon";

grant truncate on table "public"."community_members" to "anon";

grant update on table "public"."community_members" to "anon";

grant delete on table "public"."community_members" to "authenticated";

grant insert on table "public"."community_members" to "authenticated";

grant references on table "public"."community_members" to "authenticated";

grant select on table "public"."community_members" to "authenticated";

grant trigger on table "public"."community_members" to "authenticated";

grant truncate on table "public"."community_members" to "authenticated";

grant update on table "public"."community_members" to "authenticated";

grant delete on table "public"."community_members" to "service_role";

grant insert on table "public"."community_members" to "service_role";

grant references on table "public"."community_members" to "service_role";

grant select on table "public"."community_members" to "service_role";

grant trigger on table "public"."community_members" to "service_role";

grant truncate on table "public"."community_members" to "service_role";

grant update on table "public"."community_members" to "service_role";

grant delete on table "public"."friends" to "anon";

grant insert on table "public"."friends" to "anon";

grant references on table "public"."friends" to "anon";

grant select on table "public"."friends" to "anon";

grant trigger on table "public"."friends" to "anon";

grant truncate on table "public"."friends" to "anon";

grant update on table "public"."friends" to "anon";

grant delete on table "public"."friends" to "authenticated";

grant insert on table "public"."friends" to "authenticated";

grant references on table "public"."friends" to "authenticated";

grant select on table "public"."friends" to "authenticated";

grant trigger on table "public"."friends" to "authenticated";

grant truncate on table "public"."friends" to "authenticated";

grant update on table "public"."friends" to "authenticated";

grant delete on table "public"."friends" to "service_role";

grant insert on table "public"."friends" to "service_role";

grant references on table "public"."friends" to "service_role";

grant select on table "public"."friends" to "service_role";

grant trigger on table "public"."friends" to "service_role";

grant truncate on table "public"."friends" to "service_role";

grant update on table "public"."friends" to "service_role";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."purchased_items" to "anon";

grant insert on table "public"."purchased_items" to "anon";

grant references on table "public"."purchased_items" to "anon";

grant select on table "public"."purchased_items" to "anon";

grant trigger on table "public"."purchased_items" to "anon";

grant truncate on table "public"."purchased_items" to "anon";

grant update on table "public"."purchased_items" to "anon";

grant delete on table "public"."purchased_items" to "authenticated";

grant insert on table "public"."purchased_items" to "authenticated";

grant references on table "public"."purchased_items" to "authenticated";

grant select on table "public"."purchased_items" to "authenticated";

grant trigger on table "public"."purchased_items" to "authenticated";

grant truncate on table "public"."purchased_items" to "authenticated";

grant update on table "public"."purchased_items" to "authenticated";

grant delete on table "public"."purchased_items" to "service_role";

grant insert on table "public"."purchased_items" to "service_role";

grant references on table "public"."purchased_items" to "service_role";

grant select on table "public"."purchased_items" to "service_role";

grant trigger on table "public"."purchased_items" to "service_role";

grant truncate on table "public"."purchased_items" to "service_role";

grant update on table "public"."purchased_items" to "service_role";

grant delete on table "public"."ratings" to "anon";

grant insert on table "public"."ratings" to "anon";

grant references on table "public"."ratings" to "anon";

grant select on table "public"."ratings" to "anon";

grant trigger on table "public"."ratings" to "anon";

grant truncate on table "public"."ratings" to "anon";

grant update on table "public"."ratings" to "anon";

grant delete on table "public"."ratings" to "authenticated";

grant insert on table "public"."ratings" to "authenticated";

grant references on table "public"."ratings" to "authenticated";

grant select on table "public"."ratings" to "authenticated";

grant trigger on table "public"."ratings" to "authenticated";

grant truncate on table "public"."ratings" to "authenticated";

grant update on table "public"."ratings" to "authenticated";

grant delete on table "public"."ratings" to "service_role";

grant insert on table "public"."ratings" to "service_role";

grant references on table "public"."ratings" to "service_role";

grant select on table "public"."ratings" to "service_role";

grant trigger on table "public"."ratings" to "service_role";

grant truncate on table "public"."ratings" to "service_role";

grant update on table "public"."ratings" to "service_role";

grant delete on table "public"."sessions" to "anon";

grant insert on table "public"."sessions" to "anon";

grant references on table "public"."sessions" to "anon";

grant select on table "public"."sessions" to "anon";

grant trigger on table "public"."sessions" to "anon";

grant truncate on table "public"."sessions" to "anon";

grant update on table "public"."sessions" to "anon";

grant delete on table "public"."sessions" to "authenticated";

grant insert on table "public"."sessions" to "authenticated";

grant references on table "public"."sessions" to "authenticated";

grant select on table "public"."sessions" to "authenticated";

grant trigger on table "public"."sessions" to "authenticated";

grant truncate on table "public"."sessions" to "authenticated";

grant update on table "public"."sessions" to "authenticated";

grant delete on table "public"."sessions" to "service_role";

grant insert on table "public"."sessions" to "service_role";

grant references on table "public"."sessions" to "service_role";

grant select on table "public"."sessions" to "service_role";

grant trigger on table "public"."sessions" to "service_role";

grant truncate on table "public"."sessions" to "service_role";

grant update on table "public"."sessions" to "service_role";

grant delete on table "public"."trainers" to "anon";

grant insert on table "public"."trainers" to "anon";

grant references on table "public"."trainers" to "anon";

grant select on table "public"."trainers" to "anon";

grant trigger on table "public"."trainers" to "anon";

grant truncate on table "public"."trainers" to "anon";

grant update on table "public"."trainers" to "anon";

grant delete on table "public"."trainers" to "authenticated";

grant insert on table "public"."trainers" to "authenticated";

grant references on table "public"."trainers" to "authenticated";

grant select on table "public"."trainers" to "authenticated";

grant trigger on table "public"."trainers" to "authenticated";

grant truncate on table "public"."trainers" to "authenticated";

grant update on table "public"."trainers" to "authenticated";

grant delete on table "public"."trainers" to "service_role";

grant insert on table "public"."trainers" to "service_role";

grant references on table "public"."trainers" to "service_role";

grant select on table "public"."trainers" to "service_role";

grant trigger on table "public"."trainers" to "service_role";

grant truncate on table "public"."trainers" to "service_role";

grant update on table "public"."trainers" to "service_role";

grant delete on table "public"."workout_plans" to "anon";

grant insert on table "public"."workout_plans" to "anon";

grant references on table "public"."workout_plans" to "anon";

grant select on table "public"."workout_plans" to "anon";

grant trigger on table "public"."workout_plans" to "anon";

grant truncate on table "public"."workout_plans" to "anon";

grant update on table "public"."workout_plans" to "anon";

grant delete on table "public"."workout_plans" to "authenticated";

grant insert on table "public"."workout_plans" to "authenticated";

grant references on table "public"."workout_plans" to "authenticated";

grant select on table "public"."workout_plans" to "authenticated";

grant trigger on table "public"."workout_plans" to "authenticated";

grant truncate on table "public"."workout_plans" to "authenticated";

grant update on table "public"."workout_plans" to "authenticated";

grant delete on table "public"."workout_plans" to "service_role";

grant insert on table "public"."workout_plans" to "service_role";

grant references on table "public"."workout_plans" to "service_role";

grant select on table "public"."workout_plans" to "service_role";

grant trigger on table "public"."workout_plans" to "service_role";

grant truncate on table "public"."workout_plans" to "service_role";

grant update on table "public"."workout_plans" to "service_role";

grant delete on table "public"."workouts" to "anon";

grant insert on table "public"."workouts" to "anon";

grant references on table "public"."workouts" to "anon";

grant select on table "public"."workouts" to "anon";

grant trigger on table "public"."workouts" to "anon";

grant truncate on table "public"."workouts" to "anon";

grant update on table "public"."workouts" to "anon";

grant delete on table "public"."workouts" to "authenticated";

grant insert on table "public"."workouts" to "authenticated";

grant references on table "public"."workouts" to "authenticated";

grant select on table "public"."workouts" to "authenticated";

grant trigger on table "public"."workouts" to "authenticated";

grant truncate on table "public"."workouts" to "authenticated";

grant update on table "public"."workouts" to "authenticated";

grant delete on table "public"."workouts" to "service_role";

grant insert on table "public"."workouts" to "service_role";

grant references on table "public"."workouts" to "service_role";

grant select on table "public"."workouts" to "service_role";

grant trigger on table "public"."workouts" to "service_role";

grant truncate on table "public"."workouts" to "service_role";

grant update on table "public"."workouts" to "service_role";

create policy "Users can create own AI plans"
on "public"."ai_workout_plans"
as permissive
for insert
to public
with check ((auth.uid() = profile_id));


create policy "Users can view own AI plans"
on "public"."ai_workout_plans"
as permissive
for select
to public
using ((auth.uid() = profile_id));


create policy "Users can manage own cart"
on "public"."cart_items"
as permissive
for all
to public
using ((auth.uid() = profile_id));


create policy "Users can view own cart"
on "public"."cart_items"
as permissive
for select
to public
using ((auth.uid() = profile_id));


create policy "Anyone can view challenge participants"
on "public"."challenge_participants"
as permissive
for select
to public
using (true);


create policy "Users can join challenges"
on "public"."challenge_participants"
as permissive
for insert
to public
with check ((auth.uid() = profile_id));


create policy "Anyone can view challenges"
on "public"."challenges"
as permissive
for select
to public
using (true);


create policy "Authenticated users can create challenges"
on "public"."challenges"
as permissive
for insert
to public
with check (((auth.role() = 'authenticated'::text) AND (auth.uid() = created_by)));


create policy "Community members can create comments"
on "public"."comments"
as permissive
for insert
to public
with check (((auth.uid() = profile_id) AND (post_id IN ( SELECT posts.id
   FROM posts
  WHERE (posts.community_id IN ( SELECT community_members.community_id
           FROM community_members
          WHERE (community_members.profile_id = auth.uid())))))));


create policy "Community members can view comments"
on "public"."comments"
as permissive
for select
to public
using ((post_id IN ( SELECT posts.id
   FROM posts
  WHERE (posts.community_id IN ( SELECT community_members.community_id
           FROM community_members
          WHERE (community_members.profile_id = auth.uid()))))));


create policy "Anyone can view public communities"
on "public"."communities"
as permissive
for select
to public
using (((NOT is_private) OR (id IN ( SELECT community_members.community_id
   FROM community_members
  WHERE (community_members.profile_id = auth.uid())))));


create policy "Authenticated users can create communities"
on "public"."communities"
as permissive
for insert
to public
with check (((auth.role() = 'authenticated'::text) AND (auth.uid() = created_by)));


create policy "Members can view community membership"
on "public"."community_members"
as permissive
for select
to public
using (((community_id IN ( SELECT communities.id
   FROM communities
  WHERE (NOT communities.is_private))) OR (profile_id = auth.uid()) OR (community_id IN ( SELECT community_members_1.community_id
   FROM community_members community_members_1
  WHERE (community_members_1.profile_id = auth.uid())))));


create policy "Users can join communities"
on "public"."community_members"
as permissive
for insert
to public
with check ((auth.uid() = profile_id));


create policy "Users can leave communities"
on "public"."community_members"
as permissive
for delete
to public
using ((auth.uid() = profile_id));


create policy "Users can create friendships"
on "public"."friends"
as permissive
for insert
to public
with check ((auth.uid() = profile_id));


create policy "Users can delete own friendships"
on "public"."friends"
as permissive
for delete
to public
using (((auth.uid() = profile_id) OR (auth.uid() = friend_id)));


create policy "Users can update own friendships"
on "public"."friends"
as permissive
for update
to public
using ((auth.uid() = profile_id));


create policy "Users can view own friendships"
on "public"."friends"
as permissive
for select
to public
using (((auth.uid() = profile_id) OR (auth.uid() = friend_id)));


create policy "Users can send messages"
on "public"."messages"
as permissive
for insert
to public
with check (((auth.uid() = sender_id) AND (((message_type = 'direct'::text) AND (recipient_id IS NOT NULL)) OR ((message_type = 'community'::text) AND (community_id IN ( SELECT community_members.community_id
   FROM community_members
  WHERE (community_members.profile_id = auth.uid())))))));


create policy "Users can view own messages"
on "public"."messages"
as permissive
for select
to public
using (((auth.uid() = sender_id) OR (auth.uid() = recipient_id) OR ((message_type = 'community'::text) AND (community_id IN ( SELECT community_members.community_id
   FROM community_members
  WHERE (community_members.profile_id = auth.uid()))))));


create policy "Users can update own notifications"
on "public"."notifications"
as permissive
for update
to public
using ((auth.uid() = profile_id));


create policy "Users can view own notifications"
on "public"."notifications"
as permissive
for select
to public
using ((auth.uid() = profile_id));


create policy "Community members can create posts"
on "public"."posts"
as permissive
for insert
to public
with check (((auth.uid() = profile_id) AND (community_id IN ( SELECT community_members.community_id
   FROM community_members
  WHERE (community_members.profile_id = auth.uid())))));


create policy "Community members can view posts"
on "public"."posts"
as permissive
for select
to public
using ((community_id IN ( SELECT community_members.community_id
   FROM community_members
  WHERE (community_members.profile_id = auth.uid()))));


create policy "Users and moderators can delete posts"
on "public"."posts"
as permissive
for delete
to public
using (((auth.uid() = profile_id) OR (community_id IN ( SELECT community_members.community_id
   FROM community_members
  WHERE ((community_members.profile_id = auth.uid()) AND (community_members.role = ANY (ARRAY['admin'::text, 'moderator'::text])))))));


create policy "Users can update own posts"
on "public"."posts"
as permissive
for update
to public
using ((auth.uid() = profile_id));


create policy "Users can insert own profile"
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view all profiles"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can record own purchases"
on "public"."purchased_items"
as permissive
for insert
to public
with check ((auth.uid() = profile_id));


create policy "Users can view own purchases"
on "public"."purchased_items"
as permissive
for select
to public
using ((auth.uid() = profile_id));


create policy "Anyone can view ratings"
on "public"."ratings"
as permissive
for select
to public
using (true);


create policy "Session participants can rate"
on "public"."ratings"
as permissive
for insert
to public
with check (((auth.uid() = profile_id) AND (session_id IN ( SELECT sessions.id
   FROM sessions
  WHERE ((sessions.client_id = auth.uid()) OR (sessions.trainer_id IN ( SELECT trainers.id
           FROM trainers
          WHERE (trainers.profile_id = auth.uid()))))))));


create policy "Clients can book sessions"
on "public"."sessions"
as permissive
for insert
to public
with check ((auth.uid() = client_id));


create policy "Participants can update sessions"
on "public"."sessions"
as permissive
for update
to public
using (((auth.uid() = client_id) OR (trainer_id IN ( SELECT trainers.id
   FROM trainers
  WHERE (trainers.profile_id = auth.uid())))));


create policy "Participants can view sessions"
on "public"."sessions"
as permissive
for select
to public
using (((auth.uid() = client_id) OR (trainer_id IN ( SELECT trainers.id
   FROM trainers
  WHERE (trainers.profile_id = auth.uid())))));


create policy "Anyone can view trainers"
on "public"."trainers"
as permissive
for select
to public
using (true);


create policy "Trainers can update own profile"
on "public"."trainers"
as permissive
for update
to public
using ((auth.uid() = profile_id));


create policy "Users can become trainers"
on "public"."trainers"
as permissive
for insert
to public
with check ((auth.uid() = profile_id));


create policy "Anyone can view workout plans"
on "public"."workout_plans"
as permissive
for select
to public
using (true);


create policy "Authenticated users can create workout plans"
on "public"."workout_plans"
as permissive
for insert
to public
with check (((auth.role() = 'authenticated'::text) AND (auth.uid() = created_by)));


create policy "Users can delete own workouts"
on "public"."workouts"
as permissive
for delete
to public
using ((auth.uid() = profile_id));


create policy "Users can insert own workouts"
on "public"."workouts"
as permissive
for insert
to public
with check ((auth.uid() = profile_id));


create policy "Users can update own workouts"
on "public"."workouts"
as permissive
for update
to public
using ((auth.uid() = profile_id));


create policy "Users can view own workouts"
on "public"."workouts"
as permissive
for select
to public
using ((auth.uid() = profile_id));


CREATE TRIGGER update_post_comment_count_on_delete AFTER DELETE ON public.comments FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

CREATE TRIGGER update_post_comment_count_on_insert AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

CREATE TRIGGER update_community_member_count_on_delete AFTER DELETE ON public.community_members FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

CREATE TRIGGER update_community_member_count_on_insert AFTER INSERT ON public.community_members FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

CREATE TRIGGER update_trainer_rating_on_new_rating AFTER INSERT ON public.ratings FOR EACH ROW EXECUTE FUNCTION update_trainer_rating();

CREATE TRIGGER update_user_workout_stats_on_delete AFTER DELETE ON public.workouts FOR EACH ROW EXECUTE FUNCTION update_user_workout_stats();

CREATE TRIGGER update_user_workout_stats_on_insert AFTER INSERT ON public.workouts FOR EACH ROW EXECUTE FUNCTION update_user_workout_stats();


