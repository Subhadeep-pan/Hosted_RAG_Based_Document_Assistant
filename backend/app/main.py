from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware
)

import google.generativeai as genai

from dotenv import load_dotenv

from backend.app.api.reset import (
    router as reset_router
)

from backend.app.api.upload import (
    router as upload_router
)

from backend.app.api.chat import (
    router as chat_router
)

from backend.app.api.test import (
    router as test_router
)

from backend.app.api.summary import (
    router as summary_router
)
from backend.app.api.test_redis import (
    router as redis_router
)
import os


load_dotenv("backend/.env")

genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(
    upload_router
)

app.include_router(
    chat_router
)

app.include_router(
    reset_router
)

app.include_router(
    test_router
)

app.include_router(
    summary_router
)
app.include_router(
    redis_router
)

@app.get("/")
def home():

    return {
        "message":
            "AI Resume Assistant API"
    }