# RAG Project 🤖

> A Retrieval-Augmented Generation (RAG) application built from scratch to understand how AI answers questions using your own data.

This project explores the fundamentals of RAG by implementing a custom vector database from the ground up — no third-party vector store like Pinecone or FAISS. It combines OpenAI's language models with a Vite.js frontend for a clean, interactive Q&A experience.

---

## What is RAG?

RAG (Retrieval-Augmented Generation) enhances an LLM by giving it relevant context from your own data before generating a response. Instead of relying solely on the model's training data, RAG:

1. **Embeds** your documents into vectors
2. **Stores** them in a vector database
3. **Retrieves** the most relevant chunks when a query is made
4. **Feeds** that context to the LLM to generate a grounded response

```
User Query → Embed Query → Search Vector DB → Retrieve Context → OpenAI LLM → Answer
```

---

## Features

- 🧠 **OpenAI powered** — Uses OpenAI embeddings and GPT for generation
- 🗄️ **Custom vector database** — Built from scratch to understand how vector search works under the hood
- ⚡ **Vite.js frontend** — Fast, modern UI for querying the RAG pipeline
- 📄 **Document ingestion** — Load and embed your own documents
- 🔍 **Semantic search** — Finds the most relevant context using cosine similarity

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite.js |
| LLM & Embeddings | OpenAI API |
| Vector Database | Custom (built from scratch) |
| Language | JavaScript / Python |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- An OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arshit0508/rag-project.git
   cd rag-project
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up your environment variables**
   ```bash
   cp .env.example .env
   ```
   Add your OpenAI API key to `.env`:
   ```
   VITE_OPENAI_API_KEY=your-openai-api-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## How It Works

### 1. Document Ingestion
Documents are split into chunks and each chunk is converted into a vector embedding using OpenAI's `text-embedding` model.

### 2. Custom Vector Store
Embeddings are stored in a custom-built in-memory vector database. Similarity search is performed using **cosine similarity** — no external library needed.

### 3. Query & Retrieval
When a user asks a question, it's embedded using the same model. The top-N most similar document chunks are retrieved from the vector store.

### 4. Generation
The retrieved chunks are passed as context to OpenAI's GPT model, which generates a relevant, grounded answer.

---

## Project Structure

```
rag-project/
├── src/
│   ├── vectorStore.js     # Custom vector database implementation
│   ├── embeddings.js      # OpenAI embedding logic
│   ├── retriever.js       # Similarity search & retrieval
│   ├── generator.js       # OpenAI GPT response generation
│   └── App.jsx            # Vite.js frontend
├── data/                  # Your documents go here
├── .env.example
├── package.json
└── vite.config.js
```

---

## Key Learning Outcomes

- How vector embeddings represent text semantically
- How cosine similarity is used to find related content
- How to build a minimal vector store without external tools
- How RAG connects retrieval and generation into one pipeline

---

## Contributing

Contributions and improvements are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is open source. See [LICENSE](LICENSE) for details.
