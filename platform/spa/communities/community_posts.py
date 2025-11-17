from fastapi import FastAPI, Request, Response
from fastapi.exceptions import HTTPException
from pydantic import BaseModel
import httpx
import os


class Comment(BaseModel):
    comment: str

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

    @app.post('/spa/communities/posts/{community_title}/{post_id}/comments')
    async def community_post_comments(request: Request, comment: Comment, community_title: str, post_id: int) -> Response:
        session_user_data = request.session.get('session_user_data', None)
        if not session_user_data:
            raise HTTPException(status_code=401, detail="Unauthorized: User is not logged in")

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f'{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/posts/{community_title}/{post_id}/comments',
                json={'session_token': session_user_data.get('session_token', None), 'content': comment.comment}
            )

        response_json = response.json()
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response_json)

        return response_json
    

    @app.get('/spa/communities/posts/{community_title}/{post_id}/comments')
    async def community_post_comments(request: Request, community_title: str, post_id: int) -> Response:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/posts/{community_title}/{post_id}/comments'
            )

        response_json = response.json()
        return response_json
    
    @app.get('/spa/communities/posts/{community_title}/{post_id}/comments/{comment_id}')
    async def community_post_comments(request: Request, community_title: str, post_id: int, comment_id: int) -> Response:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/posts/{community_title}/{post_id}/comments/{comment_id}'
            )

        response_json = response.json()        
        return response_json
