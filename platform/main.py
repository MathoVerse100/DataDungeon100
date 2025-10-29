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
        {"request": request},
    )

@app.get('/explore/', response_class=HTMLResponse, name='explore')
async def explore(request: Request):
    return templates.TemplateResponse(
        "pages/explore/page.html",
        {"request": request},
    )

@app.get('/monk/', name='monk')
async def monk():
    return {"message": "Hello, MONK!"}

@app.get('/communities/', response_class=HTMLResponse, name='communities')
async def communities(request: Request):
    return templates.TemplateResponse(
        "pages/communities/page.html",
        {"request": request},
    )

@app.get('/library/', name='library')
async def library():
    return {"message": "Hello, LIBRARY!"}