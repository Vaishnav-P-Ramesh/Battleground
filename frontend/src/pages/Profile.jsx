import { useAuth } from '../context/AuthContext';
import { Shield, Flame, Award, TrendingUp, Trophy, ChevronUp, ChevronDown } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  const matchHistory = [
    { result: 'win', opponent: 'CodeNinja_99', change: '+25', problem: 'Two Sum' },
    { result: 'win', opponent: 'AlgoMaster', change: '+18', problem: 'Valid Parentheses' },
    { result: 'loss', opponent: 'ByteWizard', change: '-12', problem: 'Merge Intervals' },
    { result: 'win', opponent: 'StackOverflow', change: '+22', problem: 'Binary Search' },
    { result: 'win', opponent: 'RecursionQueen', change: '+15', problem: 'Linked List Cycle' },
    { result: 'loss', opponent: 'DataDragon', change: '-10', problem: 'LRU Cache' },
  ];

  const barHeights = ['h-40', 'h-60', 'h-30', 'h-80', 'h-70', 'h-50', 'h-90', 'h-60', 'h-100', 'h-80', 'h-70', 'h-50'];

  return (
    <>
      <div className="glass-card profile-header">
        <div className="profile-main">
          <div className="huge-avatar" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', fontWeight: 900, fontSize: '2.5rem'
          }}>
            {(user?.username || 'P')[0]}
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: 8 }}>{user?.username || 'Player_01'}</h2>
            <div className="badges">
              <span className="badge"><Flame size={16} /> 5 Streak</span>
              <span className="badge"><Shield size={16} /> Silver</span>
              <span className="badge"><Award size={16} /> Top 10%</span>
            </div>
          </div>
        </div>
        <div className="profile-rank-info">
          <span className="rank-title">Rating</span>
          <span className="rank-score">
            <TrendingUp size={32} />
            {user?.rating || 1500}
          </span>
        </div>
      </div>

      <div className="profile-grid" style={{ marginTop: 32 }}>
        {/* Rating History */}
        <div className="glass-card">
          <div className="card-header">
            <h3>Rating History</h3>
            <TrendingUp />
          </div>
          <div className="mock-graph">
            {barHeights.map((h, i) => (
              <div key={i} className={`bar ${h}`}></div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>12 matches ago</span>
            <span>Now</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card">
          <div className="card-header">
            <h3>Quick Stats</h3>
            <Trophy />
          </div>
          <div className="stat-row" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="stat-item">
              <span className="label">Total Battles</span>
              <span className="value">32</span>
            </div>
            <div className="stat-item">
              <span className="label">Win Rate</span>
              <span className="value accent">75%</span>
            </div>
            <div className="stat-item" style={{ marginTop: 16 }}>
              <span className="label">Avg Solve Time</span>
              <span className="value">12:34</span>
            </div>
            <div className="stat-item" style={{ marginTop: 16 }}>
              <span className="label">Best Streak</span>
              <span className="value streak">🔥 8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Match History */}
      <div className="glass-card" style={{ marginTop: 32 }}>
        <div className="card-header">
          <h3>Match History</h3>
        </div>
        <div className="history-list">
          {matchHistory.map((match, i) => (
            <div key={i} className={`h-item ${match.result}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="h-icon">
                  {match.result === 'win' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                <div className="h-text">
                  <p>vs {match.opponent}</p>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{match.problem}</span>
                </div>
              </div>
              <span className={`h-score ${match.result === 'win' ? 'win' : 'loss'}`}>{match.change}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
