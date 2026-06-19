import { useState } from 'react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function App() {
  // ---- STATE ----
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ---- HANDLERS ----
  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!file) {
      setUploadStatus('Please choose a file first.');
      return;
    }

    setUploadStatus('Uploading and processing...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setUploadStatus(`Error: ${data.error}`);
        return;
      }

      setUploadStatus(`✅ "${data.filename}" processed into ${data.chunksStored} chunk(s).`);
    } catch (err) {
      setUploadStatus('❌ Upload failed. Is the backend running?');
    }
  }

  async function handleAsk() {
    const trimmed = question.trim();
    if (!trimmed) return;

    const userMessage = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', text: `Error: ${data.error}` }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data.answer, sources: data.sources },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Failed to reach the backend. Is it running?' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAsk();
  }

  // ---- RENDER ----
  return (
    <div className="app">
      <h1>📄 RAG Document Assistant</h1>

      <section className="upload-section">
        <h2>1. Upload a document</h2>
        <input type="file" accept=".txt" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        {uploadStatus && <p className="status">{uploadStatus}</p>}
      </section>

      <section className="chat-section">
        <h2>2. Ask questions about it</h2>

        <div className="chat-window">
          {messages.length === 0 && (
            <p className="empty-state">Upload a document, then ask a question about it.</p>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.text}

              {msg.sources && msg.sources.length > 0 && (
                <details className="sources">
                  <summary>View sources used</summary>
                  {msg.sources.map((s, j) => (
                    <div key={j} className="source-item">
                      <em>score: {s.score.toFixed(3)} | {s.source}</em>
                      <p>{s.text}</p>
                    </div>
                  ))}
                </details>
              )}
            </div>
          ))}

          {isLoading && <p className="loading">Thinking...</p>}
        </div>

        <div className="input-row">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your document..."
          />
          <button onClick={handleAsk} disabled={isLoading}>Send</button>
        </div>
      </section>
    </div>
  );
}

export default App;