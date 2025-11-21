-- Create "community_permissions" table
CREATE TABLE "public"."community_permissions" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  "permission_name" character varying(255) NOT NULL,
  PRIMARY KEY ("id")
);
-- Rename a column from "role" to "role_name"
ALTER TABLE "public"."community_roles" RENAME COLUMN "role" TO "role_name";
-- Modify "community_roles" table
ALTER TABLE "public"."community_roles" DROP COLUMN "permission", ADD COLUMN "community_id" integer NOT NULL, ADD CONSTRAINT "uq_community_roles__community_info_community_permissions" UNIQUE ("community_id", "role_name");
-- Create "community_role_permissions" table
CREATE TABLE "public"."community_role_permissions" (
  "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  "role_id" integer NOT NULL,
  "permission_id" integer NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "uq_community_role_permissions__community_roles_community_permis" UNIQUE ("role_id", "permission_id"),
  CONSTRAINT "fk_community_role_permissions__community_permissions" FOREIGN KEY ("permission_id") REFERENCES "public"."community_permissions" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_community_role_permissions__community_roles" FOREIGN KEY ("role_id") REFERENCES "public"."community_roles" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
