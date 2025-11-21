from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, conlist, StringConstraints, field_validator
from typing import Annotated

from initialize_dbs import operations
from api.__dependencies__.communities import community_member_required, get_community_id, check_community_tags


class PostBody(BaseModel):
    title: str
    tags: Annotated[list[str], conlist(str, min_length=1, max_length=10)]
    content: Annotated[
        str,
        StringConstraints(min_length=1)
    ]

    @field_validator('tags', mode='before')
    def remove_capitalization_tags(cls, tags):
        if isinstance(tags, list):
            tags = [tag.lower() for tag in tags]
        
        return tags
    
    @field_validator("content", mode='before')
    def strip_content(cls, content):
        if isinstance(content, str):
            content = content.strip()

        return content


def generator(app: FastAPI):

    @app.get('/api/communities/{community_title}/posts')
    async def api_communities_posts(
        community_title: str,
        filter: str = 'likes',
        sort: str = 'descending',
        offset: int = 0,
        limit: int = 10
    ):
        if not (
            await operations.execute(
                """SELECT TITLE FROM COMMUNITY_INFO WHERE LOWER(TITLE) = %s::text""",
                (community_title,)
            )
        ):
            raise HTTPException(status_code=404, detail='Community not found')

        if filter.lower() not in ('likes', 'dislikes', 'created_at'):
            raise HTTPException(status_code=404, detail=f'Invalid filter: "{filter}"')

        if sort.lower() not in ('asc', 'desc', 'ascending', 'descending'):
            raise HTTPException(status_code=404, detail=f'Invalid sort: "{sort}"')
        
        if limit < 0:
            raise HTTPException(status_code=400, detail=f'Invalid community posts limit: "{limit}"')

        if offset < 0:
            raise HTTPException(status_code=400, detail=f'Invalid community posts offset: "{limit}"')

        if limit >= 100:
            raise HTTPException(status_code=404, detail=f'Requested number of comments is too large ("{limit}")')

        filter = filter.lower()
        sort = 'asc' if sort.lower() in ('asc', 'ascending') else 'desc'

        query = f"""
            SELECT
                A.ID,
                A.COMMUNITY_ID,
                B.TITLE AS COMMUNITY_TITLE,
                A.USER_ID,
                C.USERNAME,
                C.FIRST_NAME,
                C.LAST_NAME,
                A.TAGS,
                A.TITLE,
                A.CONTENT,
                A.LIKES,
                A.DISLIKES,
                A.ALLOW_COMMENTS,
                A.CREATED_AT,
                A.UPDATED_AT
            FROM COMMUNITY_POST_INFO A
            JOIN COMMUNITY_INFO B
            ON A.COMMUNITY_ID = B.ID
            JOIN USER_AUTH C
            ON A.USER_ID = C.ID
            WHERE 1=1
            AND LOWER(B.TITLE) = %s::text
            ORDER BY {filter} {sort}, ID
            LIMIT %s::integer
            OFFSET %s::integer;
        """

        results = await operations.execute(
            query,
            (community_title, limit, offset)
        )

        return JSONResponse(status_code=200, content=jsonable_encoder(results))

    @app.post('/api/communities/{community_title}/posts', dependencies=[Depends(community_member_required)])
    async def api_communities_posts(
        request: Request,
        community_title: str,
        post_body: PostBody,
        community_id = Depends(get_community_id)
    ):
        # if not (
        #     await operations.execute(
        #         """SELECT TITLE FROM COMMUNITY_INFO WHERE LOWER(TITLE) = %s::text""",
        #         (community_title,)
        #     )
        # ):
        #     raise HTTPException(status_code=404, detail='Community not found')

        await check_community_tags(community_id, post_body.tags)
      
        user_session_data: dict = request.session.get('user_session_data')
        user_info: dict = user_session_data.get('user_info')

        query = f"""
            INSERT INTO COMMUNITY_POST_INFO (COMMUNITY_ID, USER_ID, TAGS, TITLE, CONTENT)
            VALUES (%s::integer, %s::integer, (%s::text[]), %s::text, %s::text)
        """

        try:
            await operations.execute(
                query,
                (community_id, user_info.get('user_id', None), post_body.tags, post_body.title, post_body.content),
                fetch=False
            )
        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))
        
        return JSONResponse(status_code=200, content="Post created!")




