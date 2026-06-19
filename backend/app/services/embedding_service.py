from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def create_embeddings(chunks):
    embeddings = []
    for chunk in chunks:
        result = client.models.embed_content(
            model="gemini-embedding-001",
            contents=chunk
        )
        embeddings.append(result.embeddings[0].values)
    return embeddings