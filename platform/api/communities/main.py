from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.encoders import jsonable_encoder

from initialize_dbs import operations


def generator(app: FastAPI):

    @app.get('/api/communities/{community_title}/main')
    async def api_communities_main(community_title: str):
        if not (
            await operations.execute(
                """SELECT TITLE FROM COMMUNITY_INFO WHERE LOWER(TITLE) = %s::text""",
                (community_title,)
            )
        ):
            raise HTTPException(status_code=404, detail='Community not found')

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