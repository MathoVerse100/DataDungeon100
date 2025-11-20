-- Create "community_roles" table
CREATE TABLE "public"."community_roles" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  "role" character varying(255) NOT NULL,
  "permission" character varying(255) NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "uq_community_roles__community_roles" UNIQUE ("role", "permission")
);
-- Modify "user_community" table
ALTER TABLE "public"."user_community" ADD COLUMN "role_id" integer NOT NULL, ADD CONSTRAINT "fk_user_community__community_roles" FOREIGN KEY ("role_id") REFERENCES "public"."community_roles" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
