import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

function App() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'results'
  const [gameSettings, setGameSettings] = useState({
    difficulty: 'easy',
    operationType: 'addition_subtraction'
  });
  const [gameResult, setGameResult] = useState(null);

  const handleStartGame = (difficulty, operationType) => {
    setGameSettings({ difficulty, operationType });
    setGameState('playing');
  };

  const handleGameEnd = (result) => {
    setGameResult(result);
    setGameState('results');
  };

  const handlePlayAgain = () => {
    setGameState('playing');
  };

  const handleMainMenu = () => {
    setGameState('start');
    setGameResult(null);
  };

  return (
    <div className="app">
      {gameState === 'start' && (
        <StartScreen onStartGame={handleStartGame} />
      )}
      
      {gameState === 'playing' && (
        <GameScreen
          difficulty={gameSettings.difficulty}
          operationType={gameSettings.operationType}
          onGameEnd={handleGameEnd}
        />
      )}
      
      {gameState === 'results' && gameResult && (
        <ResultScreen
          result={gameResult}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  );
}

export default App
