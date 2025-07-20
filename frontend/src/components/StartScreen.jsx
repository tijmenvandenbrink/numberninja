import React, { useState } from 'react';
// import { motion } from 'framer-motion';
import { Play, Settings, Trophy } from 'lucide-react';

const StartScreen = ({ onStartGame }) => {
  const [difficulty, setDifficulty] = useState('easy');
  const [operationType, setOperationType] = useState('addition_subtraction');

  const difficultyOptions = [
    { value: 'easy', label: '🟢 White Belt', desc: 'Numbers 1-10' },
    { value: 'medium', label: '🟡 Yellow Belt', desc: 'Numbers 1-20' },
    { value: 'hard', label: '🟤 Brown Belt', desc: 'Numbers 1-50' }
  ];

  const operationOptions = [
    { value: 'addition_subtraction', label: '➕➖ Add & Subtract', desc: 'Basic operations' },
    { value: 'multiplication_division', label: '✖️➗ Multiply & Divide', desc: 'Advanced operations' }
  ];

  const handleStart = () => {
    onStartGame(difficulty, operationType);
  };

  return (
    <div className="start-screen">
      <motion.div
        className="title-section"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="game-title">
          <span className="ninja-emoji">🥷</span>
          Number Ninja
          <span className="ninja-emoji">🧮</span>
        </h1>
        <p className="subtitle">Master math with ninja speed!</p>
      </motion.div>

      <motion.div
        className="settings-panel"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="setting-group">
          <h3>
            <Settings className="icon" />
            Choose Your Training
          </h3>
          
          <div className="option-group">
            <label>Difficulty Level:</label>
            <div className="options">
              {difficultyOptions.map((option) => (
                <motion.button
                  key={option.value}
                  className={`option-btn ${difficulty === option.value ? 'selected' : ''}`}
                  onClick={() => setDifficulty(option.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="option-label">{option.label}</div>
                  <div className="option-desc">{option.desc}</div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <label>Operation Type:</label>
            <div className="options">
              {operationOptions.map((option) => (
                <motion.button
                  key={option.value}
                  className={`option-btn ${operationType === option.value ? 'selected' : ''}`}
                  onClick={() => setOperationType(option.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="option-label">{option.label}</div>
                  <div className="option-desc">{option.desc}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <motion.button
          className="start-btn"
          onClick={handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Play className="icon" />
          Start Training
        </motion.button>
      </motion.div>

      <motion.div
        className="info-panel"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="info-item">
          <Trophy className="icon" />
          <span>2-minute challenges</span>
        </div>
        <div className="info-item">
          <span>⚡</span>
          <span>Earn XP and unlock belts</span>
        </div>
        <div className="info-item">
          <span>🎯</span>
          <span>Track your progress</span>
        </div>
      </motion.div>
    </div>
  );
};

export default StartScreen;