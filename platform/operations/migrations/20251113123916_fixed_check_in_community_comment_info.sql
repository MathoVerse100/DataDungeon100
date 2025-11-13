-- Modify "community_comment_info" table
ALTER TABLE "public"."community_comment_info" DROP CONSTRAINT "community_comment_info_check", ADD CONSTRAINT "community_comment_info_check" CHECK (((upper((comment_type)::text) = 'TREE'::text) AND (length(content) <= 10000)) OR ((upper((comment_type)::text) = 'THREAD'::text) AND (length(content) <= 20000)));
