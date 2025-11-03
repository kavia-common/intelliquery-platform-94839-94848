import { useState } from 'react';

// PUBLIC_INTERFACE
export default function PromptPanel({ onSubmit, loading = false }) {
  /** Prompt input with Ocean styling. */
  const [prompt, setPrompt] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit(prompt.trim());
  };

  return (
    <form onSubmit={submit} className="surface" style={{ padding: 20 }}>
      <div className="stack">
        <label htmlFor="prompt" className="muted">Enter your query</label>
        <textarea
          id="prompt"
          className="textarea"
          rows={4}
          placeholder="Ask the DSP system anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="helper">Use natural language. Press Enter to submit.</span>
          <button disabled={loading || !prompt.trim()} className="btn btn-primary" type="submit">
            {loading ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>
    </form>
  );
}
