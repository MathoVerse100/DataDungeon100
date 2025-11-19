from fastapi import FastAPI, Request, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, StringConstraints, field_validator
from typing import Annotated

from initialize_dbs import operations
from lib.parse_comment_tree import parse_comment_tree
from api.dependencies import login_required


class CommentBody(BaseModel):
    content: Annotated[
        str,
        StringConstraints(min_length=1)
    ]

    @field_validator("content", mode='before')
    def strip_content(cls, content):
        if isinstance(content, str):
            content = content.strip()

        return content


def generator(app: FastAPI):

    @app.get('/api/communities/{community_title}/posts/{post_id}/comments/{comment_id}/comments')
    async def api_communities_posts_comments_comments(
        community_title: str,
        post_id: int,
        comment_id: int,
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
            WITH RECURSIVE

            FILTERED_COMMUNITY_COMMENT_INFO AS (
                SELECT
                    A.ID,
                    C.TITLE AS COMMUNITY_TITLE,
                    A.USER_ID,
                    D.FIRST_NAME,
                    D.LAST_NAME,
                    D.USERNAME,
                    A.PARENT_ID,
                    A.DEPTH,
                    A.POST_ID,
                    A.CREATED_AT,
                    A.LAST_UPDATED_AT,
                    A.CONTENT,
                    A.LIKES,
                    A.DISLIKES,
                    A.IS_ROOT
                FROM COMMUNITY_COMMENT_INFO A
                JOIN COMMUNITY_POST_INFO B
                ON A.POST_ID = B.ID
                JOIN COMMUNITY_INFO C
                ON B.COMMUNITY_ID = C.ID
                JOIN USER_AUTH D
                ON A.USER_ID = D.ID
                WHERE 1=1
                AND LOWER(C.TITLE) = %s::text
                AND A.POST_ID = %s::integer
            ),

            RELATED_COMMENT_IDS AS (
                SELECT ID, DEPTH
                FROM FILTERED_COMMUNITY_COMMENT_INFO
                WHERE ID = %s::integer

                UNION ALL

                SELECT B.ID, B.DEPTH
                FROM RELATED_COMMENT_IDS A
                JOIN FILTERED_COMMUNITY_COMMENT_INFO B
                ON A.ID = B.PARENT_ID
            ),

            MINIMUM_DEPTH AS (
                SELECT MIN(DEPTH) AS DEPTH
                FROM RELATED_COMMENT_IDS
            )

            SELECT
                A.ID,
                A.COMMUNITY_TITLE,
                A.USER_ID,
                A.FIRST_NAME,
                A.LAST_NAME,
                A.USERNAME,
                CASE
                    WHEN A.DEPTH IN (SELECT DEPTH FROM MINIMUM_DEPTH)
                    THEN NULL
                    ELSE A.PARENT_ID
                END AS PARENT_ID,
                A.DEPTH - (SELECT DEPTH FROM MINIMUM_DEPTH) AS DEPTH,
                A.POST_ID,
                A.CREATED_AT,
                A.LAST_UPDATED_AT,
                A.CONTENT,
                A.LIKES,
                A.DISLIKES,
                A.IS_ROOT,
                '{{}}'::INTEGER[] AS REPLIES
            FROM FILTERED_COMMUNITY_COMMENT_INFO A
            JOIN RELATED_COMMENT_IDS B
            ON A.ID = B.ID
            WHERE 1=1
            ORDER BY ID
        """

        results = await operations.execute(
            query,
            (community_title, post_id, comment_id)
        )

        tree = parse_comment_tree(results)
        if tree[0]['replies']:
            tree[0]['replies'] = sorted(tree[0]['replies'], key=lambda reply: reply[filter], reverse=(True if sort == 'desc' else False))

        if offset > len(tree[0]['replies']) - 1:
            tree[0]['replies'] = []
        else:
            tree[0]['replies'] = tree[0]['replies'][offset:]
        
        if limit <= len(tree[0]['replies']) - 1:
            tree[0]['replies'] = tree[0]['replies'][:limit]
        
        return JSONResponse(status_code=200, content=jsonable_encoder(tree))
    

    @app.post('/api/communities/{community_title}/posts/{post_id}/comments/{comment_id}/comments', dependencies=[Depends(login_required)])
    async def api_communities_posts_comments_comments(
        request: Request,
        community_title: str,
        post_id: int,
        comment_id: int,
        comment_body: CommentBody
    ) -> Response:
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
        

        user_session_data: dict = request.session.get('user_session_data', None)
        user_info: dict = user_session_data.get('user_info', None)

        query = f"""
            INSERT INTO COMMUNITY_COMMENT_INFO (PARENT_ID, USER_ID, POST_ID, COMMENT_TYPE, CONTENT, IS_ROOT)
            VALUES (%s::integer , %s::integer, %s::integer, %s::text, %s::text, %s::boolean)
        """

        try:
            await operations.execute(
                query,
                (comment_id, user_info['user_id'], post_id, 'TREE', comment_body.content, True),
                fetch=False
            )
        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))
        
        return JSONResponse(status_code=200, content='Reply created!')
