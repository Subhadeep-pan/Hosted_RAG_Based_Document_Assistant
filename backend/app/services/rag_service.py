from google import genai
import os
from backend.app.services.chroma_service import collection

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def retrieve_context(question):
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=question
    )
    query_embedding = result.embeddings[0].values

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=5
    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    context = "\n".join(documents)

    sources = []
    for metadata in metadatas:
        if metadata is None:
            continue
        doc_id = metadata.get("doc_id")
        if doc_id and doc_id not in sources:
            sources.append(doc_id)

    return {"context": context, "sources": sources}