-- Create "community_comment_info" table
CREATE TABLE "public"."community_comment_info" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  "parent_id" integer NULL,
  "depth" integer NOT NULL DEFAULT 0,
  "post_id" integer NOT NULL,
  "comment_type" character varying(255) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "content" text NOT NULL,
  "likes" integer NOT NULL DEFAULT 0,
  "dislikes" integer NOT NULL DEFAULT 0,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_community_comment_info__community_post_info" FOREIGN KEY ("post_id") REFERENCES "public"."community_post_info" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "community_comment_info_check" CHECK (
CASE
    WHEN (upper((comment_type)::text) = 'TREE'::text) THEN (length(content) <= 10000)
    WHEN (upper((comment_type)::text) = 'THREAD'::text) THEN (length(content) <= 20000)
    ELSE (length(content) <= 5000)
END),
  CONSTRAINT "community_comment_info_depth_check" CHECK (depth >= 0)
);
