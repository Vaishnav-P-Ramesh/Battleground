import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Matchmaking() {
  const navigate = useNavigate();
  const [matchFound, setMatchFound] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let matchInterval;
    if (!matchFound) {
      matchInterval = setInterval(() => {
        setSearchTime((prev) => {
          const newTime = prev + 1;
          if (newTime > 2 + Math.random() * 3) {
            clearInterval(matchInterval);
            setMatchFound(true);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(matchInterval);
  }, [matchFound]);

  useEffect(() => {
    let countInterval;
    if (matchFound) {
      countInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countInterval);
            navigate('/battle');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countInterval);
  }, [matchFound, navigate]);

  const formatTime = (seconds) => {
    return `0:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <section id="matchmaking" className="screen active">
      <div className="matchmaking-container">
        {!matchFound ? (
          <div id="searching-state" className="searching-state">
            <div className="radar">
              <div className="radar-sweep"></div>
              <div className="avatar my-radar-avatar">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user_1337&backgroundColor=1f2937" alt="You" />
              </div>
            </div>
            <h2 className="searching-text">SEARCHING FOR OPPONENT<span className="dots">...</span></h2>
            <p className="search-wait">Estimated wait: 0:15</p>
            <p className="elapsed-time">{formatTime(searchTime)}</p>
            <button className="btn-secondary mt-4" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>
        ) : (
          <div id="match-found-state" className="match-found-state">
            <h2 className="glow-text">MATCH FOUND!</h2>
            <div className="versus-container">
              <div className="player-card you slide-in-left">
                <img className="large-avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=user_1337&backgroundColor=1f2937" alt="You" />
                <h3>user_1337</h3>
                <p className="accent">2150 ELO</p>
              </div>
              <div className="vs-badge pulse">VS</div>
              <div className="player-card opponent slide-in-right">
                <img className="large-avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=dark_coder&backgroundColor=ef4444" alt="Opponent" />
                <h3>dark_coder</h3>
                <p className="loss">2185 ELO</p>
              </div>
            </div>
            <div className="countdown-bar">
              <div className="countdown-fill" style={{ width: countdown === 3 ? '100%' : '0%', transition: 'width 3s linear' }}></div>
            </div>
            <p className="battle-starts-text">Battle begins in <span className="accent text-xl">{countdown}</span>...</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Matchmaking;
