from fastapi import Request, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

from initialize_dbs import operations
from api.__dependencies__.auth import login_required


async def get_community_id(community_title: str) -> int:
    results = await operations.execute("""SELECT ID FROM COMMUNITY_INFO WHERE LOWER(TITLE) = %s::text""", (community_title,))

    if not results:
        raise HTTPException(status_code=404, detail=f'Community not found: "{community_title}"')

    return results[0]


async def community_member_required(request: Request, community_title: str, user = Depends(login_required), community_id = Depends(get_community_id)) -> bool:
    print(f"WE ARE HERE::::::::::::: {user}")
    
    user_session_data: dict = request.session.get('user_session_data', None)
    user_info: dict = user_session_data.get('user_info', None)

    user_is_member = await operations.execute(
        """
            SELECT USER_ID, COMMUNITY_ID
            FROM USER_COMMUNITY
            WHERE USER_ID = %s::integer
            AND COMMUNITY_ID = %s::integer
        """, 
        (user_info.get('user_id', None), community_id)
    )

    if not user_is_member:
        raise HTTPException(status_code=403, detail="User is not a community member!")
    
    return True


async def check_community_tags(community_id: int, tags: list[str]) -> bool:
    results = await operations.execute("""
        SELECT TAG_NAME
        FROM COMMUNITY_TAGS
        WHERE COMMUNITY_ID = %s::integer
    """, (community_id,)
    )

    if not all([tag in results for tag in tags]):
        raise HTTPException(status_code=404, detail='One or more provided tags do not belong to this community!')
    
    return True
