from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/monk/', response_class=HTMLResponse, name='monk')
    async def monk(request: Request):
        return templates.TemplateResponse(
            "pages/monk/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'monk'},
        )


    app.include_router(router)
