from fastapi import FastAPI, Request, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

from initialize_dbs import operations
from api.__dependencies__.auth import login_required
from api.__dependencies__.communities import check_community_exists


def generator(app: FastAPI):

    @app.get('/api/communities/{community_title}/join', dependencies=[Depends(login_required)])
    async def api_communities_join(
        request: Request,
        community_title: str,
        community_id: int = Depends(check_community_exists)
    ) -> Response:
        user_session_data: dict = request.session.get('user_session_data', None)
        user_info: dict = user_session_data.get('user_info', None)

        if (
            await operations.execute(
                """
                    SELECT USER_ID
                    FROM USER_COMMUNITY
                    WHERE USER_ID = %s::integer
                    AND COMMUNITY_ID = %s::integer
                """,
                (user_info.get('user_id', None), community_id)
            )
        ):
            return JSONResponse(status_code=200, content=True)

        return JSONResponse(status_code=200, content=False) 


    @app.post('/api/communities/{community_title}/join', dependencies=[Depends(login_required)])
    async def api_communities_join(
        request: Request,
        community_title: str,
        community_id: int = Depends(check_community_exists)
    ):
        user_session_data: dict = request.session.get('user_session_data', None)
        user_info: dict = user_session_data.get('user_info', None)

        query = None
        parameters = (user_info.get('user_id', None), community_id)
        user_is_joined = await operations.execute(
            """
                SELECT USER_ID
                FROM USER_COMMUNITY
                WHERE USER_ID = %s::integer
                AND COMMUNITY_ID = %s::integer
            """,
            parameters
        )

        if user_is_joined:
            query = f"""
                DELETE FROM USER_COMMUNITY
                WHERE USER_ID = %s::integer
                AND COMMUNITY_ID = %s::integer
            """
        else:
            query = f"""
                WITH

                CIVILIAN_ROLE_ID AS (
                    SELECT ID AS ROLE_ID
                    FROM COMMUNITY_ROLES
                    WHERE ROLE_NAME = 'civilian'
                )

                INSERT INTO USER_COMMUNITY (USER_ID, COMMUNITY_ID, ROLE_ID)
                SELECT %s::integer, %s::integer, ROLE_ID
                FROM CIVILIAN_ROLE_ID;
            """

        try:
            await operations.execute(
                query,
                parameters,
                fetch=False
            )
        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))

        return JSONResponse(status_code=200, content=f"User has {'left' if user_is_joined else 'joined'} {community_title}!")
