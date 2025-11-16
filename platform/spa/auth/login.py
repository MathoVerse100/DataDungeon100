from fastapi import FastAPI, APIRouter, Request, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.templating import Jinja2Templates

import json
import httpx
import os

from spa.dependencies import verify_session_token


def generator(app: FastAPI):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/spa/login/')
    async def login(request: Request) -> Response:
        if request.session.get('logged'):
            raise HTTPException(status_code=409, detail='User already logged in')

        return JSONResponse(status_code=200, content='OK!')


    @router.post('/spa/login/')
    async def login(request: Request) -> Response:
        form_data = await request.form()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/auth/login",
                json=dict(form_data)
            )

        if response.status_code != 200:
            error = response.json()['detail']

            raise HTTPException(status_code=401, detail=error)


        response_content = json.loads(response.content)
        request.session['session_user_data'] = dict({"session_token": response_content['details']['session_token']}, **response_content['details']['user_info'])
        request.session['logged'] = True

        return JSONResponse(status_code=200, content='Login Successful!')


    app.include_router(router)