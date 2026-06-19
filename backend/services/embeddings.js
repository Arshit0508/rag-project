// services/embeddings.js
// Converts text into an embedding (a vector of numbers representing meaning)
// using Google's Gemini embedding model.

require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

// Create one client and reuse it everywhere (no need to recreate per call)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Converts a single piece of text into an embedding vector.
 * @param {string} text
 * @returns {Promise<number[]>} the embedding vector
 */
async function embedText(text) {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: [text],
  });

  // The API returns an array of embeddings (one per input). We only sent one input.
  return response.embeddings[0].values;
}

/**
 * Embeds multiple chunks of text one by one.
 * (Beginner-friendly sequential version — fine for small documents.
 *  Later this could be parallelized or batched for speed.)
 * @param {string[]} chunks
 * @returns {Promise<number[][]>} array of embedding vectors, same order as input
 */
async function embedChunks(chunks) {
  const vectors = [];
  for (const chunk of chunks) {
    const vector = await embedText(chunk);
    vectors.push(vector);
  }
  return vectors;
}

module.exports = { embedText, embedChunks };