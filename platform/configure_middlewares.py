from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
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

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://platform:8000",
            "http://spa:5173",
            "http://localhost:5173",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
