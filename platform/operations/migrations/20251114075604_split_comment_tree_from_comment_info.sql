-- Modify "community_comment_info" table
ALTER TABLE "public"."community_comment_info" DROP CONSTRAINT "community_comment_info_depth_check", DROP COLUMN "parent_id", DROP COLUMN "depth";
-- Create "community_comment_tree" table
CREATE TABLE "public"."community_comment_tree" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  "parent_id" integer NULL,
  "child_id" integer NOT NULL,
  "depth" integer NOT NULL DEFAULT 0,
  PRIMARY KEY ("id"),
  CONSTRAINT "uq_community_comment_tree__community_comment_info_community_com" UNIQUE ("parent_id", "child_id", "depth"),
  CONSTRAINT "fk_community_comment_tree__community_comment_info___child_id" FOREIGN KEY ("child_id") REFERENCES "public"."community_comment_info" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_community_comment_tree__community_comment_info___parent_id" FOREIGN KEY ("parent_id") REFERENCES "public"."community_comment_info" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "community_comment_tree_depth_check" CHECK (depth >= 0)
);
