import { useLocation, useNavigate } from 'react-router-dom';
import { Home, RotateCcw, ArrowRight } from 'lucide-react';

function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const isWin = location.state?.isWin ?? true;
  const timeTaken = location.state?.timeTaken ?? "12:34";

  return (
    <section id="result" className="screen active">
      <div className="result-container">
        <h1 className={`result-title ${isWin ? 'victory' : 'defeat'}`}>
          {isWin ? 'VICTORY' : 'DEFEAT'}
        </h1>
        <div className="rating-change">
            <span className="old-rating">2150</span>
            <ArrowRight />
            <span className="new-rating">{isWin ? '2165' : '2138'}</span>
            <span className={`points-earned ${isWin ? 'win' : 'loss'}`}>
              ({isWin ? '+15' : '-12'})
            </span>
        </div>
        
        <div className="stats-grid mt-4">
            <div className="glass-card stat-box">
                <span className="label">Time Taken</span>
                <span className="value">{timeTaken}</span>
            </div>
            <div className="glass-card stat-box">
                <span className="label">Accuracy</span>
                <span className="value">100%</span>
            </div>
            <div className="glass-card stat-box">
                <span className="label">Attempts</span>
                <span className="value">1</span>
            </div>
        </div>
        
        <div className="action-buttons mt-4" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
              <Home size={18} /> Home
            </button>
            <button className="btn-primary" onClick={() => navigate('/matchmaking')}>
              <RotateCcw size={18} /> Play Again
            </button>
        </div>
      </div>
    </section>
  );
}

export default Result;
