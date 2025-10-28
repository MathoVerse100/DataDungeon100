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


@app.get('/home/', response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "pages/home/page.html",
        {"request": request, "generate_uuid": generate_uuid},
    )