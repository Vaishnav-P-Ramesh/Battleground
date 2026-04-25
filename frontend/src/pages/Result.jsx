import { useNavigate, useLocation } from 'react-router-dom';
import { Swords } from 'lucide-react';

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const isVictory = location.state?.result !== 'defeat';

  return (
    <div className="result-container">
      <h1 className={`result-title ${isVictory ? 'victory' : 'defeat'}`}>
        {isVictory ? 'VICTORY' : 'DEFEAT'}
      </h1>

      <div className="rating-change">
        <span className="old-rating">1475</span>
        <span>→</span>
        <span className="new-rating">1500</span>
        <span className={`points-earned ${isVictory ? 'win' : 'loss'}`}>
          {isVictory ? '+25' : '-15'}
        </span>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-box">
          <span className="label">Time</span>
          <span className="value">08:42</span>
        </div>
        <div className="glass-card stat-box">
          <span className="label">Problems Solved</span>
          <span className="value">2/3</span>
        </div>
        <div className="glass-card stat-box">
          <span className="label">Accuracy</span>
          <span className="value">85%</span>
        </div>
      </div>

      <div style={{ marginTop: 48, display: 'flex', gap: 16 }}>
        <button className="btn-primary" onClick={() => navigate('/matchmaking')}>
          <Swords size={20} /> Play Again
        </button>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          Dashboard
        </button>
      </div>
    </div>
  );
}
