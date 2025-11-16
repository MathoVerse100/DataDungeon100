from fastapi import FastAPI, Request


def generator(app: FastAPI):

    @app.get('/test')
    async def test(request: Request):
        return "Hello, WORLD!"