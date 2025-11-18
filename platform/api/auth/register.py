from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.encoders import jsonable_encoder

from initialize_dbs import operations, redis_db0


def generator(app: FastAPI):

    @app.get('/api/auth/register')
    async def register(request: Request):
        ...


    @app.post('/api/auth/register')
    async def register():
        ...