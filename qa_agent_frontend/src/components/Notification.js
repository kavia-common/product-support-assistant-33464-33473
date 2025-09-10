import React from 'react';
import { useQA } from '../context/QAContext';

/**
 * Notification: shows error messages with dismiss action.
 */
export default function Notification() {
  const { state, actions } = useQA();
  const show = !!state.error;

  return (
    <div className={`notice ${show ? 'show' : ''}`} role={show ? 'alert' : undefined}>
      <span aria-hidden="true">⚠️</span>
      <div style={{ flex: 1 }}>{state.error}</div>
      {show && (
        <button
          className="clear-btn"
          onClick={actions.dismissError}
          aria-label="Dismiss error"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
