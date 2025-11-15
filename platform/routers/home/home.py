from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/home/', response_class=HTMLResponse, name="home")
    async def home(request: Request):
        return templates.TemplateResponse(
            "pages/home/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'home', 'logged': bool(request.session.get('logged'))},
        )


    app.include_router(router)
