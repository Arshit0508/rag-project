const { chunkText } = require('./services/chunker');

const sampleText = `
Artificial intelligence is transforming how software is built. 
Retrieval-Augmented Generation, or RAG, is one such technique. 
It allows language models to answer questions using external documents 
instead of relying only on what they memorized during training. 
This makes answers more accurate and up to date. 
RAG works by splitting documents into chunks, converting those chunks 
into embeddings, storing them in a vector database, and retrieving 
the most relevant chunks when a user asks a question.
`;

const chunks = chunkText(sampleText, 20, 5); // small numbers so you can see overlap clearly

chunks.forEach((chunk, i) => {
  console.log(`\n--- Chunk ${i + 1} ---`);
  console.log(chunk);
});