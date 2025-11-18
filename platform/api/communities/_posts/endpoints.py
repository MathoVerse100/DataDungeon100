from api.communities._posts.comments import generator as comments
from api.communities._posts.main import generator as main
from api.communities._posts.reaction import generator as reaction
from api.communities._posts._comments.endpoints import paths as comments_paths


paths = [
    comments,
    main,
    reaction,
    comments_paths,
]
