set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_notification(user_id uuid, title text, message text, notification_type text, data jsonb DEFAULT NULL::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, data)
  VALUES (user_id, title, message, notification_type, data)
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
  INSERT INTO public.users (id, username, display_name, avatar_url)
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
    SET member_count = member_count - 1 
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
    SET comments_count = comments_count - 1 
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
BEGIN
  UPDATE public.trainers 
  SET 
    rating = (
      SELECT AVG(r.rating)::DECIMAL(3,2)
      FROM public.ratings r
      JOIN public.sessions s ON r.session_id = s.id
      WHERE s.trainer_id = (
        SELECT trainer_id FROM public.sessions WHERE id = NEW.session_id
      )
    ),
    total_sessions = (
      SELECT COUNT(*)
      FROM public.sessions
      WHERE trainer_id = (
        SELECT trainer_id FROM public.sessions WHERE id = NEW.session_id
      ) AND status = 'completed'
    )
  WHERE id = (
    SELECT trainer_id FROM public.sessions WHERE id = NEW.session_id
  );
  
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
    UPDATE public.users 
    SET 
      total_workouts = total_workouts + 1,
      calories_burned = calories_burned + COALESCE(NEW.calories_burned, 0),
      updated_at = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.users 
    SET 
      total_workouts = GREATEST(total_workouts - 1, 0),
      calories_burned = GREATEST(calories_burned - COALESCE(OLD.calories_burned, 0), 0),
      updated_at = NOW()
    WHERE id = OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$
;


