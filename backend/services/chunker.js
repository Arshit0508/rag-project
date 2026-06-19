function chunkText(text, chunkSize = 150, overlap = 30) {
  // Step 1: Normalize whitespace (collapse newlines/tabs/multiple spaces into single spaces)
  const cleaned = text.replace(/\s+/g, ' ').trim();
 
  // Step 2: Split into words. This is a simple, beginner-friendly approach.
  // (More advanced chunkers split by sentences or tokens, but word-splitting
  // is easy to understand and works well enough for a first RAG project.)
  const words = cleaned.split(' ');
 
  const chunks = [];
  let start = 0;
 
  while (start < words.length) {
    const end = start + chunkSize;
    const chunkWords = words.slice(start, end);
    chunks.push(chunkWords.join(' '));
 
    // Step 3: Move the start forward, but step back by `overlap` words
    // so consecutive chunks share some context.
    start += chunkSize - overlap;
  }
 
  return chunks;
}
 
module.exports = { chunkText };