import os
import redis.asyncio as redis
from lib.db import DB

operations = DB(os.getenv("PLATFORM_OPERATIONS_DB_URL"))
redis_db0 = redis.Redis(
    host=os.getenv('REDIS_HOST'),
    port=os.getenv('REDIS_PORT'),
    password=os.getenv('REDIS_PASSWORD'),
    db=0
)
