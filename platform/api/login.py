from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from lib.email_utils import is_email, normalize_email
from lib.password import hash_password
from initialize_dbs import operations


class UserCredentials(BaseModel):
    username_or_email: str
    password: str


def generator(app: FastAPI) -> None:

    @app.post('/api/login')
    async def login(user_credentials: UserCredentials):
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

