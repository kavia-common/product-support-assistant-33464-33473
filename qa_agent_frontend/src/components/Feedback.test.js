import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Feedback from './Feedback';
import QuestionInput from './QuestionInput';
import { QAProvider } from '../context/QAContext';

jest.mock('../utils/api', () => ({
  askQuestionAPI: jest.fn(),
  sendFeedbackAPI: jest.fn(),
}));
import { askQuestionAPI, sendFeedbackAPI } from '../utils/api';

function renderAppSlice() {
  return render(
    <QAProvider>
      <QuestionInput />
      <Feedback />
    </QAProvider>
  );
}

describe('Feedback', () => {
  beforeEach(() => jest.clearAllMocks());

  test('feedback buttons disabled initially and note shows Optional', () => {
    renderAppSlice();
    expect(screen.getByRole('button', { name: /thumbs up/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /thumbs down/i })).toBeDisabled();
    expect(screen.getByText(/optional/i)).toBeInTheDocument();
  });

  test('after getting an answer, feedback enabled and can send success', async () => {
    askQuestionAPI.mockResolvedValueOnce({ answer: 'Ans' });
    sendFeedbackAPI.mockResolvedValueOnce({ ok: true });

    renderAppSlice();

    const input = screen.getByLabelText('Question');
    fireEvent.change(input, { target: { value: 'Q1' } });
    fireEvent.click(screen.getByRole('button', { name: /ask/i }));

    // feedback should be enabled after answer arrives
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /thumbs up/i })).toBeEnabled();
      expect(screen.getByRole('button', { name: /thumbs down/i })).toBeEnabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /thumbs up/i }));
    await waitFor(() => expect(sendFeedbackAPI).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/thanks for the feedback/i)).toBeInTheDocument();
  });

  test('feedback error path shows error note', async () => {
    askQuestionAPI.mockResolvedValueOnce({ answer: 'Ans' });
    sendFeedbackAPI.mockRejectedValueOnce(new Error('nope'));

    renderAppSlice();

    const input = screen.getByLabelText('Question');
    fireEvent.change(input, { target: { value: 'Q1' } });
    fireEvent.click(screen.getByRole('button', { name: /ask/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /thumbs down/i })).toBeEnabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /thumbs down/i }));
    await waitFor(() => expect(sendFeedbackAPI).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/could not send feedback/i)).toBeInTheDocument();
  });
});
