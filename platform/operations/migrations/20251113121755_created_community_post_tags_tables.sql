-- Create "community_post_info" table
CREATE TABLE "public"."community_post_info" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  "community_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "tags" integer[] NOT NULL,
  "title" text NOT NULL,
  "content" text NOT NULL,
  "likes" integer NOT NULL DEFAULT 0,
  "dislikes" integer NOT NULL DEFAULT 0,
  "comments" integer NOT NULL DEFAULT 0,
  "allow_comments" boolean NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_community_post_info__community_info" FOREIGN KEY ("community_id") REFERENCES "public"."community_info" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_community_post_info__user_auth" FOREIGN KEY ("user_id") REFERENCES "public"."user_auth" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "community_post_info_title_check" CHECK (length(title) <= 500)
);
-- Create "community_tags" table
CREATE TABLE "public"."community_tags" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  "community_id" integer NOT NULL,
  "tag_name" character varying(100) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_community_tags__community_info" FOREIGN KEY ("community_id") REFERENCES "public"."community_info" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create "community_post_tags" table
CREATE TABLE "public"."community_post_tags" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  "tag_id" integer NOT NULL,
  "post_id" integer NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "uq_community_post_tags__community_info_community_tags" UNIQUE ("tag_id", "post_id"),
  CONSTRAINT "fk_community_post_tags__community_post_info" FOREIGN KEY ("post_id") REFERENCES "public"."community_post_info" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_community_post_tags__community_tags" FOREIGN KEY ("tag_id") REFERENCES "public"."community_tags" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
