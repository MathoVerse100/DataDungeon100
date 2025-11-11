from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/explore/', response_class=HTMLResponse, name='explore')
    async def explore(request: Request):
        return templates.TemplateResponse(
            "pages/explore/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'explore'},
        )


    app.include_router(router)
