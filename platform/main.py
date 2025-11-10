import uvicorn

from fastapi import FastAPI, Request, Depends, APIRouter
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from configure_templates import configure_templates
from configure_middlewares import configure_middlewares
from api.endpoints import paths as api_paths
from routers.dependencies import verify_session_token

app = FastAPI()

# Static Configuration
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

# Jinja Configuration
templates = Jinja2Templates(
    directory='templates',
)
configure_templates(app, templates)

app.add_event_handler
# API Configuration
for api_path in api_paths:
    api_path(app)


# Middleware Configuration
configure_middlewares(app)

# Template Rendering Configuration
@app.get('/home/', response_class=HTMLResponse, name="home")
async def home(request: Request):
    return templates.TemplateResponse(
        "pages/home/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'home'},
    )

@app.get('/explore/', response_class=HTMLResponse, name='explore')
async def explore(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/explore/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'explore'},
    )

@app.get('/profile/', response_class=HTMLResponse, name='profile')
async def explore(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/explore/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'profile', 'logged': request.session.get('logged')},
    )

@app.get('/monk/', response_class=HTMLResponse, name='monk')
async def monk(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/monk/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'monk'},
    )

@app.get('/library/', response_class=HTMLResponse, name='library')
async def library(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/library/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'library'},
    )


@app.get('/communities/analytics/', response_class=HTMLResponse, name='communities')
async def communities(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/communities/[community]/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'communities'},
    )


@app.get('/communities/analytics/post_id', response_class=HTMLResponse)
async def communities(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/communities/[community]/[post_id]/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'communities'},
    )

@app.get('/communities/analytics/post_id/comments/comment_id/thread/{page_number}', response_class=HTMLResponse)
async def communities(request: Request, page_number: int, logged: bool = Depends(verify_session_token)):    
    return templates.TemplateResponse(
        "pages/communities/[community]/[post_id]/comments/[comment_id]/thread/[page_number]/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'communities'},
    )


@app.get('/university/', response_class=HTMLResponse, name='university')
async def university(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/university/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'university', 'logged': logged},
    )

@app.get('/projects/', response_class=HTMLResponse, name='projects')
async def projects(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/projects/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'projects'},
    )

@app.get('/storage/', response_class=HTMLResponse, name='storage')
async def storage(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/storage/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'storage'},
    )

@app.get('/study_zone/', response_class=HTMLResponse, name='study_zone')
async def study_zone(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/study_zone/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'study zone'},
    )

@app.get('/history/', response_class=HTMLResponse, name='history')
async def history(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/history/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'history'},
    )

@app.get('/help/', response_class=HTMLResponse, name='help')
async def help(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/help/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'help'},
    )

@app.get('/settings/', response_class=HTMLResponse, name='settings')
async def settings(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/settings/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'settings'},
    )

@app.get('/tos/', response_class=HTMLResponse, name='tos')
async def settings(request: Request, logged: bool = Depends(verify_session_token)):
    return templates.TemplateResponse(
        "pages/tos/page.html",
        {"request": request, "outer_sidebar_button_clicked": 'tos'},
    )

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)
