from fastapi import FastAPI, APIRouter, Request, Response, HTTPException, Depends
from fastapi.responses import JSONResponse

import httpx
import os

from spa.dependencies import verify_session_token


def generator(app: FastAPI):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/spa/verify-registration/')
    async def verify_registration(request: Request, token: str) -> Response:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/auth/verify-registration",
                params={'token': token}
            )

        if response.status_code == 404:
            raise HTTPException(status_code=404, detail=response.content)

        return JSONResponse(status_code=200, content='OK!')


    app.include_router(router)
