-- Modify "community_comment_info" table
ALTER TABLE "public"."community_comment_info" ADD COLUMN "user_id" integer NOT NULL, ADD CONSTRAINT "fk_community_comment_info__user_auth" FOREIGN KEY ("user_id") REFERENCES "public"."user_auth" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
