from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates

from routers.dependencies import verify_session_token
import httpx
import os


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])

    @router.get('/communities/{community_title}/{post_id}', response_class=HTMLResponse)
    async def communities(request: Request, community_title: str, post_id: int):
        logged = request.session.get('logged')

        async with httpx.AsyncClient() as client:
            community_info_response = await client.get(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/main/{community_title}",
            )

        community_info_response_json = community_info_response.json()

        if community_info_response.status_code != 200:

            return community_info_response_json


        async with httpx.AsyncClient() as client:
            community_post_response = await client.get(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/posts/{community_title}/{post_id}"
            )

        community_post_response_json = community_post_response.json()

        if community_post_response.status_code != 200:
            return community_post_response_json

        async with httpx.AsyncClient() as client:
            community_post_comment_response = await client.get(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/posts/{community_title}/{post_id}/comments"
            )

        community_post_comment_response_json = community_post_comment_response.json()

        if community_post_comment_response.status_code != 200:
            return community_post_comment_response_json


        return templates.TemplateResponse(
            "pages/communities/[community]/[post_id]/page.html",
            {
                "request": request,
                "outer_sidebar_button_clicked": 'communities',
                "community_info": community_info_response_json,
                "community_post": community_post_response_json,
                "community_comments": community_post_comment_response_json,
                'logged': logged
            },
        )

    @router.get('/communities/{community_title}/{post_id}/{comment_id}', response_class=HTMLResponse)
    async def communities(request: Request, community_title: str, post_id: int, comment_id: int):
        logged = request.session.get('logged')

        async with httpx.AsyncClient() as client:
            community_info_response = await client.get(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/main/{community_title}",
            )

        community_info_response_json = community_info_response.json()

        if community_info_response.status_code != 200:

            return community_info_response_json


        async with httpx.AsyncClient() as client:
            community_post_response = await client.get(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/posts/{community_title}/{post_id}"
            )

        community_post_response_json = community_post_response.json()

        if community_post_response.status_code != 200:
            return community_post_response_json
        
        async with httpx.AsyncClient() as client:
            community_post_comment_response = await client.get(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/communities/posts/{community_title}/{post_id}/comments/{comment_id}"
            )

        community_post_comment_response_json = community_post_comment_response.json()

        if community_post_comment_response.status_code != 200:
            return community_post_comment_response_json


        return templates.TemplateResponse(
            "pages/communities/[community]/[post_id]/page.html",
            {
                "request": request,
                "outer_sidebar_button_clicked": 'communities',
                "community_info": community_info_response_json,
                "community_post": community_post_response_json,
                "community_comments": community_post_comment_response_json,
                'logged': logged
            },
        )

    app.include_router(router)