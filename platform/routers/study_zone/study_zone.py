from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/study_zone/', response_class=HTMLResponse, name='study_zone')
    async def study_zone(request: Request):
        return templates.TemplateResponse(
            "pages/study_zone/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'study zone'},
        )


    app.include_router(router)
