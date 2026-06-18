# 🚀  AI Intelligence Platform

### RAG Based AI-Powered Document Intelligence Platform

DocuMind AI is a modern Retrieval-Augmented Generation (RAG) platform that allows users to upload documents, chat with their content, generate summaries, and retrieve accurate answers using Gemini AI, ChromaDB, and Redis.

Built with FastAPI, React, ChromaDB, Redis, and Google Gemini, the platform provides intelligent document understanding with semantic search, memory, caching, and multi-document support.

---

## ✨ Features

### 📄 Document Processing

* Upload PDF, DOCX, and TXT files
* Multi-file upload support
* Automatic text extraction
* Smart text chunking
* Embedding generation using Sentence Transformers

### 🤖 AI-Powered Chat

* Ask questions about uploaded documents
* Context-aware responses using RAG
* Multi-document retrieval
* Document-specific summarization
* Source citations for transparency

### 🧠 Intelligent Retrieval

* ChromaDB Vector Database
* Semantic similarity search
* Smart document retrieval pipeline
* Context injection for accurate answers

### ⚡ Performance Optimization

* Redis Chat Memory
* Redis Question Cache
* Faster repeated responses
* Reduced LLM API usage

### 🌐 Additional Capabilities

* Web Search Integration
* Calculator Tool
* Document Summaries
* Dark Mode Support
* Modern ChatGPT-Inspired UI

---

## 🏗️ System Architecture

Frontend (React + Vite)

↓

FastAPI Backend

↓

Redis Cache + Chat Memory

↓

ChromaDB Vector Store

↓

Google Gemini AI

↓

Document Intelligence & Retrieval

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Icons
* React Dropzone

### Backend

* FastAPI
* Python
* Uvicorn

### AI & RAG

* Google Gemini
* Sentence Transformers
* ChromaDB
* Retrieval-Augmented Generation (RAG)

### Database & Caching

* ChromaDB
* Redis

### Deployment

* Docker
* Render 
* GitHub Actions CI/CD 

---

## 📂 Project Structure

```text
AI-Resume-Assistant/

├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── tools/
│   │   ├── utils/
│   │   └── vectorstore/
│   │
│   └── uploads/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## 🚀 Getting Started

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn backend.app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

Create:

```text
backend/.env
```

Example:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
TAVILY_API_KEY=YOUR_TAVILY_API_KEY
```

---

## 🎯 Key Highlights

* Retrieval-Augmented Generation (RAG)
* Multi-Document Question Answering
* Semantic Search
* Vector Embeddings
* ChromaDB Integration
* Redis Memory & Caching
* Gemini AI Integration
* Modern React Frontend
* FastAPI Backend
* Production-Ready Architecture

---

## 📈 Future Improvements

* Docker Deployment
* Render Hosting
* GitHub Actions CI/CD
* User Authentication
* Role-Based Access Control
* OCR for Scanned PDFs
* Voice Interaction
* Multi-Language Support

---

## 👨‍💻 Author

Subhadeep Pan

Computer Science Engineering Student

Built as an end-to-end AI Document Intelligence Platform using modern RAG architecture and Generative AI technologies.
