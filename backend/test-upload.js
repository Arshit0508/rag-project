// test-upload.js
// A simple script that uploads test-doc.txt to our running server.
// Run this with: node test-upload.js
// (Make sure "node server.js" is running in another terminal first.)

const fs = require('fs');

async function run() {
  const fileBuffer = fs.readFileSync('test-doc.txt');
  const blob = new Blob([fileBuffer]);

  const formData = new FormData();
  formData.append('file', blob, 'test-doc.txt');

  const response = await fetch('http://localhost:5000/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', data);
}

run();