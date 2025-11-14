-- Modify "community_comment_info" table
ALTER TABLE "public"."community_comment_info" DROP CONSTRAINT "uq_community_comment_info__parent_id_depth";
