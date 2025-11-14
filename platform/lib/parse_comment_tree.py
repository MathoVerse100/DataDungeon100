from typing import TypedDict
from datetime import datetime


class Comment(TypedDict):
    id: int
    community_title: str
    user_id: int
    first_name: str
    last_name: str
    username: str
    parent_id: int | None
    depth: int
    post_id: int
    created_at: datetime
    last_updated_at: datetime
    content: str
    likes: int
    dislikes: int
    is_root: bool
    replies: list


def parse_comment_tree(comments: list[Comment]):

    tree = []
    replies = {}

    for comment in comments:
        replies[comment['id']] = comment['replies']

        if comment['depth'] == 0:
            tree.append(comment)
        else:
            replies[comment['parent_id']].append(comment)
    
    return tree
