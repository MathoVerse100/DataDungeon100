from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

import json
import httpx
import os

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/login/', response_class=HTMLResponse, name='login')
    async def login(request: Request):
        if request.session.get('logged'):
            return RedirectResponse(url='/explore', status_code=303)

        verify_message = request.session.pop("verify_message", None)

        return templates.TemplateResponse(
            "pages/login/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'login', 'verify_message': verify_message, 'login_or_register': 'login'},
        )


    @router.post('/login/', name='login')
    async def login(request: Request):
        form_data = await request.form()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/auth/login",
                json=dict(form_data)
            )

        if response.status_code != 200:
            error = response.json()['detail']

            return templates.TemplateResponse(
                "pages/login/page.html",
                {"request": request, "outer_sidebar_button_clicked": 'login', "login_error": error},
                status_code=400
            )

        response_content = json.loads(response.content)
        request.session['session_user_data'] = dict({"session_token": response_content['details']['session_token']}, **response_content['details']['user_info'])
        request.session['logged'] = True

        return RedirectResponse(url='/home', status_code=303)


    app.include_router(router)