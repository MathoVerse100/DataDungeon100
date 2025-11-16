from fastapi import FastAPI, Request, Response
from fastapi.exceptions import HTTPException
import httpx
import os


def generator(app: FastAPI):

    @app.get('/spa/communities/main/{community_title}')
    async def community_info(request: Request, community_title: str) -> Response:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/main/{community_title}'
            )
        
        response_json = response.json()
        if response.status_code != 200:
            raise HTTPException(**response_json)
        
        return response_json
