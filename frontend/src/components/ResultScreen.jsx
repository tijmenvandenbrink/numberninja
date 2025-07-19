import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Trophy, Zap, Target, Clock } from 'lucide-react';
import { gameApi } from '../api/gameApi';

const ResultScreen = ({ result, onPlayAgain, onMainMenu }) => {
  const [ninjaBelt, setNinjaBelt] = useState(null);

  useEffect(() => {
    fetchNinjaBelt();
  }, [result.xp_earned]);

  const fetchNinjaBelt = async () => {
    try {
      const beltInfo = await gameApi.getNinjaBelt(result.xp_earned);
      setNinjaBelt(beltInfo);
    } catch (error) {
      console.error('Failed to fetch ninja belt:', error);
    }
  };

  const getPerformanceMessage = () => {
    if (result.accuracy >= 90) return { emoji: '🌟', message: 'Ninja Master!' };
    if (result.accuracy >= 75) return { emoji: '🔥', message: 'Great Work!' };
    if (result.accuracy >= 60) return { emoji: '👍', message: 'Good Job!' };
    return { emoji: '💪', message: 'Keep Training!' };
  };

  const getBeltEmoji = (belt) => {
    const beltEmojis = {
      white: '⚪',
      yellow: '🟡',
      green: '🟢',
      brown: '🟤',
      black: '⚫',
      master: '🌟'
    };
    return beltEmojis[belt] || '⚪';
  };

  const performance = getPerformanceMessage();

  return (
    <div className="result-screen">
      <motion.div
        className="result-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="result-header">
          <motion.div
            className="performance-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="performance-emoji">{performance.emoji}</span>
            <h2>{performance.message}</h2>
          </motion.div>
        </div>

        <div className="stats-grid">
          <motion.div
            className="stat-card"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Target className="stat-icon" />
            <div className="stat-value">{result.score}</div>
            <div className="stat-label">Correct Answers</div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Zap className="stat-icon" />
            <div className="stat-value">{result.accuracy.toFixed(1)}%</div>
            <div className="stat-label">Accuracy</div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Clock className="stat-icon" />
            <div className="stat-value">{Math.floor(result.time_taken / 60)}:{(result.time_taken % 60).toString().padStart(2, '0')}</div>
            <div className="stat-label">Time Taken</div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Trophy className="stat-icon" />
            <div className="stat-value">+{result.xp_earned}</div>
            <div className="stat-label">XP Earned</div>
          </motion.div>
        </div>

        {ninjaBelt && (
          <motion.div
            className="ninja-belt-section"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="belt-info">
              <span className="belt-emoji">{getBeltEmoji(ninjaBelt.belt)}</span>
              <div className="belt-details">
                <div className="belt-name">{ninjaBelt.belt.charAt(0).toUpperCase() + ninjaBelt.belt.slice(1)} Belt</div>
                <div className="level">Level {ninjaBelt.level}</div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="action-buttons">
          <motion.button
            className="action-btn secondary"
            onClick={onMainMenu}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Main Menu
          </motion.button>

          <motion.button
            className="action-btn primary"
            onClick={onPlayAgain}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="icon" />
            Train Again
          </motion.button>
        </div>

        <motion.div
          className="motivational-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {result.accuracy >= 90 && "You're becoming a true Number Ninja! 🥷"}
          {result.accuracy >= 75 && result.accuracy < 90 && "Your ninja skills are improving! Keep practicing! 💪"}
          {result.accuracy >= 60 && result.accuracy < 75 && "Good effort! Practice makes perfect! 🎯"}
          {result.accuracy < 60 && "Every ninja starts somewhere. Keep training! 🌱"}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResultScreen;