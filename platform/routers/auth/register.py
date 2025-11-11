from fastapi import FastAPI, APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

import httpx
import os

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/register/', response_class=HTMLResponse, name='register')
    async def register(request: Request):
        if request.session.get('logged'):
            return RedirectResponse(url='/explore', status_code=303)

        return templates.TemplateResponse(
            "pages/register/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'register', 'login_or_register': 'register'},
    )


    @router.post('/register/', name='register')
    async def register(request: Request):
        form_data = await request.form()
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/auth/register",
                json=dict(form_data)
            )

        response_json = response.json()        
        if response.status_code != 200:

            if isinstance(response_json['detail'], list):
                errors = {}

                for error in response_json['detail']:
                    errors[f'{error['loc'][1]}_error'] = 'Invalid'
                
                return templates.TemplateResponse(
                    "pages/register/page.html",
                    dict({"request": request, "outer_sidebar_button_clicked": 'login'}, **errors),
                    status_code=400
                )
            
            return templates.TemplateResponse(
                "pages/register/page.html",
                {"request": request, "outer_sidebar_button_clicked": 'login', "register_error": response_json['detail']},
                status_code=400
            )

        request.session['verify_message'] = 'Thank you for registering! Please verify your email to login.'

        return RedirectResponse(url='/login', status_code=303)
    

    app.include_router(router)