from fastapi import FastAPI, Request, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from pydantic import BaseModel, field_validator
from typing import Literal

from initialize_dbs import operations
from api.dependencies import login_required


class PostReaction(BaseModel):
    name: Literal['likes', 'dislikes']

    @field_validator("name", mode='before')
    def remove_capitalization_reaction_name(cls, name):
        if isinstance(name, str):
            name = name.lower()

        return name


def generator(app: FastAPI):

    @app.post('/api/communities/{community_title}/posts/{post_id}/reaction', dependencies=[Depends(login_required)])
    async def api_communities_posts_reaction(request: Request, community_title: str, post_id: int, reaction: PostReaction) -> Response:
        if not (
            await operations.execute(
                """SELECT TITLE FROM COMMUNITY_INFO WHERE LOWER(TITLE) = %s::text""",
                (community_title,)
            )
        ):
            raise HTTPException(status_code=404, detail='Community not found')

        if not (
            await operations.execute(
                """SELECT ID FROM COMMUNITY_POST_INFO WHERE ID = %s::integer""",
                (post_id,)
            )
        ):
            raise HTTPException(status_code=404, detail='Post not found')

        user_session_data: dict = request.session.get('user_session_data')
        user_info: dict = user_session_data.get('user_info')

        user_previous_reaction = await operations.execute(f"""
                SELECT VALUE
                FROM COMMUNITY_POST_USER_LIKE_DISLIKE
                WHERE 1=1
                AND USER_ID = %s::integer
                AND POST_ID = %s::integer
            """,
            (user_info.get('user_id'), post_id)
        )

        user_reaction_query = None
        user_reaction_parameters = None
        post_reaction_query = None
        post_reaction_parameters = (post_id,)

        if user_previous_reaction:
            if (
                (user_previous_reaction[0]['value'] == 1 and reaction.name == 'dislikes')
                or (user_previous_reaction[0]['value'] == -1 and reaction.name == 'likes')
            ):
                user_reaction_query = f"""
                    UPDATE COMMUNITY_POST_USER_LIKE_DISLIKE
                    SET VALUE = %s::integer
                    WHERE 1=1
                    AND USER_ID = %s::integer
                    AND POST_ID = %s::integer
                """
                user_reaction_parameters = (-user_previous_reaction[0]['value'], user_info.get('user_id'), post_id)

                post_reaction_query = f"""
                    UPDATE COMMUNITY_POST_INFO
                    SET LIKES = LIKES + {-1 if reaction.name == 'dislikes' else 1},
                    DISLIKES = DISLIKES + {-1 if reaction.name == 'likes' else 1}
                    WHERE ID = %s::integer
                """

            else:
                user_reaction_query = f"""
                    DELETE FROM COMMUNITY_POST_USER_LIKE_DISLIKE
                    WHERE 1=1
                    AND USER_ID = %s::integer
                    AND POST_ID = %s::integer
                """
                user_reaction_parameters = (user_info.get('user_id'), post_id)

                post_reaction_query = f"""
                    UPDATE COMMUNITY_POST_INFO
                    SET {reaction.name} = {reaction.name} - 1
                    WHERE ID = %s::integer
                """

        else:
            user_reaction_query = f"""
                INSERT INTO COMMUNITY_POST_USER_LIKE_DISLIKE (USER_ID, POST_ID, VALUE)
                VALUES (%s::integer, %s::integer, %s::integer)
            """
            user_reaction_parameters = (user_info.get('user_id'), post_id, (1 if reaction.name == 'likes' else -1))

            post_reaction_query = f"""
                UPDATE COMMUNITY_POST_INFO
                SET {reaction.name} = {reaction.name} + 1
                WHERE ID = %s::integer
            """ 

        try:
            await operations.execute(user_reaction_query, user_reaction_parameters, fetch=False)
        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))

        try:
            await operations.execute(post_reaction_query, post_reaction_parameters, fetch=False)
        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))

        return JSONResponse(status_code=200, content='Reaction successfully saved!')
