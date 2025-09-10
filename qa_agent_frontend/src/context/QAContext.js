import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { askQuestionAPI, sendFeedbackAPI } from '../utils/api';

// State shape and reducer for centralized management
const initialState = {
  question: '',
  answer: '',
  loading: false,
  error: null,
  history: [], // [{ id, question, answer, ts }]
  lastAnswerId: null,
  feedbackStatus: null, // 'thanks' | 'error' | null
};

function qaReducer(state, action) {
  switch (action.type) {
    case 'SET_QUESTION':
      return { ...state, question: action.payload };
    case 'ASK_START':
      return { ...state, loading: true, error: null, feedbackStatus: null };
    case 'ASK_SUCCESS': {
      const entry = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        question: action.payload.question,
        answer: action.payload.answer,
        ts: Date.now(),
      };
      const history = [entry, ...state.history].slice(0, 30);
      return {
        ...state,
        loading: false,
        answer: action.payload.answer,
        lastAnswerId: entry.id,
        history,
      };
    }
    case 'ASK_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'PICK_FROM_HISTORY':
      return { ...state, question: action.payload.question, answer: action.payload.answer, lastAnswerId: action.payload.id, error: null };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    case 'DISMISS_ERROR':
      return { ...state, error: null };
    case 'FEEDBACK_OK':
      return { ...state, feedbackStatus: 'thanks' };
    case 'FEEDBACK_ERR':
      return { ...state, feedbackStatus: 'error' };
    default:
      return state;
  }
}

const QAContext = createContext(null);

// PUBLIC_INTERFACE
export function QAProvider({ children }) {
  /**
   * Provides state and actions for Q&A app including:
   * - ask(question): fetches answer via API, updates history
   * - setQuestion(value): sets current input
   * - selectHistory(id): loads a past QA
   * - clearHistory(): clears history
   * - sendFeedback(kind): sends 'up' or 'down' feedback about the last answer
   */
  const [state, dispatch] = useReducer(qaReducer, initialState);

  const actions = useMemo(() => ({
    setQuestion: (value) => dispatch({ type: 'SET_QUESTION', payload: value }),
    ask: async (question) => {
      if (!question || !question.trim()) {
        dispatch({ type: 'ASK_ERROR', payload: 'Please enter a question.' });
        return;
      }
      try {
        dispatch({ type: 'ASK_START' });
        const res = await askQuestionAPI(question.trim());
        const answer = (res && res.answer) ? res.answer : 'No answer available.';
        dispatch({ type: 'ASK_SUCCESS', payload: { question: question.trim(), answer } });
      } catch (err) {
        const msg = err?.message || 'Something went wrong while getting the answer.';
        dispatch({ type: 'ASK_ERROR', payload: msg });
      }
    },
    selectHistory: (id) => {
      const entry = state.history.find(h => h.id === id);
      if (entry) {
        dispatch({ type: 'PICK_FROM_HISTORY', payload: entry });
      }
    },
    clearHistory: () => dispatch({ type: 'CLEAR_HISTORY' }),
    dismissError: () => dispatch({ type: 'DISMISS_ERROR' }),
    sendFeedback: async (kind) => {
      // kind: 'up' | 'down'
      if (!state.lastAnswerId) return;
      try {
        await sendFeedbackAPI({ id: state.lastAnswerId, kind });
        dispatch({ type: 'FEEDBACK_OK' });
      } catch {
        dispatch({ type: 'FEEDBACK_ERR' });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [state.history, state.lastAnswerId]);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <QAContext.Provider value={value}>{children}</QAContext.Provider>;
}

// PUBLIC_INTERFACE
export function useQA() {
  /** Hook to access Q&A app state and actions. */
  const ctx = useContext(QAContext);
  if (!ctx) throw new Error('useQA must be used within QAProvider');
  return ctx;
}
