from api.auth_temp.endpoints_temp import paths as auth_paths
from api.communities_temp.endpoints_temp import paths as communities_paths

paths = [
    *auth_paths,
    *communities_paths,
]