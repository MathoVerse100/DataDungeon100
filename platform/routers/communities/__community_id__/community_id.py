from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/communities/analytics/', response_class=HTMLResponse, name='communities')
    async def communities(request: Request, logged: bool = Depends(verify_session_token)):
        return templates.TemplateResponse(
            "pages/communities/[community]/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'communities'},
        )
    
    @router.get('/communities/analytics/{community_id}')
    async def community_id(community_id: str):
        ...


    app.include_router(router)