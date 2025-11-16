from spa.communities.endpoints import paths as communities_paths
from spa.auth.endpoints import paths as auth_paths

paths = [
    *communities_paths,
    *auth_paths,
]