import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
      <QuestionInput />
    </QAProvider>
  );
}

describe('QuestionInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and button; typing updates value', () => {
    renderWithProvider();
    const input = screen.getByLabelText('Question');
    const button = screen.getByRole('button', { name: /ask/i });
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'My question' } });
    expect(input).toHaveValue('My question');
  });

  test('click Ask triggers ask flow and shows loading state then resets', async () => {
    askQuestionAPI.mockResolvedValueOnce({ answer: 'Some answer' });
    renderWithProvider();

    const input = screen.getByLabelText('Question');
    fireEvent.change(input, { target: { value: 'Test Q' } });

    const btn = screen.getByRole('button', { name: /ask/i });
    fireEvent.click(btn);

    // While loading the button text becomes "Thinking…"
    expect(await screen.findByText('Thinking…')).toBeInTheDocument();

    await waitFor(() => expect(askQuestionAPI).toHaveBeenCalledWith('Test Q'));
    // After resolve, text should revert to "Ask"
    expect(await screen.findByRole('button', { name: /ask/i })).toBeInTheDocument();
  });

  test('pressing Enter submits', async () => {
    askQuestionAPI.mockResolvedValueOnce({ answer: 'Enter answer' });

    renderWithProvider();
    const input = screen.getByLabelText('Question');

    fireEvent.change(input, { target: { value: 'Q by enter' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(askQuestionAPI).toHaveBeenCalledTimes(1));
  });

  test('prevent empty submit by Enter (shows validation error via context)', async () => {
    // no resolve needed; ask will short-circuit
    renderWithProvider();
    const input = screen.getByLabelText('Question');

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    // The context notification handles error; here just ensure API not called
    await waitFor(() => expect(askQuestionAPI).toHaveBeenCalledTimes(0));
  });
});
