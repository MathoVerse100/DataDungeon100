from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
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
    
    @router.get('/communities/custom/{community_id}')
    async def community_id(request: Request, community_id: str):
        if not request.session.get('logged'):
            return RedirectResponse(url='/login', status_code=303)

        return templates.TemplateResponse(
            "pages/communities/[community]/_page.html",
            {"request": request, "outer_sidebar_button_clicked": 'communities'},
        )

    app.include_router(router)