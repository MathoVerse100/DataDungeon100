from routers.communities.__community_id__.__post_id__.post_id import generator as __post_id__
from routers.communities.__community_id__.__post_id__.__comment_id__.endpoints import paths as __comment_id___paths

paths = [
    __post_id__,
    *__comment_id___paths,
]