const { askQuestion } = require('./services/rag');

async function run() {
  const result = await askQuestion("whats your refund policy for international orders?");
  console.log("ANSWER:\n", result.answer);
  console.log("\nSOURCES USED:");
  result.sources.forEach((s, i) => {
    console.log(`${i + 1}. (score: ${s.score.toFixed(3)}) ${s.text}`);
  });
}

run();