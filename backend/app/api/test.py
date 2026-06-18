from fastapi import APIRouter
from backend.app.services.chroma_service import collection

router = APIRouter()


@router.get("/documents")
def documents():

    data = collection.get()

    return {
        "count": len(data["ids"]),
        "ids": data["ids"],
        "metadatas": data["metadatas"]
    }