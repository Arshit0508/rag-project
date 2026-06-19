const { embedText } = require('./services/embeddings');

async function run() {
  const vector = await embedText("RAG retrieves relevant documents before generating an answer.");
  console.log("Vector length:", vector.length);
  console.log("First 10 numbers:", vector.slice(0, 10));
}

run();