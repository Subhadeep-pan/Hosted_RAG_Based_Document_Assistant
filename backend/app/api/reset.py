from fastapi import APIRouter

from backend.app.services.chroma_service import (
    collection
)

from backend.app.services.chat_memory import (
    clear_history
)

import os

router = APIRouter()


@router.delete("/reset")
def reset_project():

    data = collection.get()

    if data["ids"]:

        collection.delete(
            ids=data["ids"]
        )

    clear_history()

    upload_folder = (
        "backend/uploads/pdfs"
    )

    for file in os.listdir(
            upload_folder
    ):

        file_path = os.path.join(
            upload_folder,
            file
        )

        if os.path.isfile(
                file_path
        ):

            os.remove(
                file_path
            )

    return {
        "message":
            "Project reset successfully"
    }