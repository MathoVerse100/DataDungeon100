-- Modify "community_comment_info" table
ALTER TABLE "public"."community_comment_info" ADD CONSTRAINT "community_comment_info_depth_check" CHECK (depth >= 0), ADD COLUMN "parent_id" integer NULL, ADD COLUMN "depth" integer NOT NULL DEFAULT 0, ADD CONSTRAINT "uq_community_comment_info__parent_id_depth" UNIQUE ("parent_id", "depth"), ADD CONSTRAINT "fk_community_comment_info__community_comment_info" FOREIGN KEY ("parent_id") REFERENCES "public"."community_comment_info" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
-- Drop "community_comment_tree" table
DROP TABLE "public"."community_comment_tree";
