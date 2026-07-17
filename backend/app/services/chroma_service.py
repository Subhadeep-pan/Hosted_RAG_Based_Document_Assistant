import chromadb

client = chromadb.PersistentClient(
    path="backend/app/vectorstore/chroma_db"
)

collection = client.get_or_create_collection(
    name="documents"
)


def store_chunks(
        chunks,
        embeddings,
        doc_id
):

    ids = []

    metadatas = []

    for i in range(len(chunks)):

        ids.append(
            f"{doc_id}_{i}"
        )

        metadatas.append(
            {
                "doc_id": doc_id
            }
        )

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings.tolist(),
        metadatas=metadatas
    )
def get_document_ids():
    """Returns the list of unique document names currently stored."""

    results = collection.get()

    doc_ids = set()

    for metadata in results.get("metadatas", []):
        if metadata and metadata.get("doc_id"):
            doc_ids.add(metadata["doc_id"])

    return sorted(doc_ids)


def delete_document(doc_id):
    """Removes just one document's chunks, keeping every other document."""

    collection.delete(where={"doc_id": doc_id})