from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.encoders import jsonable_encoder

from initialize_dbs import operations


def generator(app: FastAPI):

    @app.get('/api/communities/{community_title}/posts/{post_id}/comments/{comment_id}/main')
    async def api_communities_posts_comments_main(
        community_title: str,
        post_id: int,
        comment_id: int
    ):
        if not (
            await operations.execute(
                """SELECT TITLE FROM COMMUNITY_INFO WHERE LOWER(TITLE) = %s::text""",
                (community_title,)
            )
        ):
            raise HTTPException(status_code=404, detail='Community not found')

        if not (
            await operations.execute(
                """SELECT ID FROM COMMUNITY_POST_INFO WHERE ID = %s::integer""",
                (post_id,)
            )
        ):
            raise HTTPException(status_code=404, detail='Post not found')

        if not (
            await operations.execute(
                """SELECT ID FROM COMMUNITY_COMMENT_INFO WHERE ID = %s::integer""",
                (comment_id,)
            )
        ):
            raise HTTPException(status_code=404, detail='Comment not found')

        query = f"""
            SELECT
                A.ID,
                A.PARENT_ID,
                A.DEPTH,
                A.USER_ID,
                B.FIRST_NAME,
                B.LAST_NAME,
                B.USERNAME,
                A.POST_ID,
                A.COMMENT_TYPE,
                A.CREATED_AT,
                A.LAST_UPDATED_AT,
                A.CONTENT,
                A.LIKES,
                A.DISLIKES,
                A.IS_ROOT
            FROM COMMUNITY_COMMENT_INFO A
            JOIN USER_AUTH B
            ON A.USER_ID = B.ID
            WHERE 1=1
            AND A.POST_ID = %s::integer
            AND A.ID = %s::integer;             
        """

        results = await operations.execute(
            query,
            (post_id, comment_id)
        )

        return JSONResponse(status_code=200, content=jsonable_encoder(results[0]))
