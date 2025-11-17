-- Create index "idx_community_comment_info__parent_id_post_id" to table: "community_comment_info"
CREATE INDEX "idx_community_comment_info__parent_id_post_id" ON "public"."community_comment_info" ("id", "parent_id", "post_id");
-- Create index "idx_community_info__title" to table: "community_info"
CREATE INDEX "idx_community_info__title" ON "public"."community_info" ((lower((title)::text)));
-- Create index "idx_community_post_info__community_id" to table: "community_post_info"
CREATE INDEX "idx_community_post_info__community_id" ON "public"."community_post_info" ("community_id");
