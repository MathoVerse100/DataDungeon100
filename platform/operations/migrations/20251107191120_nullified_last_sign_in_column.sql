-- Modify "user_auth" table
ALTER TABLE "public"."user_auth" ALTER COLUMN "last_sign_in" DROP NOT NULL, ALTER COLUMN "last_sign_in" DROP DEFAULT;
