-- Create "user_auth" table
CREATE TABLE "public"."user_auth" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  "first_name" character varying(100) NOT NULL,
  "last_name" character varying(100) NOT NULL,
  "username" character varying(255) NOT NULL,
  "password" character(60) NOT NULL,
  "is_active" boolean NOT NULL DEFAULT true,
  "is_banned" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_sign_in" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "user_auth_first_name_last_name_key" UNIQUE ("first_name", "last_name"),
  CONSTRAINT "user_auth_username_key" UNIQUE ("username")
);
