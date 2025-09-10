import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notification from './Notification';
import QuestionInput from './QuestionInput';
import { QAProvider } from '../context/QAContext';

jest.mock('../utils/api', () => ({
  askQuestionAPI: jest.fn(),
  sendFeedbackAPI: jest.fn(),
}));
import { askQuestionAPI } from '../utils/api';

function renderWithProvider() {
  return render(
    <QAProvider>
      <Notification />
      <QuestionInput />
    </QAProvider>
  );
}

describe('Notification', () => {
  beforeEach(() => jest.clearAllMocks());

  test('hidden initially (no alert role)', () => {
    renderWithProvider();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('shows on ask error and can be dismissed', async () => {
    askQuestionAPI.mockRejectedValueOnce(new Error('Backend error'));
    renderWithProvider();

    const input = screen.getByLabelText('Question');
    fireEvent.change(input, { target: { value: 'Q causing error' } });
    fireEvent.click(screen.getByRole('button', { name: /ask/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Backend error');

    fireEvent.click(screen.getByRole('button', { name: /dismiss error/i }));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });
});
