from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator
from pydantic.types import StringConstraints
from typing import Annotated
import secrets
import json
import os
from datetime import datetime, timezone

from lib.email_utils import is_email, normalize_email, send_email, email_verification_html_body
from lib.password_utils import hash_password, check_password
from initialize_dbs import operations, redis_db0


def generator(app: FastAPI) -> None:

    @app.post('/api/auth/logout')
    async def logout(session_token: str) -> Response:
        session = await redis_db0.get(f'session_tokens:{session_token}')
        if not session:
            raise HTTPException(status_code=404, detail='User is not logged in')

        await redis_db0.get(f'session_tokens:{session_token}')
        return JSONResponse(status_code=200, content='User successfully logged out!')
