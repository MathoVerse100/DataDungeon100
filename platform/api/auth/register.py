from fastapi import FastAPI, HTTPException, Request, Response, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator
from pydantic.types import StringConstraints
from typing import Annotated
import secrets
import json
import os
from datetime import datetime, timezone

from lib.email_utils import is_email, normalize_email, send_email, email_verification_html_body
from lib.password_utils import hash_password
from initialize_dbs import operations, redis_db0
from api.dependencies import logout_required


class UserRegisterCredentials(BaseModel):
    first_name: Annotated[
        str,
        StringConstraints(min_length=3, max_length=100, pattern=r'^[a-zA-Z0-9_]+$')
    ]
    last_name: Annotated[
        str,
        StringConstraints(min_length=3, max_length=100, pattern=r'^[a-zA-Z0-9_]+$')
    ]
    username: Annotated[
        str,
        StringConstraints(min_length=5, max_length=255, pattern=r'^[a-zA-Z0-9_]+$')
    ]
    email: Annotated[
        str,
        StringConstraints(pattern=r'^\S+@\S+\.\S+$')
    ]
    password: Annotated[
        str,
        StringConstraints(min_length=5, max_length=255)
    ]

    @field_validator("email")
    def validate_email(cls, v):
        if is_email(v):
            return v
        
        raise ValueError("Invalid email")


def generator(app: FastAPI):

    @app.get('/api/auth/register', dependencies=[Depends(logout_required)])
    async def register(request: Request) -> Response:
        return JSONResponse(status_code=200, content='OK!')


    @app.post('/api/auth/register', dependencies=[Depends(logout_required)])
    async def register(request: Request, user_credentials: UserRegisterCredentials) -> Response:

        password = hash_password(user_credentials.password)

        username_exists_query = f"""
            SELECT USERNAME
            FROM USER_AUTH
            WHERE 1=1
            AND USERNAME = %s::text
        """
        email_exists_query = f"""
            SELECT EMAIL
            FROM USER_AUTH
            WHERE 1=1
            AND EMAIL = %s::text
        """
        first_last_names_unique = f"""
            SELECT FIRST_NAME, LAST_NAME
            FROM USER_AUTH
            WHERE 1=1
            AND FIRST_NAME = %s::text
            AND LAST_NAME = %s::text
        """

        check_username = await operations.execute(username_exists_query, (user_credentials.username,))
        check_email = await operations.execute(email_exists_query, (user_credentials.email,))
        check_first_last = await operations.execute(first_last_names_unique, (user_credentials.first_name, user_credentials.last_name))

        if not check_username and not check_first_last:
            if not (
                await redis_db0.get(f"register_awaiting_verification:{user_credentials.username}")
                or await redis_db0.get(f"register_awaiting_verification:{user_credentials.email}")
                or await redis_db0.get(f"register_awaiting_verification:{user_credentials.first_name}-{user_credentials.last_name}")
            ):
                if not check_email:

                    verification_token = secrets.token_urlsafe(32)
                    token_user_info = {
                        "first_name": user_credentials.first_name,
                        "last_name": user_credentials.last_name,
                        "username": user_credentials.username,
                        "email": user_credentials.email,
                        "password": password.decode('utf-8'),
                        "is_active": 'True',
                        "is_banned": 'False',
                        "created_at": datetime.now(timezone.utc).isoformat(),
                        "last_sign_in": None,
                    }
                    await redis_db0.set(f"register_verification_tokens:{verification_token}", json.dumps(token_user_info), ex=900)
                    await redis_db0.set(f"register_awaiting_verification:{user_credentials.username}", 'True', ex=900)
                    await redis_db0.set(f"register_awaiting_verification:{user_credentials.email}", 'True', ex=900)
                    await redis_db0.set(f"register_awaiting_verification:{user_credentials.first_name}-{user_credentials.last_name}", 'True', ex=900)

                    print(f"...... THE TOKEN VALUE IS ......: {verification_token} <------ HERE!!!!!")

                    send_email(
                        title='DataDungeon100: Verify Registration',
                        receivers=[user_credentials.email],
                        content=email_verification_html_body(user_credentials.first_name, f'{os.getenv('PLATFORM_DOMAIN_NAME')}/verify-registration?token={verification_token}')
                    )

            request.session['verify_message'] = 'Thank you for registering! Please verify your email to login.'
            return JSONResponse(
                content={
                    "message": 
                    "Thanks for joining us! If your email isn't already pending verification or registered, you'll receive a verification email. Once you confirm, your account will be ready to use!"
                },
                status_code=200
            )
        
        detail = {}

        if check_username:
            detail['username_error'] = {
                "error": "Username exists",
                "message": "The chosen username is already taken. Please choose another."
            }
        
        if check_first_last:
            detail['first_last_error'] = {
                "error": "First-Last name pair exists",
                "message": "The chosen first-last name pair is already taken. Please choose another."
            }
        
        raise HTTPException(
            status_code=409,
            detail=detail,
        )
    