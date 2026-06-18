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