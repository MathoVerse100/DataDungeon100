-- Modify "community_comment_info" table
ALTER TABLE "public"."community_comment_info" ADD CONSTRAINT "fk_community_comment_info__community_comment_info" FOREIGN KEY ("parent_id") REFERENCES "public"."community_comment_info" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
