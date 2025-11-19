-- Create "community_post_user_like_dislike" table
CREATE TABLE "public"."community_post_user_like_dislike" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  "user_id" integer NOT NULL,
  "post_id" integer NOT NULL,
  "value" integer NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "uq_community_post_user_like_dislike__user_auth_community_post_i" UNIQUE ("user_id", "post_id"),
  CONSTRAINT "fk_community_post_user_like_dislike__community_post_info" FOREIGN KEY ("post_id") REFERENCES "public"."community_post_info" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_community_post_user_like_dislike__user_auth" FOREIGN KEY ("user_id") REFERENCES "public"."user_auth" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "community_post_user_like_dislike_value_check" CHECK ((value = 1) OR (value = '-1'::integer))
);
-- Drop "community_user_like_dislike" table
DROP TABLE "public"."community_user_like_dislike";
