# Imports
import uvicorn

from fastapi import FastAPI, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from configure_templates import configure_templates
from configure_middlewares import configure_middlewares
# from platform.api.endpoints_temp import paths as api_paths
from api.endpoints import paths as api_paths
# from spa.endpoints import paths as spa_paths
# from routers.endpoints import paths as router_paths
# from routers.dependencies import verify_session_token


# Initialize App
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


# API Configuration
for api_path in api_paths:
    api_path(app)

# SPA Client-API Proxy Configuration
# for spa_path in spa_paths:
#     spa_path(app)


# Router Configuration
# for router_path in router_paths:
#     router_path(app, templates)


# Middleware Configuration
configure_middlewares(app)


# Run App
if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)
