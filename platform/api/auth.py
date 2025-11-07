from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator
from pydantic.types import StringConstraints
from typing import Annotated
import secrets
import json
from datetime import datetime, timezone

from lib.email_utils import is_email, normalize_email, send_email
from lib.password_utils import hash_password
from lib.generate_uuid import generate_uuid
from initialize_dbs import operations, redis_db0


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
            if (
                await redis_db0.get(f"register_awaiting_verification:{user_credentials.username}")
                or await redis_db0.get(f"register_awaiting_verification:{user_credentials.email}")
                or await redis_db0.get(f"register_awaiting_verification:{user_credentials.first_name}-{user_credentials.last_name}")
            ):
                raise HTTPException(
                    status_code=409,
                    detail="A registration with this username, email, or first-last name pair is already pending verification."
                )

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

            # send_email(
            #     title='DataDungeon100: Verify Registration',
            #     receivers=[user_credentials.email],
            #     content=f"""
            #         <html>
            #             <body>
            #                 <h1>Verify your email by clicking the following button</h1>
            #                 <a 
            #                     style='
            #                         background-color: red;
            #                         color: white;
            #                         font-family: sans-serif;
            #                         font-weight: bold;
            #                         font-size: 1.5rem;
                                    
            #                         padding: 1em;
            #                         border-radius: 1rem;
            #                     '
            #                     href='/api/auth/verify-registration?token={verification_token}'
            #                 >
            #                     Verify Registration
            #                 </a>
            #                 <h2 style='color: blue; font-weight: 1000;'>NOTE: Token expires after 15 minutes!</h2>
            #             </body>
            #         </html>
            #     """
            # )
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

    @app.get('/api/auth/verify-registration')
    async def verify_email(token: str):
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

        return {"message": "Successfully Registered!"}
