from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

import httpx
import os

from routers.dependencies import verify_session_token


def generator(app: FastAPI, templates: Jinja2Templates | None = None):

    router = APIRouter(prefix='', dependencies=[Depends(verify_session_token)])


    @router.get('/verify-registration/', response_class=HTMLResponse, name='verify-registration')
    async def verify_registration(request: Request, token: str):
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{os.getenv('PLATFORM_DOMAIN_NAME')}/api/auth/verify-registration",
                params={'token': token}
            )

        if response.status_code == 404:
            raise HTTPException(status_code=404)

        return templates.TemplateResponse(
            "pages/verify_registration/page.html",
            {"request": request},
    )


    app.include_router(router)
