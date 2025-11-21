-- Modify "community_roles" table
ALTER TABLE "public"."community_roles" DROP COLUMN "community_id", ADD CONSTRAINT "uq_community_roles__community_roles" UNIQUE ("role_name");
