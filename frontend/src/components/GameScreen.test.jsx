import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameScreen from './GameScreen';
import { gameApi } from '../api/gameApi';

vi.mock('../api/gameApi', () => ({
  gameApi: {
    startGame: vi.fn(),
    submitAnswer: vi.fn(),
    endGame: vi.fn()
  }
}));

const START_RESPONSE = { session_id: 's1', problem: '2 + 2', time_remaining: 120 };

beforeEach(() => {
  vi.clearAllMocks();
  gameApi.startGame.mockResolvedValue(START_RESPONSE);
});

afterEach(() => {
  vi.useRealTimers();
});

function renderGame() {
  return render(
    <GameScreen difficulty="easy" operationType="addition_subtraction" onGameEnd={vi.fn()} />
  );
}

async function mountAndGetInput() {
  renderGame();
  return screen.findByPlaceholderText(/type answer/i);
}

describe('GameScreen answer feedback (non-blocking)', () => {
  it('never disables the input after answering', async () => {
    gameApi.submitAnswer.mockResolvedValue({
      is_correct: true, correct_answer: null, next_problem: '3 + 3',
      score: 1, total_problems: 1, time_remaining: 119
    });
    const input = await mountAndGetInput();
    const user = userEvent.setup();

    await user.type(input, '4{Enter}');
    await waitFor(() => expect(gameApi.submitAnswer).toHaveBeenCalledTimes(1));

    expect(input).not.toBeDisabled();
  });

  it('allows rapid back-to-back submits, each hitting the API and advancing the problem', async () => {
    gameApi.submitAnswer
      .mockResolvedValueOnce({ is_correct: true, correct_answer: null, next_problem: 'P2', score: 1, total_problems: 1, time_remaining: 119 })
      .mockResolvedValueOnce({ is_correct: true, correct_answer: null, next_problem: 'P3', score: 2, total_problems: 2, time_remaining: 118 })
      .mockResolvedValueOnce({ is_correct: true, correct_answer: null, next_problem: 'P4', score: 3, total_problems: 3, time_remaining: 117 });

    const input = await mountAndGetInput();
    const user = userEvent.setup();

    await user.type(input, '1{Enter}');
    await waitFor(() => expect(gameApi.submitAnswer).toHaveBeenCalledTimes(1));
    await user.type(input, '2{Enter}');
    await waitFor(() => expect(gameApi.submitAnswer).toHaveBeenCalledTimes(2));
    await user.type(input, '3{Enter}');
    await waitFor(() => expect(gameApi.submitAnswer).toHaveBeenCalledTimes(3));

    expect(await screen.findByText('P4 = ?')).toBeInTheDocument();
  });

  it('shows correct feedback then clears it back to the idle hint', async () => {
    gameApi.submitAnswer.mockResolvedValue({
      is_correct: true, correct_answer: null, next_problem: '5 + 5',
      score: 1, total_problems: 1, time_remaining: 119
    });

    const input = await mountAndGetInput();
    const user = userEvent.setup();
    await user.type(input, '4{Enter}');

    expect(await screen.findByTestId('answer-feedback')).toHaveTextContent(/excellent/i);

    await waitFor(() => expect(screen.queryByTestId('answer-feedback')).toBeNull(), {
      timeout: 2000
    });
    expect(screen.getByText('Enter')).toBeInTheDocument();
  });

  it('shows the correct answer in feedback when the submission is wrong', async () => {
    gameApi.submitAnswer.mockResolvedValue({
      is_correct: false, correct_answer: 42, next_problem: '6 + 6',
      score: 0, total_problems: 1, time_remaining: 119
    });

    const input = await mountAndGetInput();
    const user = userEvent.setup();
    await user.type(input, '1{Enter}');

    const feedbackEl = await screen.findByTestId('answer-feedback');
    expect(feedbackEl).toHaveTextContent('42');
  });

  it('never renders the old blocking overlay and keeps the problem/input visible during feedback', async () => {
    gameApi.submitAnswer.mockResolvedValue({
      is_correct: true, correct_answer: null, next_problem: '7 + 7',
      score: 1, total_problems: 1, time_remaining: 119
    });

    const { container } = renderGame();
    const input = await screen.findByPlaceholderText(/type answer/i);
    const user = userEvent.setup();
    await user.type(input, '4{Enter}');

    await screen.findByTestId('answer-feedback');

    expect(container.querySelector('.feedback')).toBeNull();
    expect(screen.getByPlaceholderText(/type answer/i)).toBeInTheDocument();
    expect(screen.getByText('7 + 7 = ?')).toBeInTheDocument();
  });

  it('submits again on Enter even while previous feedback is still visible', async () => {
    gameApi.submitAnswer
      .mockResolvedValueOnce({ is_correct: true, correct_answer: null, next_problem: 'Q2', score: 1, total_problems: 1, time_remaining: 119 })
      .mockResolvedValueOnce({ is_correct: true, correct_answer: null, next_problem: 'Q3', score: 2, total_problems: 2, time_remaining: 118 });

    const input = await mountAndGetInput();
    const user = userEvent.setup();

    await user.type(input, '1{Enter}');
    await waitFor(() => expect(gameApi.submitAnswer).toHaveBeenCalledTimes(1));
    // Feedback from the first submit is still visible (750ms timeout not elapsed, real timers).
    expect(await screen.findByTestId('answer-feedback')).toBeInTheDocument();

    await user.type(input, '2{Enter}');
    await waitFor(() => expect(gameApi.submitAnswer).toHaveBeenCalledTimes(2));
  });
});
