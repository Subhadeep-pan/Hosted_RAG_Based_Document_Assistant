from backend.app.services.chroma_service import (
    collection
)


def find_document(
        query
):

    query = query.lower()

    keywords = [
        "summarize",
        "summary",
        "document",
        "file",
        "my",
        "the",
        "of"
    ]

    for keyword in keywords:

        query = query.replace(
            keyword,
            ""
        )

    query = query.strip()

    results = collection.get()

    documents = results.get(
        "metadatas",
        []
    )

    for metadata in documents:

        doc_id = metadata.get(
            "doc_id"
        )

        if query in doc_id.lower():

            return doc_id

    return None