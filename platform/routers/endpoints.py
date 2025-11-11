from routers.auth.endpoints import paths as auth_paths
from routers.home.endpoints import paths as home_paths
from routers.communities.endpoints import paths as communities_paths
from routers.university.endpoints import paths as universities_paths


paths = [
    *auth_paths,
    *home_paths,
    *communities_paths,
    *universities_paths,
]