import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function Matchmaking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [elapsed, setElapsed] = useState(0);
  const [matchFound, setMatchFound] = useState(false);
  const [countdown, setCountdown] = useState(100);
  const [opponent, setOpponent] = useState(null);
  const [battleId, setBattleId] = useState(null);
  const [searchStatus, setSearchStatus] = useState('Searching...');

  // Join matchmaking when component mounts and socket is connected
  useEffect(() => {
    if (!socket || !connected || !user) return;

    const playerData = {
      userId: user.id || `user_${Date.now()}`,
      username: user.username || 'Player_01',
      rating: user.rating || 1500
    };

    socket.emit('join_matchmaking', playerData);

    socket.on('match_found', (data) => {
      setOpponent(data.opponent);
      setBattleId(data.battleId);
      setMatchFound(true);
    });

    socket.on('searching', (data) => {
      setSearchStatus(data.message);
    });

    return () => {
      socket.off('match_found');
      socket.off('searching');
    };
  }, [socket, connected, user]);

  // Search timer
  useEffect(() => {
    if (matchFound) return;
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, [matchFound]);

  // Countdown after match found
  useEffect(() => {
    if (!matchFound) return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 0) { 
          navigate('/battle', { state: { battleId, opponent } }); 
          return 0; 
        }
        return c - 20;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [matchFound, navigate, battleId, opponent]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Show connection status while connecting
  if (!connected) {
    return (
      <div className="matchmaking-container">
        <div className="radar">
          <div className="radar-sweep"></div>
        </div>
        <h2 className="searching-text">CONNECTING...</h2>
        <p className="search-wait">Establishing connection to matchmaking server...</p>
        <div className="elapsed-time">0:00</div>
      </div>
    );
  }

  if (matchFound && opponent) {
    return (
      <div className="matchmaking-container">
        <div className="match-found-state">
          <h2 className="glow-text" style={{ fontSize: '1.8rem', letterSpacing: 5, marginBottom: 8 }}>MATCH FOUND</h2>
          <div className="versus-container">
            <div className="player-card you slide-in-left">
              <div className="large-avatar" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--accent-subtle)', color: 'var(--accent)', fontWeight: 800, fontSize: '2rem'
              }}>
                {(user?.username || 'P')[0]}
              </div>
              <span style={{ fontWeight: 700 }}>{user?.username || 'Player_01'}</span>
              <span className="accent" style={{ fontFamily: 'var(--font-mono)' }}>⚡ {user?.rating || 1500}</span>
            </div>
            <span className="vs-badge">VS</span>
            <div className="player-card opponent slide-in-right">
              <div className="large-avatar" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(248,113,113,0.1)', color: 'var(--loss)', fontWeight: 800, fontSize: '2rem',
                borderColor: 'var(--loss)'
              }}>
                {(opponent?.username || 'O')[0]}
              </div>
              <span style={{ fontWeight: 700 }}>{opponent?.username || 'Opponent'}</span>
              <span style={{ color: 'var(--loss)', fontFamily: 'var(--font-mono)' }}>⚡ {opponent?.rating || 1500}</span>
            </div>
          </div>
          <div className="countdown-bar">
            <div className="countdown-fill" style={{ width: `${countdown}%` }}></div>
          </div>
          <p className="battle-starts-text">Battle Starting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="matchmaking-container">
      <div className="radar">
        <div className="radar-sweep"></div>
        <div className="my-radar-avatar avatar">
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--accent-subtle)', color: 'var(--accent)', fontWeight: 800, fontSize: '1.2rem'
          }}>
            {(user?.username || 'P')[0]}
          </div>
        </div>
      </div>
      <h2 className="searching-text">SEARCHING</h2>
      <p className="search-wait">{searchStatus}</p>
      <div className="elapsed-time">{formatTime(elapsed)}</div>
      <button className="btn-secondary" onClick={() => {
        if (socket) socket.emit('cancel_matchmaking', user?.id || `user_${Date.now()}`);
        navigate('/dashboard');
      }}>Cancel</button>
    </div>
  );
}
