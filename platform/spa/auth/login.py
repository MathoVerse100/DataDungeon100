from fastapi import FastAPI, APIRouter, Request, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.templating import Jinja2Templates

import json
import httpx
import os

from spa.dependencies import verify_session_token
from lib.snakecase_camelcase import camelcase_to_snakecase


def generator(app: FastAPI):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/spa/login/')
    async def login(request: Request) -> Response:
        verify_message = request.session.pop('verify_message', None)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/auth/verify-session-token",
                params={"token": request.session.get('session_user_data').get('session_token')}
            )

        print(f"STATE OF TOKEN: {response.json()}")
        if response.json():
            request.session['logged'] = True
            raise HTTPException(status_code=409, detail='User already logged in')

        request.session['logged'] = False
        return JSONResponse(status_code=200, content={'verify_message': verify_message})


    @router.post('/spa/login/')
    async def login(request: Request) -> Response:
        form_data = await request.json()
        form_data = {camelcase_to_snakecase(key): form_data[key] for key in form_data.keys()}
        
        print(form_data)

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/auth/login",
                json=form_data
            )

        if response.status_code != 200:
            error = response.json()['detail']

            raise HTTPException(status_code=401, detail=error)

        print(response.json())
        response_content = json.loads(response.content)
        request.session['session_user_data'] = dict({"session_token": response_content['details']['session_token']}, **response_content['details']['user_info'])
        request.session['logged'] = True

        return JSONResponse(status_code=200, content='Login Successful!')


    app.include_router(router)