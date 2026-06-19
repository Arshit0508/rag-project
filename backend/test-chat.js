// test-chat.js
// A simple script that asks our running server a question.
// Run this with: node test-chat.js
// (Make sure "node server.js" is running in another terminal first.)

async function run() {
  const response = await fetch('http://localhost:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'Where is the company headquartered?' }),
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', data);
}

run();