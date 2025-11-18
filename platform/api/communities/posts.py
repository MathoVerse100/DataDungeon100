from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.encoders import jsonable_encoder

from enum import Enum
from initialize_dbs import operations


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
