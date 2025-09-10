import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { QAProvider, useQA } from './QAContext';

// Mock the api utils used by QAContext
jest.mock('../utils/api', () => ({
  askQuestionAPI: jest.fn(),
  sendFeedbackAPI: jest.fn(),
}));

import { askQuestionAPI, sendFeedbackAPI } from '../utils/api';

// Helper test component to expose state/actions easily
function Harness() {
  const { state, actions } = useQA();
  return (
    <div>
      <div data-testid="question">{state.question}</div>
      <div data-testid="answer">{state.answer}</div>
      <div data-testid="loading">{String(state.loading)}</div>
      <div data-testid="error">{state.error || ''}</div>
      <div data-testid="history-count">{state.history.length}</div>
      <div data-testid="last-answer-id">{state.lastAnswerId || ''}</div>
      <div data-testid="feedback-status">{state.feedbackStatus || ''}</div>

      <button onClick={() => actions.setQuestion('Hello?')} aria-label="set-question">set</button>
      <button onClick={() => actions.ask(state.question)} aria-label="ask">ask</button>
      <button onClick={() => actions.clearHistory()} aria-label="clear-history">clearHistory</button>
      <button onClick={() => actions.dismissError()} aria-label="dismiss-error">dismissError</button>
      <button onClick={() => actions.sendFeedback('up')} aria-label="feedback-up">feedbackUp</button>
      <button onClick={() => actions.sendFeedback('down')} aria-label="feedback-down">feedbackDown</button>
      <button onClick={() => state.history[0] && actions.selectHistory(state.history[0].id)} aria-label="select-first">selectFirst</button>
    </div>
  );
}

function renderWithProvider(ui = <Harness />) {
  return render(<QAProvider>{ui}</QAProvider>);
}

describe('QAContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('setQuestion updates state', async () => {
    renderWithProvider();

    fireEvent.click(screen.getByLabelText('set-question'));
    // Wrap in waitFor to ensure state update is reflected in DOM
    await waitFor(() =>
      expect(screen.getByTestId('question')).toHaveTextContent('Hello?')
    );
  });

  test('ask with empty question sets validation error', async () => {
    renderWithProvider();

    // default question is empty, calling ask should error
    fireEvent.click(screen.getByLabelText('ask'));
    await waitFor(() =>
      expect(screen.getByTestId('error')).toHaveTextContent('Please enter a question.')
    );
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  test('ask success updates answer, history, lastAnswerId and clears error', async () => {
    askQuestionAPI.mockResolvedValueOnce({ answer: 'Answer A' });

    renderWithProvider();

    // Set a question then ask
    fireEvent.click(screen.getByLabelText('set-question'));
    fireEvent.click(screen.getByLabelText('ask'));

    // loading toggles true, then false after resolve
    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    await waitFor(() => expect(askQuestionAPI).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('answer')).toHaveTextContent('Answer A'));

    // history updated (wrap to allow reducer commit)
    await waitFor(() => expect(screen.getByTestId('history-count')).toHaveTextContent('1'));
    // lastAnswerId should be populated (non-empty string)
    await waitFor(() => expect(screen.getByTestId('last-answer-id').textContent).not.toBe(''));
    // error cleared
    await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent(''));
  });

  test('ask error populates error field and stops loading', async () => {
    askQuestionAPI.mockRejectedValueOnce(new Error('Network down'));

    renderWithProvider();

    fireEvent.click(screen.getByLabelText('set-question'));
    fireEvent.click(screen.getByLabelText('ask'));

    await waitFor(() => expect(askQuestionAPI).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByTestId('error')).toHaveTextContent('Network down')
    );
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  test('selectHistory loads question and answer', async () => {
    // seed one successful Q/A
    askQuestionAPI.mockResolvedValueOnce({ answer: 'History Answer' });

    renderWithProvider();

    // set and ask
    fireEvent.click(screen.getByLabelText('set-question'));
    fireEvent.click(screen.getByLabelText('ask'));
    await waitFor(() => expect(screen.getByTestId('answer')).toHaveTextContent('History Answer'));

    // Now pick from history
    const prevQuestion = screen.getByTestId('question').textContent;
    fireEvent.click(screen.getByLabelText('select-first'));

    // Picking should keep same values since we selected first item which matches
    await waitFor(() =>
      expect(screen.getByTestId('question').textContent).toBe(prevQuestion)
    );
    await waitFor(() =>
      expect(screen.getByTestId('answer')).toHaveTextContent('History Answer')
    );
  });

  test('clearHistory empties the history array', async () => {
    askQuestionAPI.mockResolvedValueOnce({ answer: 'Answer for history' });

    renderWithProvider();

    fireEvent.click(screen.getByLabelText('set-question'));
    fireEvent.click(screen.getByLabelText('ask'));
    await waitFor(() => expect(screen.getByTestId('history-count')).toHaveTextContent('1'));

    fireEvent.click(screen.getByLabelText('clear-history'));
    await waitFor(() => expect(screen.getByTestId('history-count')).toHaveTextContent('0'));
  });

  test('dismissError clears error', async () => {
    // cause an error
    askQuestionAPI.mockRejectedValueOnce(new Error('Boom'));

    renderWithProvider();

    fireEvent.click(screen.getByLabelText('set-question'));
    fireEvent.click(screen.getByLabelText('ask'));
    await waitFor(() =>
      expect(screen.getByTestId('error')).toHaveTextContent('Boom')
    );

    fireEvent.click(screen.getByLabelText('dismiss-error'));
    await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent(''));
  });

  test('sendFeedback success sets thanks status, error path sets error status', async () => {
    // need a successful answer first to get lastAnswerId populated
    askQuestionAPI.mockResolvedValueOnce({ answer: 'A1' });
    sendFeedbackAPI.mockResolvedValueOnce({ ok: true });

    renderWithProvider();

    fireEvent.click(screen.getByLabelText('set-question'));
    fireEvent.click(screen.getByLabelText('ask'));
    await waitFor(() => expect(screen.getByTestId('answer')).toHaveTextContent('A1'));

    // happy path
    fireEvent.click(screen.getByLabelText('feedback-up'));
    await waitFor(() => expect(sendFeedbackAPI).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByTestId('feedback-status')).toHaveTextContent('thanks')
    );

    // error path
    sendFeedbackAPI.mockRejectedValueOnce(new Error('fail'));
    fireEvent.click(screen.getByLabelText('feedback-down'));
    await waitFor(() => expect(sendFeedbackAPI).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.getByTestId('feedback-status')).toHaveTextContent('error')
    );
  });
});
