from fastapi import FastAPI, Request, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from pydantic import BaseModel, conlist
from typing import Annotated

from initialize_dbs import operations
from api.__dependencies__.auth import login_required


class CommunityBody(BaseModel):
    title: str
    subtitle: str
    description: str
    tags: Annotated[
        list[str],
        conlist(str, min_length=1)
    ]


def generator(app: FastAPI):

    @app.post('/api/communities/create', dependencies=[Depends(login_required)])
    async def api_communities_create(request: Request, community_body: CommunityBody) -> Response:
        user_session_data: dict = request.session.get('user_session_data')
        user_info: dict = user_session_data.get('user_info', None)

        query = f"""
            WITH

            INSERT_COMMUNITY_POST AS (
                INSERT INTO COMMUNITY_INFO (OWNER_ID, TITLE, SUBTITLE, DESCRIPTION)
                VALUES (%s::integer, %s::text, %s::text, %s::text)
                RETURNING ID
            ),

            ADMIN_ROLE_ID AS (
                SELECT ID AS ROLE_ID
                FROM COMMUNITY_ROLES
                WHERE ROLE_NAME = 'admin'
            ),

            INSERT_COMMUNITY_TAGS AS (
                INSERT INTO COMMUNITY_TAGS (COMMUNITY_ID, TAG_NAME)
                SELECT INSERT_COMMUNITY_POST.ID, TAG
                FROM INSERT_COMMUNITY_POST,
                UNNEST(%s::text[]) AS TAG
            )

            INSERT INTO USER_COMMUNITY (COMMUNITY_ID, USER_ID, ROLE_ID)
            SELECT INSERT_COMMUNITY_POST.ID, %s::integer, ADMIN_ROLE_ID.ROLE_ID
            FROM INSERT_COMMUNITY_POST, ADMIN_ROLE_ID;
        """

        try:
            await operations.execute(
                query,
                (
                    user_info.get('user_id', None), community_body.title, community_body.subtitle, community_body.description,
                    community_body.tags,
                    user_info.get('user_id', None)
                ),
                fetch=False
            )
        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))

        return JSONResponse(status_code=200, content='OK!')
