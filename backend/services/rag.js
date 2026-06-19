// services/rag.js
// Ties everything together: embed the question -> retrieve relevant chunks
// -> build a grounded prompt -> ask Gemini to generate an answer.

require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const { embedText } = require('./embeddings');
const { search } = require('./vectorStore');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Builds the prompt that grounds the LLM's answer in retrieved context.
 */
function buildPrompt(question, contextChunks) {
  const contextText = contextChunks
    .map((c, i) => `[${i + 1}] ${c.text}`)
    .join('\n\n');

  return `You are a helpful assistant answering questions based only on the provided context.
If the answer cannot be found in the context, say "I don't have enough information to answer that."
Do not make up information that isn't in the context.

Context:
${contextText}

Question: ${question}

Answer:`;
}

/**
 * The full RAG pipeline for a single question.
 * @param {string} question
 * @param {number} topK - how many chunks to retrieve
 * @returns {Promise<{answer: string, sources: Array}>}
 */
async function askQuestion(question, topK = 4) {
  // 1. Turn the question into a vector (same embedding model as our chunks)
  const queryEmbedding = await embedText(question);

  // 2. Retrieve the most semantically similar chunks from our store
  const topChunks = search(queryEmbedding, topK);

  // 3. Build the grounded prompt
  const prompt = buildPrompt(question, topChunks);

  // 4. Ask Gemini to generate an answer using that context
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return {
    answer: response.text,
    sources: topChunks.map((c) => ({ text: c.text, score: c.score, source: c.source })),
  };
}

module.exports = { askQuestion, buildPrompt };