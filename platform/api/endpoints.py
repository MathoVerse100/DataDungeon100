from api.auth import generator as auth
from api.__community_id__ import generator as __community_id__
from api.__post_id__ import generator as __post_id__

paths = [
    auth,
    __community_id__,
    __post_id__,
]