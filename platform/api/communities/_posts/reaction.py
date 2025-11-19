from fastapi import FastAPI, Request, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from pydantic import BaseModel

from initialize_dbs import operations
from api.dependencies import login_required


class PostReaction(BaseModel):
    ...


def generator(app: FastAPI):

    @app.post('/api/communities/{community_title}/posts/{post_id}/reaction', dependencies=[Depends(login_required)])
    async def api_communities_posts_reaction(request: Request, reaction: PostReaction) -> Response:
        ...