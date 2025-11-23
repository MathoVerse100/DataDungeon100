from fastapi.exceptions import HTTPException

from initialize_dbs import operations


async def check_community_exists(community_title: str) -> int:
    results = await operations.execute(
        """SELECT ID FROM COMMUNITY_INFO WHERE LOWER(TITLE) = %s::text""",
        (community_title,)
    )

    if not results:
        raise HTTPException(status_code=404, detail='Community not found')

    return results[0]['id']


async def check_community_member(user_id: int, community_id: int) -> int:

    user_is_member = await operations.execute(
        """
            SELECT USER_ID, COMMUNITY_ID
            FROM USER_COMMUNITY
            WHERE USER_ID = %s::integer
            AND COMMUNITY_ID = %s::integer
        """, 
        (user_id, community_id)
    )

    if not user_is_member:
        raise HTTPException(status_code=403, detail="User is not a community member!")
    
    return user_id


async def check_community_tags(community_id: int, tags: list[str]) -> list[str]:
    results = await operations.execute("""
        SELECT TAG_NAME
        FROM COMMUNITY_TAGS
        WHERE COMMUNITY_ID = %s::integer
    """, (community_id,)
    )

    if not all(
        [
            tag.lower() in [result['tag_name'].lower() for result in results]
            for tag in tags
        ]
    ):
        raise HTTPException(status_code=404, detail='One or more provided tags do not belong to this community!')
    
    return tags


async def check_community_post_exists(post_id: int) -> int:
    results = await operations.execute(
        """SELECT ID FROM COMMUNITY_POST_INFO WHERE ID = %s::integer""",
        (post_id,)
    )
    
    if not results:
        raise HTTPException(status_code=404, detail='Post not found')
    
    return results[0]['id']

