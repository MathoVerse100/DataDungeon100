-- Create "community_info" table
CREATE TABLE "public"."community_info" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  "owner_id" integer NOT NULL,
  "title" character varying(50) NOT NULL,
  "subtitle" character varying(100) NOT NULL,
  "description" character varying(255) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_updated_at" timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);
-- Create "user_community" table
CREATE TABLE "public"."user_community" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  "community_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "uq_user_community__community_id_user_id" UNIQUE ("community_id", "user_id"),
  CONSTRAINT "fk_user_community__community_info" FOREIGN KEY ("community_id") REFERENCES "public"."community_info" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_user_community__user_auth" FOREIGN KEY ("user_id") REFERENCES "public"."user_auth" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
