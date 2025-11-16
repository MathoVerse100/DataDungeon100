from fastapi import FastAPI, Request, Response
from fastapi.exceptions import HTTPException
import httpx
import os


def generator(app: FastAPI):

    @app.get('/spa/communities/posts/{community_title}')
    async def community_info(request: Request, community_title: str) -> Response:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/posts/{community_title}'
            )

        response_json = response.json()
        if response.status_code != 200:
            raise HTTPException(**response_json)
        
        return response_json

    @app.get('/spa/communities/posts/{community_title}/{post_id}')
    async def community_post(community_title: str, post_id: int) -> Response:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/posts/{community_title}/{post_id}'
            )
        
        response_json = response.json()
        if response.status_code != 200:
            raise HTTPException(**response_json)
        
        return response_json


    @app.get('/spa/communities/posts/{community_title}/{post_id}/comments')
    async def community_post_comments(request: Request, community_title: str, post_id: int) -> Response:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/posts/{community_title}/{post_id}/comments'
            )

        response_json = response.json()
        if response.status_code != 200:
            raise HTTPException(**response_json)
        
        print(response_json[0]['created_at'])
        
        return response_json
    
    @app.get('/spa/communities/posts/{community_title}/{post_id}/comments/{comment_id}')
    async def community_post_comments(request: Request, community_title: str, post_id: int, comment_id: int) -> Response:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/posts/{community_title}/{post_id}/comments/{comment_id}'
            )

        response_json = response.json()
        if response.status_code != 200:
            raise HTTPException(**response_json)
        
        print(response_json[0]['created_at'])
        
        return response_json
