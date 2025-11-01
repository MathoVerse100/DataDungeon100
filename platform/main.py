from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import uuid

def generate_uuid():
    return 'a' + str(uuid.uuid4())

app = FastAPI()
app.mount(
    '/static',
    StaticFiles(directory='static'),
    name='static',
)
app.mount(
    '/assets',
    StaticFiles(directory='assets'),
    name='assets',
)

templates = Jinja2Templates(
    directory='templates',
)

templates.env.globals.update({
    "generate_uuid": generate_uuid
})


@app.get('/home/', response_class=HTMLResponse, name="home")
async def home(request: Request):
    return templates.TemplateResponse(
        "pages/home/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'home'},
    )

@app.get('/explore/', response_class=HTMLResponse, name='explore')
async def explore(request: Request):
    return templates.TemplateResponse(
        "pages/explore/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'explore'},
    )

@app.get('/monk/', response_class=HTMLResponse, name='monk')
async def monk(request: Request):
    return templates.TemplateResponse(
        "pages/monk/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'monk'},
    )

@app.get('/library/', response_class=HTMLResponse, name='library')
async def library(request: Request):
    return templates.TemplateResponse(
        "pages/library/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'library'},
    )


@app.get('/communities/analytics/', response_class=HTMLResponse, name='communities')
async def communities(request: Request):
    return templates.TemplateResponse(
        "pages/communities/[community]/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'communities'},
    )

@app.get('/university/', response_class=HTMLResponse, name='university')
async def university(request: Request):
    return templates.TemplateResponse(
        "pages/university/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'university'},
    )

@app.get('/projects/', response_class=HTMLResponse, name='projects')
async def projects(request: Request):
    return templates.TemplateResponse(
        "pages/projects/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'projects'},
    )

@app.get('/storage/', response_class=HTMLResponse, name='storage')
async def storage(request: Request):
    return templates.TemplateResponse(
        "pages/storage/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'storage'},
    )

@app.get('/study_zone/', response_class=HTMLResponse, name='study_zone')
async def study_zone(request: Request):
    return templates.TemplateResponse(
        "pages/study_zone/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'study zone'},
    )

@app.get('/history/', response_class=HTMLResponse, name='history')
async def history(request: Request):
    return templates.TemplateResponse(
        "pages/history/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'history'},
    )

@app.get('/help/', response_class=HTMLResponse, name='help')
async def help(request: Request):
    return templates.TemplateResponse(
        "pages/help/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'help'},
    )

@app.get('/settings/', response_class=HTMLResponse, name='settings')
async def settings(request: Request):
    return templates.TemplateResponse(
        "pages/settings/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'settings'},
    )

@app.get('/tos/', response_class=HTMLResponse, name='tos')
async def settings(request: Request):
    return templates.TemplateResponse(
        "pages/tos/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'tos'},
    )
