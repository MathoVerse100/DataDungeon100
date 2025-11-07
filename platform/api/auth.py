from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator
from pydantic.types import StringConstraints
from typing import Annotated

from lib.email_utils import is_email, normalize_email
from lib.password_utils import hash_password
from initialize_dbs import operations


class UserLoginCredentials(BaseModel):
    username_or_email: str
    password: str

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
        StringConstraints(min_length=5, max_length=255)
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



def generator(app: FastAPI) -> None:

    @app.post('/api/auth/login')
    async def login(user_credentials: UserLoginCredentials):
        username_or_email = (
            normalize_email(user_credentials.username_or_email) 
            if is_email(user_credentials.username_or_email)
            else user_credentials.username_or_email
        )
        password = hash_password(user_credentials.password)

        field = "EMAIL" if is_email(username_or_email) else "USERNAME"
        query = f"""
            SELECT *
            FROM USER_AUTH
            WHERE {field} = %s::text
            AND PASSWORD = %s::text
        """

        user = await operations.execute(query, (username_or_email, password))

        if len(user) == 0 or not user:
            raise HTTPException(status_code=401, detail="Invalid username, email or password")
        
        return {"Message": "Login Successful!", "user": user[0], "status_code": 200}
    
    @app.post('/api/auth/register')
    async def register(user_credentials: UserRegisterCredentials):

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

        if not check_username and not check_email and not check_first_last:
            ...
            return {"status_code": 200, "message": "Success!"}
        
        detail = []

        if check_username:
            detail.append({
                "error": "Username exists",
                "message": "The chosen username is already taken. Please choose another."
            })
        
        if check_email:
            detail.append({
                "error": "Email exists",
                "message": "The chosen email is already taken. Please choose another."
            })
        
        if check_first_last:
            detail.append({
                "error": "First-Last name pair exists",
                "message": "The chosen first-last name pair is already taken. Please choose another."
            })
        
        raise HTTPException(
            status_code=409,
            detail=detail
        )

    @app.get('/api/auth/verification')
    async def verify_email():
        ...