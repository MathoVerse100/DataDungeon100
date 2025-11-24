# DataDungeon100

This is a multi-product app.

(In this branch, I will combine the API with the session management process and change the SPA Frontend so that it hits the API directly)

Current endpoints:
--> GET /api/communities/{community_title}/main
--> GET /api/communities/{community_title}/posts?filter=likes&sort=descending&offset=10&limit=10
--> GET /api/communities/{community_title}/posts/{post_id}/main
--> GET /api/communities/{community_title}/posts/{post_id}/comments?filter=likes&sort=descending&offset=10&limit=10
--> POST /api/communities/{community_title}/posts/{post_id}/comments
--> POST /api/communities/{community_title}/posts/{post_id}/reaction
--> GET /api/communities/{community_title}/posts/{post_id}/comments/{comment_id}/main
--> GET POST /api/communities/{community_title}/posts/{post_id}/comments/{comment_id}/comments?filter=likes&sort=descending&offset=10&limit=10
--> POST /api/communities/{community_title}/posts/{post_id}/comments/{comment_id}/comments
--> POST /api/communities/{community_title}/posts/{post_id}/comments/{comment_id}/reaction

Next goal:
-> Begin Real time Chat system

() => Must separate fetching from non-fetching method of DB instances.
() => Must separate community and post existence checks into their own dependency functions.
