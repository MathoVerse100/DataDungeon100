from fastapi import FastAPI, Request, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from pydantic import BaseModel

from initialize_dbs import operations, redis_db0
from lib.email_utils import normalize_email, is_email
from lib.password_utils import check_password
from api.__dependencies__.auth import logout_required

import json
import secrets
from datetime import datetime


class UserLoginCredentials(BaseModel):
    username_or_email: str
    password: str


def generator(app: FastAPI):

    @app.get('/api/auth/login', dependencies=[Depends(logout_required)])
    async def login(request: Request):
        verify_message = request.session.pop('verify_message', None)
        return JSONResponse(status_code=200, content={'verify_message': verify_message})


    @app.post('/api/auth/login', dependencies=[Depends(logout_required)])
    async def login(request: Request, user_credentials: UserLoginCredentials) -> Response:
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

        data = {
            "session_token": session_token,
            "user_info": user_info
        }

        request.session['user_session_data'] = data
        request.session['logged'] = True

        await operations.execute(f"""
            UPDATE USER_AUTH
            SET LAST_SIGN_IN = %s::timestamp
            WHERE {field} = %s::text
        """, (datetime.now(), username_or_email), fetch=False)

        return JSONResponse(content=data, status_code=200)