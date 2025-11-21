-- Modify "community_roles" table
ALTER TABLE "public"."community_roles" ADD CONSTRAINT "fk_community_roles__community_info" FOREIGN KEY ("community_id") REFERENCES "public"."community_info" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
