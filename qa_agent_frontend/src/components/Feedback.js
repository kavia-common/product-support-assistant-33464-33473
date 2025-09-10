import React from 'react';
import { useQA } from '../context/QAContext';

/**
 * Feedback: allows user to vote on the helpfulness of last answer.
 */
export default function Feedback() {
  const { state, actions } = useQA();
  const disabled = !state.lastAnswerId;

  return (
    <div className="card feedback-card" aria-label="Answer feedback">
      <div className="feedback-row">
        <span className="muted">Was this answer helpful?</span>
        <button
          className="feedback-btn"
          onClick={() => actions.sendFeedback('up')}
          disabled={disabled}
          aria-label="Thumbs up"
          title={disabled ? 'Ask a question to enable feedback' : 'Thumbs up'}
        >
          👍 Yes
        </button>
        <button
          className="feedback-btn"
          onClick={() => actions.sendFeedback('down')}
          disabled={disabled}
          aria-label="Thumbs down"
          title={disabled ? 'Ask a question to enable feedback' : 'Thumbs down'}
        >
          👎 No
        </button>
        <span className="feedback-note">
          {state.feedbackStatus === 'thanks' && 'Thanks for the feedback!'}
          {state.feedbackStatus === 'error' && 'Could not send feedback.'}
          {!state.feedbackStatus && 'Optional'}
        </span>
      </div>
    </div>
  );
}
