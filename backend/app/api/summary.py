from fastapi import APIRouter

from backend.app.services.summary_service import (
    summarize_document
)

router = APIRouter()


@router.get("/summary")
def get_summary(
        doc_id: str
):

    summary = summarize_document(
        doc_id
    )

    return {
        "document": doc_id,
        "summary": summary
    }