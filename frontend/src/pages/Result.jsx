import { useNavigate, useLocation } from 'react-router-dom';
import { Swords } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isVictory = location.state?.result === 'victory';
  const yourTestCases = location.state?.yourTestCases || 0;
  const opponentTestCases = location.state?.opponentTestCases || 0;
  const timeTaken = location.state?.timeTaken || '00:00';
  const opponentName = location.state?.opponentName || 'Opponent';
  const currentRating = location.state?.currentRating ?? user?.rating ?? 1500;
  const ratingChange = isVictory ? 25 : -15;
  const updatedRating = currentRating + ratingChange;

  return (
    <div className="result-container">
      <h1 className={`result-title ${isVictory ? 'victory' : 'defeat'}`}>
        {isVictory ? '🏆 VICTORY' : '💔 DEFEAT'}
      </h1>

      <div className="rating-change">
        <span className="old-rating">{currentRating}</span>
        <span>→</span>
        <span className="new-rating">{updatedRating}</span>
        <span className={`points-earned ${isVictory ? 'win' : 'loss'}`}>
          {ratingChange > 0 ? `+${ratingChange}` : ratingChange}
        </span>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-box">
          <span className="label">Time</span>
          <span className="value">{timeTaken}</span>
