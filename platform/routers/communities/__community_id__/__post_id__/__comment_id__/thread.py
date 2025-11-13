from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/communities/{community_title}/post_id/comments/comment_id/thread/{page_number}', response_class=HTMLResponse)
    async def communities(request: Request, community_title: str, page_number: int):
        return templates.TemplateResponse(
            "pages/communities/[community]/[post_id]/comments/[comment_id]/thread/[page_number]/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'communities'},
        )


    app.include_router(router)
