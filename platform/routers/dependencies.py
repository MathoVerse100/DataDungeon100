from fastapi import Request
import httpx
import os

async def verify_session_token(request: Request) -> bool:
    session_user_data = request.session.get('session_user_data')
    if not session_user_data:
        return False

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://localhost:8000/api/auth/verify-session-token",
            params={'token': session_user_data['session_token']}
        )

    return response.json()