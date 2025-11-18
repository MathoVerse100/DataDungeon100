from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.encoders import jsonable_encoder

from initialize_dbs import operations, redis_db0


def generator(app: FastAPI):

    @app.get('/api/auth/verify_registration')
    async def api_auth_verify_registration(request: Request):
        ...