// routes/upload.js
// Handles file uploads: reads the text, chunks it, embeds it, stores it.

const express = require('express');
const multer = require('multer');
const fs = require('fs');

const { chunkText } = require('../services/chunker');
const { embedChunks } = require('../services/embeddings');
const { addRecords } = require('../services/vectorStore');

const router = express.Router();

// multer config: store uploaded files temporarily in an "uploads/" folder on disk
const upload = multer({ dest: 'uploads/' });

// POST /upload  (expects a multipart/form-data request with field name "file")
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Use field name "file".' });
    }

    // 1. Read the uploaded file's text content
    const text = fs.readFileSync(req.file.path, 'utf-8');

    // 2. Clean up the temp file from disk now that we've read it
    fs.unlinkSync(req.file.path);

    // 3. Chunk the document
    const chunks = chunkText(text, 150, 30);

    // 4. Embed every chunk
    const vectors = await embedChunks(chunks);

    // 5. Store chunk + embedding + source filename
    const records = chunks.map((chunkTextValue, i) => ({
      text: chunkTextValue,
      embedding: vectors[i],
      source: req.file.originalname,
    }));
    addRecords(records);

    res.json({
      message: 'File processed and stored successfully.',
      filename: req.file.originalname,
      chunksStored: chunks.length,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process file.' });
  }
});

module.exports = router;