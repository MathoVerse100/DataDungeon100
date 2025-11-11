from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

import httpx
import os

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/logout/', response_class=HTMLResponse, name='logout')
    async def logout(request: Request):
        if not request.session.get('logged'):
            return RedirectResponse(url='/login', status_code=303)

        session_user_data = request.session.pop('session_user_data')
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/auth/logout",
                params={'session_token': session_user_data['session_token']}
            )

        request.session['logged'] = False
        return RedirectResponse(url='/login', status_code=303)


    app.include_router(router)