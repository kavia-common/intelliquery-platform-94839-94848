import { useState } from 'react';
import PromptPanel from '../components/PromptPanel';
import ResultList from '../components/ResultList';
import { submitPrompt } from '../api/prompt';

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Home page with prompt input and results. */
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const onSubmit = async (prompt) => {
    setLoading(true);
    try {
      const data = await submitPrompt(prompt);
      // Normalize to list
      const list = Array.isArray(data?.results) ? data.results : (data ? [data] : []);
      setResults(list);
    } catch (e) {
      setResults([{ title: 'Error', content: e?.message || 'Request failed' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: 24 }}>
      <div className="stack">
        <PromptPanel onSubmit={onSubmit} loading={loading} />
        <ResultList results={results} />
      </div>
    </div>
  );
}
