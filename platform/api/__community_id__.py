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


def generator(app: FastAPI) -> None:

    @app.get('/api/communities/main/{community_title}')
    async def community_info(community_title: str) -> Response:
        query = """
            SELECT
                A.ID,
                A.OWNER_ID,
                B.USERNAME,
                A.TITLE,
                A.SUBTITLE,
                A.DESCRIPTION,
                A.BANNER_URL,
                A.ICON_URL,
                A.CREATED_AT,
                A.LAST_UPDATED_AT
            FROM COMMUNITY_INFO A
            JOIN USER_AUTH B
            ON A.OWNER_ID = B.ID
            WHERE LOWER(A.TITLE) = %s::text
        """

        result = await operations.execute(
            query,
            (community_title,)
        )

        if not result:
            raise HTTPException(status_code=404, detail='Community Not Found')

        return JSONResponse(
            status_code=200,
            content=jsonable_encoder(result[0])
        )


    @app.get('/api/communities/posts/{community_title}')
    async def community_posts(community_title: str) -> Response:
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
        """

        results = await operations.execute(
            query,
            (community_title,),
        )

        return JSONResponse(status_code=200, content=jsonable_encoder(results))