"""
All configuration lives here, loaded from environment variables (.env file).
This is the ONLY place that should read os.getenv() - every other file
imports the values it needs from here. That way, nothing is hardcoded
and the whole app can be reconfigured just by editing the .env file.
"""

import os
from dotenv import load_dotenv

load_dotenv("backend/.env")

# --- API keys ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")

# --- Simple app auth ---
# If left empty, the API runs "open" (fine for local dev).
# Set API_KEY in .env to require an "X-API-Key" header on every request.
API_KEY = os.getenv("API_KEY", "")

# --- CORS ---
# Comma separated list, e.g. "http://localhost:5173,https://myapp.com"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

# --- Redis ---
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", "") or None
REDIS_SSL = os.getenv("REDIS_SSL", "false").lower() == "true"

# --- Storage ---
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "backend/uploads/pdfs")

# --- OCR ---
# Only needed on Windows if Tesseract isn't on PATH.
# Leave empty on Linux/Mac - pytesseract will just use the "tesseract" command.
TESSERACT_CMD = os.getenv("TESSERACT_CMD", "")

# --- Rate limiting ---
MAX_REQUESTS_PER_MINUTE = int(os.getenv("MAX_REQUESTS_PER_MINUTE", "20"))
