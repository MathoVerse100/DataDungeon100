from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/find_people/', response_class=HTMLResponse, name='find_people')
    async def find_people(request: Request):
        return templates.TemplateResponse(
            "pages/explore/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'Find People', 'logged': bool(request.session.get('logged'))},
        )


    app.include_router(router)
