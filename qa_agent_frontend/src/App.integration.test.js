import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from './App';

jest.mock('./utils/api', () => ({
  askQuestionAPI: jest.fn(),
  sendFeedbackAPI: jest.fn(),
}));
import { askQuestionAPI, sendFeedbackAPI } from './utils/api';

describe('App integration flows', () => {
  beforeEach(() => jest.clearAllMocks());

  test('successful ask flow populates answer and history, then feedback success', async () => {
    askQuestionAPI.mockResolvedValueOnce({ answer: 'Integrated Answer' });
    sendFeedbackAPI.mockResolvedValueOnce({ ok: true });

    render(<App />);

    const input = screen.getByLabelText('Question');
    fireEvent.change(input, { target: { value: 'Integration Q' } });
    fireEvent.click(screen.getByRole('button', { name: /ask/i }));

    await waitFor(() => expect(screen.getByText('Integrated Answer')).toBeInTheDocument());

    // history list present
    const list = await screen.findByRole('list', { name: /query history/i });
    expect(within(list).getAllByRole('button').length).toBeGreaterThan(0);

    // feedback buttons enabled and send success
    const up = screen.getByRole('button', { name: /thumbs up/i });
    expect(up).toBeEnabled();
    fireEvent.click(up);
    await waitFor(() => expect(sendFeedbackAPI).toHaveBeenCalledTimes(1));
    // Wait for UI to reflect feedback success message
    await waitFor(() =>
      expect(screen.getByText(/thanks for the feedback/i)).toBeInTheDocument()
    );
  });

  test('error path shows notification and can dismiss', async () => {
    askQuestionAPI.mockRejectedValueOnce(new Error('Server unhappy'));

    render(<App />);

    const input = screen.getByLabelText('Question');
    fireEvent.change(input, { target: { value: 'Will error' } });
    fireEvent.click(screen.getByRole('button', { name: /ask/i }));

    // Wrap alert assertion to ensure UI update
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Server unhappy');

    fireEvent.click(screen.getByRole('button', { name: /dismiss error/i }));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });

  test('history selection loads previous Q/A into view', async () => {
    askQuestionAPI.mockResolvedValueOnce({ answer: 'A1' });

    render(<App />);

    const input = screen.getByLabelText('Question');
    fireEvent.change(input, { target: { value: 'Q1' } });
    fireEvent.click(screen.getByRole('button', { name: /ask/i }));

    const list = await screen.findByRole('list', { name: /query history/i });
    const items = within(list).getAllByRole('button');
    fireEvent.click(items[0]);

    await waitFor(() => expect(screen.getByText('A1')).toBeInTheDocument());
  });
});
