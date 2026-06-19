const { chunkText } = require('./services/chunker');
const { embedText, embedChunks } = require('./services/embeddings');
const { addRecords, search } = require('./services/vectorStore');

const sampleText = `
Our return policy allows customers to return any product within 30 days of purchase for a full refund.
Shipping is free on all orders over $50 within the continental United States.
We accept credit cards, debit cards, and PayPal as payment methods.
Customer support is available Monday through Friday from 9am to 5pm Eastern Time.
`;

async function run() {
  // 1. Chunk the document
  const chunks = chunkText(sampleText, 25, 5);
  console.log(`Created ${chunks.length} chunks.`);

  // 2. Embed each chunk
  const vectors = await embedChunks(chunks);

  // 3. Store chunk + embedding pairs
  const records = chunks.map((text, i) => ({
    text,
    embedding: vectors[i],
    source: 'sample-policy.txt',
  }));
  addRecords(records);
  console.log('Stored records in vector DB.');

  // 4. Ask a question and search
  const question = "How long do I have to return something?";
  const queryEmbedding = await embedText(question);
  const results = search(queryEmbedding, 2);

  console.log(`\nTop matches for: "${question}"\n`);
  results.forEach((r, i) => {
    console.log(`${i + 1}. (score: ${r.score.toFixed(3)}) ${r.text}`);
  });
}

run();