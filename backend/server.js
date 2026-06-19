// server.js
// This is the entry point of our backend. Running this file starts our web server.

require('dotenv').config(); // loads variables from .env into process.env
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware: code that runs on every request before it reaches our routes
app.use(cors());          // allows our frontend (different origin) to call this API
app.use(express.json());  // automatically parses incoming JSON request bodies

// A simple test route to confirm the server works
app.get('/', (req, res) => {
  res.send('RAG backend is running ✅');
});

// Mount our two main feature routes
const uploadRoute = require('./routes/upload');
const chatRoute = require('./routes/chat');

app.use('/upload', uploadRoute); // POST /upload -> ingest a document
app.use('/chat', chatRoute);     // POST /chat   -> ask a question

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});