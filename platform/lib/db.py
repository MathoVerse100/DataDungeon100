import psycopg


class DB:
    def __init__(self, url: str):
        self._url = url

    async def execute(self, query: str, variables: tuple | None = None, fetch: bool = True) -> list[dict | None]:
        async with await psycopg.AsyncConnection.connect(self._url, row_factory=psycopg.rows.dict_row) as connection:
            async with connection.cursor() as cursor: 
                await cursor.execute(query, variables)
                if fetch:
                    return await cursor.fetchall()
                await connection.commit()
                return None

    async def set_url(self, url: str):
        self._url = url
