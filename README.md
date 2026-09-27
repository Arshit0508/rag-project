# 🧠 Intelligent Document RAG System

> **Upload a document. Ask questions. Get answers grounded in the most relevant parts of your document.**

A full-stack **Retrieval-Augmented Generation (RAG)** application built with **React, Node.js, Express, and Google Gemini**.

The system allows users to upload documents and ask natural-language questions about their content. Instead of sending the entire document directly to an LLM, the application first retrieves the most relevant document sections using **embeddings and cosine similarity**, and then provides those sections as context to **Gemini 2.5 Flash** for answer generation.

The project implements the core RAG pipeline using a lightweight **JSON-backed vector store**, making the retrieval process transparent and easy to understand.

---

## ✨ Features

- 📄 **Document Upload** — Upload documents through a simple web interface
- ✂️ **Text Chunking** — Splits documents into overlapping chunks
- 🧠 **Embeddings** — Generates semantic embeddings using `gemini-embedding-001`
- 🔎 **Semantic Search** — Retrieves relevant chunks using cosine similarity
- 🗄️ **Custom Vector Store** — Stores embeddings in a JSON-backed vector store
- 🎯 **Top-K Retrieval** — Selects the most relevant document chunks
- 🤖 **Gemini Generation** — Uses Gemini 2.5 Flash to generate answers
- 🛡️ **Grounded Responses** — Provides retrieved document context to the LLM
- 📚 **Source Retrieval** — Returns retrieved chunks and similarity scores
- ⚛️ **React Frontend** — Interactive document Q&A interface
- 🔌 **REST API** — Separate frontend and backend architecture

---

# 🏗️ Architecture

The system consists of two main pipelines.

## 📥 Document Ingestion

```text
                ┌──────────────────┐
                │  Upload Document │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │  Extract Text    │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │     Chunking     │
                │ 150 words        │
                │ 30 word overlap  │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │ Gemini Embedding │
                │ gemini-embedding │
                │      -001        │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │   Vector Store   │
                │   vectors.json   │
                └──────────────────┘

                                ┌──────────────────┐
                │  User Question   │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │ Question         │
                │ Embedding        │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │ Cosine Similarity│
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │ Top-K Relevant   │
                │     Chunks       │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │ Grounded Prompt  │
                │ + Retrieved      │
                │    Context       │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │ Gemini 2.5 Flash │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │ Answer + Sources │
                └──────────────────┘

                                         DOCUMENT
                            │
                            ▼
                     ┌─────────────┐
                     │   Chunking  │
                     └──────┬──────┘
                            ▼
                     ┌─────────────┐
                     │  Embedding  │
                     └──────┬──────┘
                            ▼
                     ┌─────────────┐
                     │Vector Store │
                     └──────┬──────┘
                            │
                            │
                  ┌─────────▼─────────┐
                  │    USER QUERY     │
                  └─────────┬─────────┘
                            ▼
                     ┌─────────────┐
                     │   Query     │
                     │  Embedding  │
                     └──────┬──────┘
                            ▼
                     ┌─────────────┐
                     │   Cosine    │
                     │ Similarity  │
                     └──────┬──────┘
                            ▼
                     ┌─────────────┐
                     │   Top-K     │
                     │  Retrieval  │
                     └──────┬──────┘
                            ▼
                     ┌─────────────┐
                     │   Grounded  │
                     │   Prompt    │
                     └──────┬──────┘
                            ▼
                     ┌─────────────┐
                     │   Gemini    │
                     │ 2.5 Flash   │
                     └──────┬──────┘
                            ▼
                     ┌─────────────┐
                     │   Answer    │
                     │ + Sources   │
                     └─────────────┘

                     🧠 Why RAG?

A basic LLM application follows:

Question → LLM → Answer

For document-based question answering, sending an entire document to the model can introduce unnecessary context.

RAG adds a retrieval stage:

Question
   ↓
Find relevant information
   ↓
Provide relevant context to LLM
   ↓
Generate answer

This allows the system to work with external, private, and domain-specific information without retraining the language model.

🛠️ Tech Stack
Layer	Technology
Frontend	React
Build Tool	Vite
Backend	Node.js
Web Framework	Express.js
LLM	Google Gemini 2.5 Flash
Embeddings	Gemini Embedding API
Vector Store	Custom JSON-backed store
Retrieval	Cosine Similarity
File Upload	Multer
Communication	REST API
Language	JavaScript
📁 Project Structure
rag-project/
│
├── backend/
│   │
│   ├── routes/
│   │   ├── upload.js
│   │   └── chat.js
│   │
│   ├── services/
│   │   ├── chunker.js
│   │   ├── embeddings.js
│   │   ├── vectorStore.js
│   │   └── rag.js
│   │
│   ├── data/
│   │   └── vectors.json
│   │
│   ├── server.js
│   └── package.json
│
├── frontend/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
🔬 Core Components
1. Text Chunking

Documents are divided into smaller overlapping chunks before generating embeddings.

The current implementation uses:

Chunk Size  → 150 words
Overlap     → 30 words
Step Size   → 120 words

For example:

Chunk 1 → words 1 - 150
Chunk 2 → words 121 - 270
Chunk 3 → words 241 - 390

The overlap helps preserve context when information spans across chunk boundaries.

2. Embeddings

Each document chunk is converted into a numerical vector using:

gemini-embedding-001

The user's question is embedded using the same embedding model.

This allows the system to compare:

Question Embedding
        ↕
Document Chunk Embedding

based on semantic similarity rather than exact keyword matching.

3. Vector Store

Instead of relying on an external vector database, the project uses a lightweight JSON-backed vector store:

backend/data/vectors.json

Each stored record contains information such as:

{
  "id": 0,
  "text": "document chunk...",
  "embedding": [0.012, -0.031, "..."],
  "source": "document.txt"
}

This approach keeps the implementation simple while exposing the underlying mechanics of vector retrieval.

4. Cosine Similarity

The system measures similarity between the question vector and document vectors using cosine similarity.

                 A · B
cos(A,B) = ─────────────────
           |A| × |B|

Where:

A = question embedding
B = document chunk embedding
A · B = dot product
|A| and |B| = vector magnitudes

A higher cosine similarity indicates greater similarity between the two vector representations.

5. Top-K Retrieval

For every question, the system:

Generates an embedding for the question.
Compares it against stored document embeddings.
Calculates cosine similarity.
Sorts the results by similarity.
Selects the most relevant chunks.

The current implementation retrieves the Top 4 chunks by default.

These chunks are then provided to Gemini as context.

6. Grounded Generation

The retrieved chunks are inserted into a structured prompt before being sent to Gemini 2.5 Flash.

The model is instructed to:

Use the provided document context.
Avoid inventing unsupported information.
Indicate when the available context is insufficient.

The response contains:

Answer
+
Retrieved Sources
+
Similarity Scores

This makes the retrieval stage visible and allows users to see the document context behind the generated response.

🔌 API

The backend exposes two primary endpoints.

Upload Document
POST /upload
Content-Type: multipart/form-data

Form field:

file

Processing flow:

Upload
  ↓
Read
  ↓
Chunk
  ↓
Embed
  ↓
Store
Ask a Question
POST /chat
Content-Type: application/json

Request:

{
  "question": "What does the document say about the leave policy?"
}

Response:

{
  "answer": "...",
  "sources": [
    {
      "text": "...",
      "score": 0.82,
      "source": "document.txt"
    }
  ]
}
⚙️ Getting Started
Prerequisites
Node.js 18+
npm
Google Gemini API key
1. Clone the Repository
git clone https://github.com/Arshit0508/rag-project.git

cd rag-project
2. Setup Backend
cd backend

npm install

Create a .env file inside the backend directory:

GEMINI_API_KEY=your_gemini_api_key
PORT=5000

Start the backend:

node server.js

The backend will run on:

http://localhost:5000
3. Setup Frontend

Open another terminal:

cd frontend

npm install

npm run dev

Vite will provide a local development URL, typically:

http://localhost:5173

Open the URL in your browser.

🎯 Project Summary

Intelligent Document RAG System is a full-stack application that combines semantic retrieval with LLM-based generation to answer questions from uploaded documents. Documents are split into overlapping chunks, embedded using Gemini, stored in a custom vector store, and searched using cosine similarity. The most relevant chunks are then provided to Gemini 2.5 Flash as context to generate grounded answers along with their retrieved sources.**

👨‍💻 Author

Arshit
Computer Science Undergraduate — NIT Jalandhar

Built as a hands-on exploration of:

RAG
Embeddings
Semantic Search
Vector Retrieval
LLM Applications
Backend Engineering