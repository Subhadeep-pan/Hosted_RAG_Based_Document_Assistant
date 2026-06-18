from backend.app.services.redis_service import (
    redis_client
)


CHAT_KEY = "chat_history"


def add_message(
        role,
        content
):

    redis_client.rpush(
        CHAT_KEY,
        f"{role}: {content}"
    )


def get_history():

    messages = redis_client.lrange(
        CHAT_KEY,
        0,
        -1
    )

    return "\n".join(
        messages
    )


def clear_history():

    redis_client.delete(
        CHAT_KEY
    )