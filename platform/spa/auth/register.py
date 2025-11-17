from fastapi import FastAPI, APIRouter, Request, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

import httpx
import os

from lib.snakecase_camelcase import camelcase_to_snakecase
from spa.dependencies import verify_session_token


def generator(app: FastAPI):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/spa/register/')
    async def register(request: Request) -> Response:
        if request.session.get('logged'):
            raise HTTPException(status_code=409, detail='User already logged in')

        return JSONResponse(status_code=200, content='OK!')


    @router.post('/spa/register/')
    async def register(request: Request) -> Response:
        form_data = await request.json()
        form_data = {camelcase_to_snakecase(key): form_data[key] for key in form_data.keys()}
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/auth/register",
                json=dict(form_data)
            )

        response_json = response.json()        
        if response.status_code != 200:

            if isinstance(response_json['detail'], list):
                errors = {}

                for error in response_json['detail']:
                    errors[f'{error['loc'][1]}_error'] = 'Invalid'

                raise HTTPException(status_code=400, detail=errors)

            raise HTTPException(status_code=409, detail=response_json['detail']) 

        request.session['verify_message'] = 'Thank you for registering! Please verify your email to login.'

        return JSONResponse(status_code=200, content='Registration Request Sucessfully Received!')
    

    app.include_router(router)