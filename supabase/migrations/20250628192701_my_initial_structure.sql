drop function if exists "public"."create_notification"(user_id uuid, title text, message text, notification_type text, data jsonb);

drop function if exists "public"."handle_new_user"();

drop function if exists "public"."update_community_member_count"();

drop function if exists "public"."update_post_comment_count"();

drop function if exists "public"."update_trainer_rating"();

drop function if exists "public"."update_user_workout_stats"();


