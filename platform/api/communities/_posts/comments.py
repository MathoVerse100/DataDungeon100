from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, StringConstraints, field_validator
from typing import Annotated

from initialize_dbs import operations
from lib.parse_comment_tree import parse_comment_tree
from api.__dependencies__.auth import login_required


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

    @app.get('/api/communities/{community_title}/posts/{post_id}/comments')
    async def api_communities_posts_comments(
        community_title: str,
        post_id: int,
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
                A.IS_ROOT,
                '{{}}'::INTEGER[] AS REPLIES
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
            ORDER BY ID
        """

        results = await operations.execute(
            query,
            (community_title, post_id,)
        )

        tree = parse_comment_tree(results)
        filtered_tree = sorted(tree, key=lambda root: root[filter], reverse=(True if sort == 'desc' else False))
        if offset > len(filtered_tree) - 1:
            filtered_tree = []
        else:
            filtered_tree = filtered_tree[offset:]
        
        if limit <= len(filtered_tree) - 1:
            filtered_tree = filtered_tree[:limit]

        return JSONResponse(status_code=200, content=jsonable_encoder(filtered_tree))
    

    @app.post('/api/communities/{community_title}/posts/{post_id}/comments', dependencies=[Depends(login_required)])
    async def api_communities_posts_comments(request: Request, community_title: str, post_id: int, comment_body : CommentBody):
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
        
        user_session_data: dict = request.session.get('user_session_data', None)
        user_info: dict = user_session_data.get('user_info', None)

        query = f"""
            INSERT INTO COMMUNITY_COMMENT_INFO (USER_ID, POST_ID, COMMENT_TYPE, CONTENT, IS_ROOT)
            VALUES (%s::integer, %s::integer, %s::text, %s::text, %s::boolean)
        """

        try:
            await operations.execute(
                query,
                (user_info['user_id'], post_id, 'TREE', comment_body.content, True),
                fetch=False
            )
        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))
        
        return JSONResponse(status_code=200, content='Comment created!')
