-- Modify "user_auth" table
ALTER TABLE "public"."user_auth" DROP CONSTRAINT "user_auth_username_check", ADD CONSTRAINT "user_auth_username_check" CHECK ((char_length((username)::text) >= 5) AND ((username)::text ~ '^[a-zA-Z0-9_]+$'::text));
