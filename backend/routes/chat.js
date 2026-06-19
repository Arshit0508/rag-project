// routes/chat.js
// Receives a user question, runs the RAG pipeline, returns the answer + sources.

const express = require('express');
const { askQuestion } = require('../services/rag');

const router = express.Router();

// POST /chat   body: { "question": "..." }
router.post('/', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'Please provide a "question" string in the request body.' });
    }

    const result = await askQuestion(question);
    res.json(result); // { answer, sources }
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to generate an answer.' });
  }
});

module.exports = router;