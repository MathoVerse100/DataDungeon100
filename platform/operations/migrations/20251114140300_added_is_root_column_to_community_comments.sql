-- Modify "community_comment_info" table
ALTER TABLE "public"."community_comment_info" ADD COLUMN "is_root" boolean NOT NULL DEFAULT false;
