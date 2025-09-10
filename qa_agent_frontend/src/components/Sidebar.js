import React from 'react';
import { useQA } from '../context/QAContext';

/**
 * Sidebar: shows query history and allows selecting or clearing items.
 */
export default function Sidebar() {
  const { state, actions } = useQA();

  return (
    <div className="card sidebar-card">
      <div className="sidebar-header">
        <div className="sidebar-title">Recent Questions</div>
        {state.history.length > 0 && (
          <button className="clear-btn" onClick={actions.clearHistory} aria-label="Clear history">
            Clear
          </button>
        )}
      </div>
      {state.history.length === 0 ? (
        <div className="muted">No recent queries yet.</div>
      ) : (
        <ul className="history-list" aria-label="Query history">
          {state.history.map(item => (
            <li
              key={item.id}
              className="history-item"
              onClick={() => actions.selectHistory(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' ? actions.selectHistory(item.id) : null)}
              aria-label={`Load question: ${item.question}`}
              title={item.question}
            >
              <div className="history-bullet" />
              <div className="history-text">{item.question}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
