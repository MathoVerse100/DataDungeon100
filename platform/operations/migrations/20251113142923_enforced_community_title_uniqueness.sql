-- Modify "community_info" table
ALTER TABLE "public"."community_info" ADD CONSTRAINT "community_info_title_key" UNIQUE ("title");
