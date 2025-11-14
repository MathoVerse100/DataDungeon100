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

    @app.get('/api/auth/verify-session-token')
    async def verify_session_token(token: str) -> bool:
        value = await redis_db0.get(f"session_tokens:{token}")

        return not not value
