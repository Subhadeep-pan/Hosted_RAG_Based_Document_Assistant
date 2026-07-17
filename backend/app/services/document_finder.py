from backend.app.services.chroma_service import (
    collection,
    get_document_ids,
)


def find_document(query):

    query = query.lower()

    keywords = ["summarize", "summary", "document", "file", "my", "the", "of"]

    for keyword in keywords:
        query = query.replace(keyword, "")

    query = query.strip()

    results = collection.get()
    documents = results.get("metadatas", [])

    for metadata in documents:
        doc_id = metadata.get("doc_id")
        if query in doc_id.lower():
            return doc_id

    return None


def list_documents():
    """Looks at what's actually stored in ChromaDB and returns the real
    list of uploaded documents - no guessing from the LLM needed."""

    doc_ids = get_document_ids()

    if not doc_ids:
        return "You haven't uploaded any documents yet."

    lines = "\n".join(f"• {doc_id}" for doc_id in doc_ids)
    return f"You have {len(doc_ids)} document(s) uploaded:\n{lines}"