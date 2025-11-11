from routers.communities.communities import generator as communities
from routers.communities.__community_id__.endpoints import paths as __community_id___paths


paths = [
    communities,
    *__community_id___paths,
]