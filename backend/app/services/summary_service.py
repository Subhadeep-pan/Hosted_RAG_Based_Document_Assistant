from backend.app.services.chroma_service import (
    collection
)

from backend.app.services.llm_service import (
    generate_answer
)


def summarize_document(
        doc_id
):

    results = collection.get(
        where={
            "doc_id": doc_id
        }
    )

    documents = results.get(
        "documents",
        []
    )

    if not documents:

        return (
            f"Document '{doc_id}' not found."
        )

    text = "\n".join(
        documents
    )

    prompt = f"""
Summarize the following document.

Document:
{text}

Provide:

1. Overview
2. Key Points
3. Important Technologies
4. Final Summary
"""

    return generate_answer(
        prompt
    )