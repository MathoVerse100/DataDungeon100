from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse

from initialize_dbs import redis_db0
from api.__dependencies__.auth import login_required


def generator(app: FastAPI):

    @app.post('/api/auth/logout', dependencies=[Depends(login_required)])
    async def logout(request: Request):
        user_session_data = request.session.get('user_session_data', None)
        await redis_db0.delete(f'session_tokens:{user_session_data.get('session_token', None)}')

        return JSONResponse(status_code=200, content='User successfully logged out!')