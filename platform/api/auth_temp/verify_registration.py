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

    @app.get('/api/auth/verify-registration')
    async def verify_email(token: str) -> Response:
        user = await redis_db0.get(f"register_verification_tokens:{token}")
        if not user:
            raise HTTPException(
                status_code=404,
                detail="Invalid or expired verification token."
            )
        
        await redis_db0.delete(f"register_verification_tokens:{token}")
        user_dict = json.loads(user.decode('utf-8'))

        await redis_db0.delete(f"register_awaiting_verification:{user_dict['username']}")
        await redis_db0.delete(f"register_awaiting_verification:{user_dict['email']}")
        await redis_db0.delete(f"register_awaiting_verification:{user_dict['first_name']}-{user_dict['last_name']}")

        query = f"""
            INSERT INTO USER_AUTH (
                FIRST_NAME, LAST_NAME, USERNAME,
                EMAIL, PASSWORD
            )
            VALUES (%s, %s, %s, %s, %s)
        """

        await operations.execute(
            query,
            (
                user_dict['first_name'], user_dict['last_name'],
                user_dict['username'], user_dict['email'],
                user_dict['password']             
            ),
            fetch=False
        )

        data = {"message": "Successfully Registered!"}
        return JSONResponse(content=data, status_code=200)