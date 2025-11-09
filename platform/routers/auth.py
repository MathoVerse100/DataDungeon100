from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

import json
import httpx
import os

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates):

    @app.post('/login/', name='login')
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

        return RedirectResponse(url='/home', status_code=303)

    @app.post('/register/', name='register')
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


    @app.get('/login/', response_class=HTMLResponse, name='login')
    async def login(request: Request, logged: bool | RedirectResponse = Depends(verify_session_token)):
        if logged:
            return RedirectResponse(url='/explore', status_code=303)

        verify_message = request.session.pop("verify_message", None)

        return templates.TemplateResponse(
            "pages/login/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'login', 'verify_message': verify_message},
        )

    @app.get('/register/', response_class=HTMLResponse, name='register')
    async def register(request: Request):
        return templates.TemplateResponse(
            "pages/register/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'login'},
    )

    @app.get('/verify-registration/', response_class=HTMLResponse, name='verify-registration')
    async def verify_registration(request: Request, token: str):
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/auth/verify-registration",
                params={'token': token}
            )

        if response.status_code == 404:
            raise HTTPException(status_code=404)

        return templates.TemplateResponse(
            "pages/verify_registration/page.html",
            {"request": request},
    )   
