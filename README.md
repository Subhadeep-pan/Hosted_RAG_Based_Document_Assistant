# 🚀 Document Intelligence Platform

> An AI-powered Document Intelligence Platform that allows users to upload documents, chat with them using Retrieval-Augmented Generation (RAG), generate summaries, and retrieve context-aware answers powered by Gemini AI.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11-yellow?logo=python)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)
![Redis](https://img.shields.io/badge/Redis-Caching-red?logo=redis)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-success?logo=githubactions)

---

# 📌 Overview

Document Intelligence Platform is a full-stack AI application that enables users to upload multiple documents and interact with them using natural language.

The platform leverages Retrieval-Augmented Generation (RAG) to provide accurate, context-aware answers grounded in uploaded document content.

---

# ✨ Features

## 📄 Multi-Document Upload

* Upload multiple PDFs and documents
* Automatic document ingestion
* Intelligent document processing

## 🤖 AI-Powered Question Answering

* Ask questions about uploaded documents
* Context-aware answers using Gemini AI
* Retrieval-Augmented Generation (RAG)

## 🔍 Semantic Search

* ChromaDB Vector Database
* Embedding-based retrieval
* High relevance document matching

## 📝 Document Summarization

* AI-generated summaries
* Quick understanding of large documents

## ⚡ Redis Integration

* Chat memory
* Response caching
* Improved performance

## 🎨 Modern UI

* React + Vite Frontend
* Clean ChatGPT-inspired interface
* Dark / Light Theme

## 🐳 Docker Support

* Containerized backend
* Easy deployment
* Portable environment

## ⚙️ CI/CD Pipeline

* GitHub Actions
* Automatic frontend build verification
* Automatic backend validation

---

# 🏗️ Architecture

User Uploads Documents
↓
Text Extraction
↓
Chunking
↓
Embeddings
↓
ChromaDB Vector Store
↓
Semantic Retrieval
↓
Gemini AI
↓
Context-Aware Response

---

# 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Axios

### Backend

* FastAPI
* Python

### AI & RAG

* Google Gemini AI
* ChromaDB
* Sentence Transformers

### Caching

* Redis

### DevOps

* Docker
* GitHub Actions

### Deployment

* Render
* Vercel

---

# 📂 Project Structure

```text
Document-Intelligence-Platform
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── services
│   │   ├── tools
│   │   └── vectorstore
│   │
│   └── requirements.txt
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── Dockerfile
├── .dockerignore
└── README.md
```

# 🚀 Local Setup

## Clone Repository

```bash
git clone https://github.com/Subhadeep-pan/Document-Intelligence-Platform.git

cd Document-Intelligence-Platform
```

## Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Create `.env`

```env
GEMINI_API_KEY=YOUR_API_KEY
```

Run Backend

```bash
uvicorn backend.app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

---

## Redis Setup

```bash
docker run -d -p 6379:6379 redis
```

Verify

```bash
docker ps
```

---

## Frontend Setup

Open new terminal

```bash
cd frontend

npm install

npm run dev
```

Frontend URL

```text
http://localhost:5173
```

---

# 🐳 Docker

Build Image

```bash
docker build -t document-intelligence .
```

Run Container

```bash
docker run -p 8000:8000 document-intelligence
```

---

# ⚙️ CI/CD

GitHub Actions automatically:

* Installs dependencies
* Validates backend code
* Builds frontend application
* Runs on every push to master branch

---

# 🎯 Resume Highlights

* Built an AI-powered Document Intelligence Platform using React, FastAPI, Gemini AI, ChromaDB, and Redis.
* Implemented Retrieval-Augmented Generation (RAG) for context-aware document question answering.
* Integrated semantic search using vector embeddings and ChromaDB.
* Added Redis-based caching and chat memory.
* Dockerized the application and implemented GitHub Actions CI pipeline.
* Deployed using Render and Vercel.

---

# 🔮 Future Enhancements

* OCR Support (OLMOCR)
* Qwen-VL Integration
* Authentication & User Management
* Cloud Vector Databases
* Persistent Chat History
* Advanced Analytics Dashboard

---

# 👨‍💻 Author

### Subhadeep Pan

Computer Science Engineering Student

⭐ If you like this project, give it a star on GitHub!
