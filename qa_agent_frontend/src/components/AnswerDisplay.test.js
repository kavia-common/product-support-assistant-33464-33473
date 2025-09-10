import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnswerDisplay from './AnswerDisplay';
import QuestionInput from './QuestionInput';
import { QAProvider } from '../context/QAContext';

jest.mock('../utils/api', () => ({
  askQuestionAPI: jest.fn(),
  sendFeedbackAPI: jest.fn(),
}));
import { askQuestionAPI } from '../utils/api';

function renderFlow() {
  return render(
    <QAProvider>
      <QuestionInput />
      <AnswerDisplay />
    </QAProvider>
  );
}

describe('AnswerDisplay', () => {
  beforeEach(() => jest.clearAllMocks());

  test('shows placeholder when no answer', () => {
    renderFlow();
    expect(screen.getByText(/your answer will appear here/i)).toBeInTheDocument();
  });

  test('shows answer after successful ask', async () => {
    askQuestionAPI.mockResolvedValueOnce({ answer: 'The concise answer' });
    renderFlow();

    const input = screen.getByLabelText('Question');
    fireEvent.change(input, { target: { value: 'What is pricing?' } });
    const btn = screen.getByRole('button', { name: /ask/i });
    fireEvent.click(btn);

    await waitFor(() => expect(screen.getByText('The concise answer')).toBeInTheDocument());
    // aria-live polite on content
    const answerNode = screen.getByText('The concise answer');
    expect(answerNode).toHaveAttribute('aria-live', 'polite');
  });
});
