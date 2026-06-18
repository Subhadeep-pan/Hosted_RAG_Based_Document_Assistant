from fastapi import APIRouter

from backend.app.services.agent_service import (
    run_agent
)

router = APIRouter()


@router.get("/ask")
def ask_question(
        question: str
):

    answer = run_agent(
        question
    )

    return {
        "answer": answer
    }