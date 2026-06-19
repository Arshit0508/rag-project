// services/vectorStore.js
// A minimal "vector database" built from scratch using a JSON file and
// plain math. Real vector DBs (Pinecone, Chroma, etc.) do this same core
// idea but with much faster indexing for millions of vectors. For a
// beginner project with a handful of documents, this is plenty fast.

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'vectors.json');

// Make sure the data file exists before we try to read it
function ensureDbFile() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

/**
 * Loads all stored records: [{ id, text, embedding, source }, ...]
 */
function loadAll() {
  ensureDbFile();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Saves the full records array back to disk.
 */
function saveAll(records) {
  ensureDbFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(records, null, 2));
}

/**
 * Adds new chunk+embedding records to the store.
 * @param {Array<{text: string, embedding: number[], source: string}>} newRecords
 */
function addRecords(newRecords) {
  const existing = loadAll();
  const withIds = newRecords.map((r, i) => ({
    id: existing.length + i,
    ...r,
  }));
  saveAll([...existing, ...withIds]);
  return withIds;
}

/**
 * Computes cosine similarity between two equal-length vectors.
 * Returns a number between -1 and 1 (1 = identical meaning direction).
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0; // avoid divide-by-zero
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Finds the top-k most similar stored chunks to a given query embedding.
 * @param {number[]} queryEmbedding
 * @param {number} topK
 * @returns {Array<{id, text, source, score}>} sorted by descending similarity
 */
function search(queryEmbedding, topK = 4) {
  const records = loadAll();

  const scored = records.map((record) => ({
    id: record.id,
    text: record.text,
    source: record.source,
    score: cosineSimilarity(queryEmbedding, record.embedding),
  }));

  // Sort highest similarity first, then take the top K
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

module.exports = { addRecords, loadAll, search, cosineSimilarity };