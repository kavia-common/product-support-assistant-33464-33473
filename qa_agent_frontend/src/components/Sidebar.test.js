import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import Sidebar from './Sidebar';
import QuestionInput from './QuestionInput';
import AnswerDisplay from './AnswerDisplay';
import { QAProvider } from '../context/QAContext';

jest.mock('../utils/api', () => ({
  askQuestionAPI: jest.fn(),
  sendFeedbackAPI: jest.fn(),
}));
import { askQuestionAPI } from '../utils/api';

function renderAppSlice() {
  return render(
    <QAProvider>
      <Sidebar />
      <QuestionInput />
      <AnswerDisplay />
    </QAProvider>
  );
}

describe('Sidebar', () => {
  beforeEach(() => jest.clearAllMocks());

  test('shows empty state initially and hides clear button', () => {
    renderAppSlice();
    expect(screen.getByText(/no recent queries yet/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /clear history/i })).not.toBeInTheDocument();
  });

  test('populates history after ask; clear button appears; selecting loads QA', async () => {
    askQuestionAPI.mockResolvedValueOnce({ answer: 'A for Q1' });
    renderAppSlice();

    const input = screen.getByLabelText('Question');
    fireEvent.change(input, { target: { value: 'Q1' } });
    fireEvent.click(screen.getByRole('button', { name: /ask/i }));

    // history list appears
    const list = await screen.findByRole('list', { name: /query history/i });
    const items = within(list).getAllByRole('button');
    expect(items.length).toBeGreaterThanOrEqual(1);

    // clear button visible
    expect(screen.getByRole('button', { name: /clear history/i })).toBeInTheDocument();

    // select the first history item; AnswerDisplay should show the same answer
    fireEvent.click(items[0]);
    await waitFor(() => expect(screen.getByText('A for Q1')).toBeInTheDocument());
  });

  test('clear history empties the list', async () => {
    askQuestionAPI.mockResolvedValue({ answer: 'Some A' });
    renderAppSlice();

    const input = screen.getByLabelText('Question');
    fireEvent.change(input, { target: { value: 'Qx' } });
    fireEvent.click(screen.getByRole('button', { name: /ask/i }));
    await screen.findByRole('list', { name: /query history/i });

    fireEvent.click(screen.getByRole('button', { name: /clear history/i }));
    expect(await screen.findByText(/no recent queries yet/i)).toBeInTheDocument();
  });
});
