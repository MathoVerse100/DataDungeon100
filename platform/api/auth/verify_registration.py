from fastapi import FastAPI, Request, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
import json

from initialize_dbs import operations, redis_db0
from api.__dependencies__.auth import logout_required


def generator(app: FastAPI):

    @app.get('/api/auth/verify_registration', dependencies=[Depends(logout_required)])
    async def api_auth_verify_registration(request: Request, token: str) -> Response:
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

        return JSONResponse(status_code=200, content="Successfully Registered!")