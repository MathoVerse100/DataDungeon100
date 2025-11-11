from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/communities/analytics/post_id', response_class=HTMLResponse)
    async def communities(request: Request):
        logged = bool(request.session.get('logged', None))

        return templates.TemplateResponse(
            "pages/communities/[community]/[post_id]/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'communities', 'logged': logged},
        )


    app.include_router(router)