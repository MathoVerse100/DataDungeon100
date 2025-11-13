-- Modify "community_info" table
ALTER TABLE "public"."community_info" ADD CONSTRAINT "community_info_description_check" CHECK (length(description) <= 500), ALTER COLUMN "subtitle" TYPE character varying(255), ALTER COLUMN "description" TYPE text;
