from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
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
        ...

