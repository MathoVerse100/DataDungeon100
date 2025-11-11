from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/profile/', response_class=HTMLResponse, name='profile')
    async def profile(request: Request, logged: bool = Depends(verify_session_token)):
        if not request.session.get('logged'):
            return RedirectResponse(url='/login', status_code=303)

        return templates.TemplateResponse(
            "pages/explore/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'profile', 'logged': request.session.get('logged')},
        )


    app.include_router(router)
