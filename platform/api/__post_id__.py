from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, field_validator
from pydantic.types import StringConstraints
from typing import Annotated
import secrets
import json
import os
from datetime import datetime, timezone

from initialize_dbs import operations, redis_db0
from lib.parse_comment_tree import parse_comment_tree


def generator(app: FastAPI) -> None:

    @app.get('/api/communities/posts/{community_title}/{post_id}')
    async def community_post(community_title: str, post_id: int) -> Response:
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
                C.TITLE AS COMMUNITY_TITLE,
                A.USER_ID,
                B.USERNAME,
                B.FIRST_NAME,
                B.LAST_NAME,
                A.TAGS,
                A.TITLE,
                A.CONTENT,
                A.LIKES,
                A.DISLIKES,
                A.ALLOW_COMMENTS,
                A.CREATED_AT,
                A.UPDATED_AT
            FROM COMMUNITY_POST_INFO A
            JOIN USER_AUTH B
            ON A.USER_ID = B.ID
            JOIN COMMUNITY_INFO C
            ON A.COMMUNITY_ID = C.ID
            WHERE LOWER(C.TITLE) = %s::text
            AND A.ID = %s::integer
        """

        results = await operations.execute(
            query,
            (community_title, post_id),
        )

        return JSONResponse(status_code=200, content=jsonable_encoder(results[0]))
    

    @app.get('/api/communities/posts/{community_title}/{post_id}/comments')
    async def community_post_comments(community_title: str, post_id: int) -> Response:
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
    
        query = f"""
            SELECT
                A.ID,
                C.TITLE AS COMMUNITY_TITLE,
                B.USER_ID,
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
                '{{}}'::INTEGER[] AS REPLIES
            FROM COMMUNITY_COMMENT_INFO A
            JOIN COMMUNITY_POST_INFO B
            ON A.POST_ID = B.ID
            JOIN COMMUNITY_INFO C
            ON B.COMMUNITY_ID = C.ID
            JOIN USER_AUTH D
            ON B.USER_ID = D.ID
            WHERE 1=1
            AND LOWER(C.TITLE) = %s::text
            AND A.POST_ID = %s::integer
            ORDER BY CREATED_AT
        """

        results = await operations.execute(
            query,
            (community_title, post_id)
        )

        if not results:
            return JSONResponse(status_code=200, content=results)

        tree = parse_comment_tree(results)
        return JSONResponse(status_code=200, content=jsonable_encoder(tree))
        
