"""
Lets the frontend see which documents are uploaded (so the list survives
a page refresh) and delete just one of them, without wiping everything
like "Reset Documents" does.
"""

from fastapi import APIRouter

from backend.app.services.chroma_service import get_document_ids, delete_document

router = APIRouter()


@router.get("/documents")
def get_documents():
    return {"documents": get_document_ids()}


@router.delete("/documents/{doc_id}")
def remove_document(doc_id: str):
    delete_document(doc_id)
    return {"message": "Document deleted"}