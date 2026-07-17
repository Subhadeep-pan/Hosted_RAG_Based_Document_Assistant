from backend.app.services.embedding_service import model

from backend.app.services.chroma_service import (
    collection
)


def retrieve_context(question):

    query_embedding = model.encode(
        question
    )

    results = collection.query(
        query_embeddings=[
            query_embedding.tolist()
        ],
        n_results=5
    )

    documents = results["documents"][0]

    metadatas = results["metadatas"][0]

    context = "\n".join(
        documents
    )

    sources = []

    for metadata in metadatas:

        if metadata is None:
            continue

        doc_id = metadata.get(
            "doc_id"
        )

        if (
            doc_id
            and doc_id not in sources
        ):

            sources.append(
                doc_id
            )

    return {
        "context": context,
        "sources": sources
    }