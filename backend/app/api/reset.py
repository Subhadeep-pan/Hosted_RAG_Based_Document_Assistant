from fastapi import APIRouter
import os

from backend.app.services.chroma_service import collection
from backend.app.core.config import UPLOAD_DIR

router = APIRouter()


@router.delete("/reset")
def reset_project():
    """Clears all uploaded documents. This is separate from chats now -
    it does NOT delete any conversation history."""

    data = collection.get()

    if data["ids"]:
        collection.delete(ids=data["ids"])

    if os.path.isdir(UPLOAD_DIR):
        for file in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, file)
            if os.path.isfile(file_path):
                os.remove(file_path)

    return {"message": "Documents cleared"}
