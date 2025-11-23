from fastapi import FastAPI, Request, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from pydantic import BaseModel, field_validator
from typing import Literal

from initialize_dbs import operations
from api.__dependencies__.auth import login_required
from api.__dependencies__.communities import check_community_exists, check_community_post_exists


class CommentReaction(BaseModel):
    name: Literal['likes', 'dislikes']

    @field_validator("name", mode='before')
    def remove_capitalization_reaction_name(cls, name):
        if isinstance(name, str):
            name = name.lower()

        return name


def generator(app: FastAPI):
    
    @app.post(
        '/api/communities/{community_title}/posts/{post_id}/comments/{comment_id}/reaction', 
        dependencies=[
            Depends(login_required),
            Depends(check_community_exists),
            Depends(check_community_post_exists)
        ]
    )
    async def api_communities_posts_comments_reaction(
        request: Request,
        community_title: str,
        post_id: int,
        comment_id: int,
        reaction: CommentReaction,
    ) -> Response:

        user_session_data: dict = request.session.get('user_session_data')
        user_info: dict = user_session_data.get('user_info')

        user_previous_reaction = await operations.execute(
            f"""
                SELECT VALUE
                FROM COMMUNITY_COMMENT_USER_LIKE_DISLIKE
                WHERE 1=1
                AND USER_ID = %s::integer
                AND COMMENT_ID = %s::integer
            """,
            (user_info.get('user_id'), comment_id)
        )


        reaction_query = None
        user_reaction_parameters = None
        comment_reaction_parameters = (comment_id,)

        if user_previous_reaction:
            if (
                (user_previous_reaction[0]['value'] == 1 and reaction.name == 'dislikes')
                or (user_previous_reaction[0]['value'] == -1 and reaction.name == 'likes')
            ):
                reaction_query = f"""
                    WITH
                    
                    USER_REACTION AS (
                        UPDATE COMMUNITY_COMMENT_USER_LIKE_DISLIKE
                        SET VALUE = %s::integer
                        WHERE 1=1
                        AND USER_ID = %s::integer
                        AND COMMENT_ID = %s::integer
                    ),

                    POST_REACTION AS (
                        UPDATE COMMUNITY_COMMENT_INFO
                        SET LIKES = LIKES + {-1 if reaction.name == 'dislikes' else 1},
                        DISLIKES = DISLIKES + {-1 if reaction.name == 'likes' else 1}
                        WHERE ID = %s::integer
                    )

                    SELECT 'DONE';
                """
                user_reaction_parameters = (-user_previous_reaction[0]['value'], user_info.get('user_id'), comment_id)

            else:
                reaction_query = f"""
                    WITH
                    
                    USER_REACTION AS (
                        DELETE FROM COMMUNITY_COMMENT_USER_LIKE_DISLIKE
                        WHERE 1=1
                        AND USER_ID = %s::integer
                        AND COMMENT_ID = %s::integer
                    ),

                    POST_REACTION AS (
                        UPDATE COMMUNITY_COMMENT_INFO
                        SET {reaction.name} = {reaction.name} - 1
                        WHERE ID = %s::integer
                    )

                    SELECT 'DONE';
                """
                user_reaction_parameters = (user_info.get('user_id'), comment_id)

        else:
            reaction_query = f"""
                WITH
                
                USER_REACTION AS (
                    INSERT INTO COMMUNITY_COMMENT_USER_LIKE_DISLIKE (USER_ID, COMMENT_ID, VALUE)
                    VALUES (%s::integer, %s::integer, %s::integer)
                ),

                POST_REACTION AS (
                    UPDATE COMMUNITY_COMMENT_INFO
                    SET {reaction.name} = {reaction.name} + 1
                    WHERE ID = %s::integer
                )

                SELECT 'DONE';
            """
            user_reaction_parameters = (user_info.get('user_id'), comment_id, (1 if reaction.name == 'likes' else -1))


        try:
            await operations.execute(
                reaction_query,
                (*user_reaction_parameters, *comment_reaction_parameters),
                fetch=False
            )
        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))

        return JSONResponse(status_code=200, content='Reaction successfully saved!')
