from fastapi import APIRouter

from backend.app.services.redis_service import (
    redis_client
)

router = APIRouter()


@router.get("/redis-test")
def redis_test():

    redis_client.set(
        "name",
        "Subhadeep"
    )

    value = redis_client.get(
        "name"
    )

    return {
        "value": value
    }