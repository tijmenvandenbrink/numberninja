import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const gameApi = {
  startGame: async (difficulty, operationType) => {
    const response = await api.post('/game/start', null, {
      params: { difficulty, operation_type: operationType }
    });
    return response.data;
  },

  submitAnswer: async (sessionId, answer, timeTaken) => {
    const response = await api.post('/game/answer', {
      session_id: sessionId,
      answer: parseInt(answer),
      time_taken: timeTaken
    });
    return response.data;
  },

  endGame: async (sessionId) => {
    const response = await api.post(`/game/end/${sessionId}`);
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await api.get('/game/leaderboard');
    return response.data;
  },

  getNinjaBelt: async (xp) => {
    const response = await api.get(`/game/ninja-belt/${xp}`);
    return response.data;
  }
};