import React from 'react';
import { useQA } from '../context/QAContext';

/**
 * AnswerDisplay: renders the concise answer or an empty-state hint.
 */
export default function AnswerDisplay() {
  const { state } = useQA();
  const hasAnswer = !!(state.answer && state.answer.trim());

  return (
    <div className="card answer-card">
      <h2 className="answer-title">Answer</h2>
      {hasAnswer ? (
        <div className="answer-body" aria-live="polite">{state.answer}</div>
      ) : (
        <div className="muted">Your answer will appear here.</div>
      )}
    </div>
  );
}
