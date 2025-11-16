from fastapi import FastAPI, APIRouter, Request, Response, Depends
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse

import httpx
import os

from spa.dependencies import verify_session_token


def generator(app: FastAPI):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/spa/logout/')
    async def logout(request: Request) -> Response:
        if not request.session.get('logged'):
            raise HTTPException(status_code=409, detail="User is not logged in!")


        session_user_data = request.session.pop('session_user_data')
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/auth/logout",
                params={'session_token': session_user_data.get('session_token')}
            )

        request.session['logged'] = False
        return JSONResponse(status=200, content="Successfully logged out!")


    app.include_router(router)