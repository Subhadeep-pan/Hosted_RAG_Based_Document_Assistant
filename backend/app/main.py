from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os

from backend.app.core.auth import verify_api_key
from backend.app.core.config import (
    CORS_ORIGINS,
    GEMINI_API_KEY,
    UPLOAD_DIR,
)

from backend.app.api.chat import router as chat_router
from backend.app.api.chats import router as chats_router
from backend.app.api.documents import router as documents_router
from backend.app.api.reset import router as reset_router
from backend.app.api.summary import router as summary_router
from backend.app.api.upload import router as upload_router

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="AI Document Inteligence")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Protect all API routes
protected = [Depends(verify_api_key)]

for router in (
    upload_router,
    chat_router,
    chats_router,
    reset_router,
    summary_router,
    documents_router,
):
    app.include_router(router, dependencies=protected)


@app.get("/")
def home():
    return {
        "message": "AI Resume Assistant API"
    }