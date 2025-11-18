from api.communities.main import generator as main
from api.communities.posts import generator as posts
from api.communities._posts.endpoints import paths as posts_paths


paths = [
    main,
    posts,
    *posts_paths,
]