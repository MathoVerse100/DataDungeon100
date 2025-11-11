from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/settings/', response_class=HTMLResponse, name='settings')
    async def settings(request: Request, logged: bool = Depends(verify_session_token)):
        return templates.TemplateResponse(
            "pages/settings/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'settings'},
        )


    app.include_router(router)
