from time import sleep

from fastapi import APIRouter, Header
from fastapi.responses import StreamingResponse

from backend.app.services.agent_service import run_agent
from backend.app.services.chat_memory import get_chat_title
from backend.app.services.rate_limiter import is_rate_limited

router = APIRouter()

RATE_LIMIT_MESSAGE = (
    "You're sending messages too fast. "
    "Please wait a minute and try again."
)


def stream_text(text):
    """Stream text word by word."""

    for word in text.split():
        yield word + " "
        sleep(0.03)


@router.get("/ask")
def ask_question(
    question: str,
    chat_id: str,
    x_session_id: str = Header(default="default"),
):
    if is_rate_limited(x_session_id):
        return {"answer": RATE_LIMIT_MESSAGE}

    answer = run_agent(question, x_session_id, chat_id)

    return {
        "answer": answer,
        "title": get_chat_title(x_session_id, chat_id),
    }


@router.get("/ask/stream")
def ask_question_stream(
    question: str,
    chat_id: str,
    x_session_id: str = Header(default="default"),
):
    if is_rate_limited(x_session_id):
        return StreamingResponse(
            stream_text(RATE_LIMIT_MESSAGE),
            media_type="text/plain",
        )

    answer = run_agent(question, x_session_id, chat_id)

    return StreamingResponse(
        stream_text(answer),
        media_type="text/plain",
    )