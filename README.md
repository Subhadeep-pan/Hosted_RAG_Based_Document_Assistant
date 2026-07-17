# 🚀 Hosted RAG-Based Document Assistant

### AI-Powered Document Intelligence Platform — Live on Render + Vercel

A Retrieval-Augmented Generation (RAG) platform that lets users upload documents, chat with their content across multiple conversations, generate summaries, and get accurate, cited answers using Google Gemini, ChromaDB, and Redis.

Built with FastAPI, React, ChromaDB, Redis, and Google Gemini — with an agentic layer that can reach for a calculator or the web when the documents alone aren't enough.

---

## 🌐 Live Deployment

* **Frontend**: deployed on [Vercel](https://vercel.co)
* **Backend**: containerized with Docker, deployed on [Render](https://render.com)
* **Redis**: hosted on [Redis Cloud](https://redis.io/cloud)
* **CI**: GitHub Actions runs a syntax check + frontend lint/build on every push

---

## ✨ Features

### 📄 Document Processing
* Upload PDF, DOCX, TXT, and image files
* OCR text extraction for scanned/image documents (Tesseract)
* Multi-file upload support
* Automatic text extraction and smart chunking
* Embedding generation using Sentence Transformers

### 🤖 AI-Powered Chat
* Multiple, independent chat sessions per user
* Context-aware answers using RAG over your uploaded documents
* Multi-document retrieval
* Document-specific summarization
* Source citations for transparency

### 🧠 Agentic Tools
* Calculator tool for numeric questions
* Web search tool (Tavily) for questions outside the uploaded documents
* Agent decides when to pull in a tool vs. answer from retrieved context

### 🧠 Intelligent Retrieval
* ChromaDB vector database
* Semantic similarity search
* Context injection for accurate answers

### ⚡ Performance & Safety
* Redis-backed chat memory (per-conversation history)
* Redis question caching for faster repeated queries
* Per-client rate limiting
* Optional API-key authentication on every route

---

## 🏗️ System Architecture

```
Frontend (React + Vite)  →  hosted on Vercel
        ↓
FastAPI Backend  ──  API-key auth + rate limiting  →  hosted on Render (Docker)
        ↓
Redis  (chat memory + response cache)  →  Redis Cloud
        ↓
ChromaDB  (vector store)
        ↓
Google Gemini  (LLM)  +  Agent Tools (calculator, web search)
```

---

## 🛠️ Tech Stack

**Frontend**: React, Vite, Tailwind CSS, React Icons, React Dropzone, Framer Motion, Axios

**Backend**: FastAPI, Python, Uvicorn

**AI & RAG**: Google Gemini, Sentence Transformers, ChromaDB, Retrieval-Augmented Generation

**Database & Caching**: ChromaDB, Redis (Redis Cloud in production)

**Deployment**: Docker, Render (backend), Vercel (frontend), GitHub Actions CI

---

## 📂 Project Structure

```text
Hosted_RAG_Based_Document_Assistant/
├── backend/
│   ├── app/
│   │   ├── api/            # chat, chats, documents, reset, summary, upload
│   │   ├── core/           # config.py, auth.py
│   │   ├── services/       # rag, llm, embeddings, chroma, redis, rate limiter...
│   │   ├── tools/          # calculator_tool, web_search_tool
│   │   ├── utils/          # chunking, prompts
│   │   ├── vectorstore/    # chroma_db (local persistence)
│   │   └── main.py
│   ├── uploads/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── .github/workflows/ci.yml
├── Dockerfile
├── .dockerignore
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* Python 3.11+
* Node.js 20+
* A local or hosted Redis instance
* Tesseract OCR installed if you want image/OCR support ([install guide](https://github.com/tesseract-ocr/tesseract))

### Backend

```bash
# from the project root
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r backend/requirements.txt

cp backend/.env.example backend/.env
# then fill in GEMINI_API_KEY, TAVILY_API_KEY, REDIS_* etc.

uvicorn backend.app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`, Swagger docs at `http://127.0.0.1:8000/docs`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# set VITE_API_URL=http://127.0.0.1:8000

npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 🔑 Environment Variables

**`backend/.env`**

```env
GEMINI_API_KEY=
TAVILY_API_KEY=

# Optional - if set, every request must include a matching X-API-Key header
API_KEY=

# Comma separated list of allowed frontend origins
CORS_ORIGINS=http://localhost:5173

# Redis - use the connection details from your Redis Cloud database
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
REDIS_SSL=false

UPLOAD_DIR=backend/uploads/pdfs
TESSERACT_CMD=
MAX_REQUESTS_PER_MINUTE=20
```

**`frontend/.env`**

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_API_KEY=
```

> `REDIS_HOST` is the bare hostname only (no `redis://` prefix, no port). `REDIS_PORT` is just the number. Match `REDIS_SSL` to whatever the TLS setting shows in your Redis Cloud database's Configuration tab — mismatching it causes connection errors.

---

## ☁️ Deployment Notes

* **Backend** — the root `Dockerfile` builds the FastAPI app; Render auto-deploys on push to `main`. `requirements.txt` pins a CPU-only `torch` build (`--extra-index-url https://download.pytorch.org/whl/cpu`) to keep the image small enough for Render's free tier — don't add `langchain`/`langgraph` back in unless the code actually starts using them, as they pull in a large, unused dependency tree.
* **Frontend** — Vercel project root directory is `frontend/`, `VITE_API_URL` points at the Render backend URL.
* **CORS** — `CORS_ORIGINS` on the backend must exactly match the Vercel URL (no trailing slash) or the frontend will get blocked with CORS errors.

> ⚠️ ChromaDB and uploaded files are stored on local disk inside the container. On Render, this resets on every redeploy/restart unless you attach a persistent disk (requires a paid instance type).

---

## 🎯 Key Highlights

* Retrieval-Augmented Generation (RAG)
* Multi-chat, multi-document question answering
* Agentic tool use (calculator, web search)
* Semantic search with vector embeddings
* Redis-backed memory and caching
* OCR support for scanned documents
* API-key auth and rate limiting
* Dockerized, CI-checked, cloud-deployed on Render + Vercel

---

## 📈 Future Improvements

* User authentication & role-based access control
* Persistent disk / hosted vector DB for production durability
* Migrate off the deprecated `google.generativeai` package to `google.genai`
* Voice interaction
* Multi-language support

---

## 👨‍💻 Author

Subhadeep Pan
Computer Science Engineering Student

Built as an end-to-end AI Document Intelligence Platform using modern RAG architecture and Generative AI technologies.
