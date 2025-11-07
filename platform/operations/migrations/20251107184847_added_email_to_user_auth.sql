-- Modify "user_auth" table
ALTER TABLE "public"."user_auth" ADD CONSTRAINT "user_auth_email_check" CHECK (email ~ '^\S+@\S+\.\S+$'::text), ADD COLUMN "email" text NOT NULL, ADD CONSTRAINT "user_auth_email_key" UNIQUE ("email");
