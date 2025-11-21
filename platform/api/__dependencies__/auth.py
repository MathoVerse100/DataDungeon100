from fastapi import Request, Response
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

from initialize_dbs import redis_db0
import json


async def login_required(request: Request):
    user_session_data = request.session.get('user_session_data')

    if not user_session_data:
        raise HTTPException(status_code=401, detail='Not logged in')

    session_token = user_session_data.get('session_token')
    user_data = await redis_db0.get(f"session_tokens:{session_token}")

    if not user_data:
        request.session['logged'] = False
        request.session['user_session_data'] = False

        raise HTTPException(status_code=401, detail='Session expired')
    
    return JSONResponse(status_code=200, content=json.loads(user_data))


async def logout_required(request: Request) -> Response:
    user_session_data = request.session.get('user_session_data')

    if not user_session_data:
        return JSONResponse(status_code=200, content='OK!')

    session_token = user_session_data.get('session_token')
    user_data = await redis_db0.get(f"session_tokens:{session_token}")

    if not user_data:
        request.session['logged'] = False
        del request.session["user_session_data"]

        return JSONResponse(status_code=200, content='OK!')
    
    raise HTTPException(status_code=401, detail="User is logged in")    