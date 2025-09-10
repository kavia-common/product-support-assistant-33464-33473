import React, { useCallback } from 'react';
import { useQA } from '../context/QAContext';

/**
 * QuestionInput: input row with text field and Ask button.
 */
export default function QuestionInput() {
  const { state, actions } = useQA();

  const onSubmit = useCallback(() => {
    actions.ask(state.question);
  }, [actions, state.question]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="card input-card">
      <div className="input-row">
        <input
          className="input"
          type="text"
          placeholder="Ask a question about features, troubleshooting, pricing, or warranty..."
          value={state.question}
          onChange={(e) => actions.setQuestion(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Question"
        />
        <button className="btn" onClick={onSubmit} disabled={state.loading} aria-label="Ask">
          {state.loading ? 'Thinking…' : 'Ask'}
        </button>
      </div>
      <div className="muted" style={{ marginTop: 8 }}>
        Tip: Press Enter to submit.
      </div>
    </div>
  );
}
