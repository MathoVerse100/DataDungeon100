-- Create "community_comment_user_like_dislike" table
CREATE TABLE "public"."community_comment_user_like_dislike" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  "comment_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "value" integer NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "uq_community_comment_user_like_dislike__user_auth_community_com" UNIQUE ("comment_id", "user_id"),
  CONSTRAINT "fk_community_comment_user_like_dislike__community_comment_info" FOREIGN KEY ("comment_id") REFERENCES "public"."community_comment_info" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_community_comment_user_like_dislike__user_auth" FOREIGN KEY ("user_id") REFERENCES "public"."user_auth" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "community_comment_user_like_dislike_value_check" CHECK ((value = 1) OR (value = '-1'::integer))
);
