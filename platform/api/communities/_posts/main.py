from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.encoders import jsonable_encoder

from initialize_dbs import operations


def generator(app: FastAPI):

    @app.get('/api/communities/{community_title}/posts/{post_id}/main')
    async def api_communities_posts_main(community_title: str, post_id: str):
        if not (
            await operations.execute(
                """SELECT TITLE FROM COMMUNITY_INFO WHERE LOWER(TITLE) = %s::text""",
                (community_title,)
            )
        ):
            raise HTTPException(status_code=404, detail='Community not found')


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
            AND A.ID = %s::integer;
        """

        results = await operations.execute(
            query,
            (community_title, post_id)
        )

        if not results:
            raise HTTPException(status_code=404, detail='Post not found')
        
        return JSONResponse(status_code=200, content=jsonable_encoder(results[0]))

    