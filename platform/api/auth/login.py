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


class UserLoginCredentials(BaseModel):
    username_or_email: str
    password: str



def generator(app: FastAPI) -> None:

    @app.post('/api/auth/login')
    async def login(user_credentials: UserLoginCredentials) -> Response:
        username_or_email = (
            normalize_email(user_credentials.username_or_email) 
            if is_email(user_credentials.username_or_email)
            else user_credentials.username_or_email
        )

        field = "EMAIL" if is_email(username_or_email) else "USERNAME"
        query = f"""
            SELECT ID, FIRST_NAME, LAST_NAME, EMAIL, USERNAME, PASSWORD
            FROM USER_AUTH
            WHERE {field} = %s::text
        """

        user = await operations.execute(query, (username_or_email,))
        if not user or not check_password(user_credentials.password, user[0]['password']):
            raise HTTPException(status_code=401, detail="Invalid username, email or password")

        session_token = secrets.token_urlsafe(32)
        user_info = {
            "user_id": user[0]['id'],
            "first_name": user[0]['first_name'],
            "last_name": user[0]['last_name'],
            "username": user[0]['username'],
            "email": user[0]['email'],
        }

        await redis_db0.set(f"session_tokens:{session_token}", json.dumps(user_info), ex=604800)

        data = {"Message": "Login Successful!", "details": {
            "session_token": session_token,
            "user_info": user_info
        }}

        await operations.execute(f"""
            UPDATE USER_AUTH
            SET LAST_SIGN_IN = %s::timestamp
            WHERE {field} = %s::text
        """, (datetime.now(), username_or_email), fetch=False)

        return JSONResponse(content=data, status_code=200)
