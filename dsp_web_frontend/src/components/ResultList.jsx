import React from 'react';

// PUBLIC_INTERFACE
export default function ResultList({ results = [] }) {
  /** Displays a list of result items from the DSP response. */
  if (!results.length) {
    return (
      <div className="surface" style={{ padding: 20 }}>
        <div className="muted">No results yet. Submit a prompt to see responses.</div>
      </div>
    );
  }

  return (
    <div className="stack">
      {results.map((item, idx) => (
        <div key={idx} className="surface" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.title || `Result ${idx + 1}`}</div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{item.content || JSON.stringify(item, null, 2)}</div>
        </div>
      ))}
    </div>
  );
}
