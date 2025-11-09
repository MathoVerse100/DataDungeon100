from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
import os


def configure_middlewares(app: FastAPI):
    app.add_middleware(
        SessionMiddleware,
        secret_key=os.getenv('SESSION_COOKIE_MIDDLEWARE_KEY'),
        session_cookie='session',
        max_age=604800,
        same_site="lax",
        https_only=True,  
    )    
