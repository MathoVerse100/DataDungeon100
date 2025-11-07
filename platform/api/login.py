from fastapi import FastAPI, Response, Request
from pydantic import BaseModel


def generator(app: FastAPI) -> None:

    @app.post('/api/login')
    async def login(request: Request):
        
        ...
