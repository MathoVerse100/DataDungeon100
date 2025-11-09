from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

def generator(app: FastAPI, templates: Jinja2Templates):

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