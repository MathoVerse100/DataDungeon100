from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

import httpx


def generator(app: FastAPI, templates: Jinja2Templates):

    @app.post('/login/', response_class=HTMLResponse, name='login')
    async def login(request: Request):
        form_data = await request.form()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://platform:8000/api/auth/login",
                json=dict(form_data)
            )

        if response.status_code != 200:
            error = response.json()['detail']

            return templates.TemplateResponse(
                "pages/login/page.html",
                {"request": request, "outer_sidebar_button_clicked": 'login', "login_error": error},
                status_code=400
            )

        return RedirectResponse(url='/home', status_code=303)

    @app.post('/register/', name='register')
    async def register(request: Request):
        form_data = await request.form()
        print(form_data)
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://platform:8000/api/auth/register",
                json=dict(form_data)
            )
        
        if response.status_code != 200:
            response_json = response.json()

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

        return RedirectResponse(url='/login', status_code=303)


    @app.get('/login/', response_class=HTMLResponse, name='login')
    async def login(request: Request):
        return templates.TemplateResponse(
            "pages/login/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'login'},
        )

    @app.get('/register/', response_class=HTMLResponse, name='register')
    async def register(request: Request):
        return templates.TemplateResponse(
            "pages/register/page.html",
            {"request": request, "outer_sidebar_button_clicked": 'login'},
    )

    ...