import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Target, Award } from 'lucide-react';
import { gameApi } from '../api/gameApi';

const GameScreen = ({ difficulty, operationType, onGameEnd }) => {
  const [gameState, setGameState] = useState({
    sessionId: null,
    currentProblem: '',
    score: 0,
    totalProblems: 0,
    timeRemaining: 120,
    isLoading: true
  });
  
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // { isCorrect, correctAnswer, id }
  const [problemStartTime, setProblemStartTime] = useState(() => Date.now());
  const inputRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);
  const feedbackIdRef = useRef(0);
  const isSubmittingRef = useRef(false);

  useEffect(() => () => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
  }, []);

  const startGame = async () => {
    try {
      const response = await gameApi.startGame(difficulty, operationType);
      setGameState(prev => ({
        ...prev,
        sessionId: response.session_id,
        currentProblem: response.problem,
        timeRemaining: response.time_remaining,
        isLoading: false
      }));
      setProblemStartTime(Date.now());
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim() || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const timeTaken = (Date.now() - problemStartTime) / 1000;

    try {
      const response = await gameApi.submitAnswer(
        gameState.sessionId,
        userAnswer,
        timeTaken
      );

      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      const feedbackId = ++feedbackIdRef.current;
      setFeedback({
        isCorrect: response.is_correct,
        correctAnswer: response.correct_answer,
        id: feedbackId
      });

      setGameState(prev => ({
        ...prev,
        currentProblem: response.next_problem,
        score: response.score,
        totalProblems: response.total_problems,
        timeRemaining: response.time_remaining
      }));

      setUserAnswer('');
      setProblemStartTime(Date.now());

      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(current => (current && current.id === feedbackId ? null : current));
        feedbackTimeoutRef.current = null;
      }, 750);

    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const endGame = async () => {
    try {
      const result = await gameApi.endGame(gameState.sessionId);
      onGameEnd(result);
    } catch (error) {
      console.error('Failed to end game:', error);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  // Auto-focus input when component mounts and after feedback
  useEffect(() => {
    if (!gameState.isLoading && !feedback && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [gameState.isLoading, feedback]);

  // Keep focus on input field
  useEffect(() => {
    const handleFocusOut = () => {
      if (!feedback && inputRef.current) {
        setTimeout(() => {
          if (inputRef.current) inputRef.current.focus();
        }, 0);
      }
    };

    document.addEventListener('click', handleFocusOut);
    return () => document.removeEventListener('click', handleFocusOut);
  }, [feedback]);

  useEffect(() => {
    if (gameState.timeRemaining <= 0) {
      endGame();
    }
  }, [gameState.timeRemaining]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitAnswer();
    }
  };

  // Global keyboard handler for seamless gameplay
  useEffect(() => {
    const handleGlobalKeyPress = (e) => {
      // Only handle if game is active
      if (!gameState.isLoading) {
        // If it's a number or Enter, ensure input has focus
        if ((e.key >= '0' && e.key <= '9') || e.key === 'Enter' || e.key === 'Backspace' || e.key === '-') {
          if (inputRef.current && document.activeElement !== inputRef.current) {
            inputRef.current.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyPress);
    return () => document.removeEventListener('keydown', handleGlobalKeyPress);
  }, [gameState.isLoading]);

  // Imperative flash on input border when feedback arrives
  useEffect(() => {
    if (!feedback || !inputRef.current) return;
    const el = inputRef.current;
    const cls = feedback.isCorrect ? 'flash-correct' : 'flash-incorrect';
    el.classList.remove('flash-correct', 'flash-incorrect');
    void el.offsetWidth; // force reflow so animation restarts even for same outcome twice in a row
    el.classList.add(cls);
  }, [feedback]);

  if (gameState.isLoading) {
    return (
      <div className="game-screen loading">
        <div className="ninja-loading">🥷</div>
        <p>Loading your ninja training...</p>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="stat">
          <Clock className="icon" />
          <span className={gameState.timeRemaining <= 30 ? 'urgent' : ''}>
            {Math.floor(gameState.timeRemaining / 60)}:{(gameState.timeRemaining % 60).toString().padStart(2, '0')}
          </span>
        </div>
        
        <div className="stat">
          <Target className="icon" />
          <span>{gameState.score}/{gameState.totalProblems}</span>
        </div>
        
        <div className="stat">
          <Zap className="icon" />
          <span>{gameState.totalProblems > 0 ? Math.round((gameState.score / gameState.totalProblems) * 100) : 0}%</span>
        </div>
      </div>

      <motion.div 
        className="problem-container"
        key={gameState.currentProblem}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="ninja-avatar">🥷</div>
        <div className="problem">{gameState.currentProblem} = ?</div>
        
        <div className="answer-input">
          <input
            ref={inputRef}
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type answer and press Enter..."
            className="answer-field"
            autoFocus
            autoComplete="off"
          />
        </div>
      </motion.div>

      <div className="keyboard-hint-slot">
        <AnimatePresence mode="wait">
          {feedback ? (
            <motion.div
              key={`feedback-${feedback.id}`}
              className={`keyboard-hint feedback-text ${feedback.isCorrect ? 'correct' : 'incorrect'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              data-testid="answer-feedback"
            >
              {feedback.isCorrect ? (
                <span className="feedback-inline"><span className="emoji">✨</span> Excellent!</span>
              ) : (
                <span className="feedback-inline"><span className="emoji">💪</span> The answer was {feedback.correctAnswer}</span>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="hint-idle"
              className="keyboard-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              Press <kbd>Enter</kbd> to submit your answer
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${((120 - gameState.timeRemaining) / 120) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default GameScreen;