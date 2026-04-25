import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Swords, TrendingUp, Target, Clock, Zap, Trophy, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <div className="dashboard-grid">
        {/* Stats Card */}
        <div className="glass-card">
          <div className="card-header">
            <h3>Your Stats</h3>
            <TrendingUp />
          </div>
          <div className="stat-highlight">
            <span className="label">Current Rating</span>
            <span className="value">{user?.rating || 1500}</span>
          </div>
          <div className="stat-row">
            <div className="stat-item">
              <span className="label">Wins</span>
              <span className="value win">24</span>
            </div>
            <div className="stat-item">
              <span className="label">Losses</span>
              <span className="value loss">8</span>
            </div>
            <div className="stat-item">
              <span className="label">Streak</span>
              <span className="value streak">🔥 5</span>
            </div>
            <div className="stat-item">
              <span className="label">Rank</span>
              <span className="value accent">#42</span>
            </div>
          </div>
        </div>

        {/* Contests Card */}
        <div className="glass-card">
          <div className="card-header">
            <h3>Upcoming Contests</h3>
            <Trophy />
          </div>
          <div className="contest-list">
            <div className="contest-item live">
              <div className="c-info">
                <h4>Weekly Showdown</h4>
                <span className="c-time"><span className="dot"></span> Live Now</span>
              </div>
              <button className="btn-secondary btn-sm" onClick={() => navigate('/matchmaking')}>
                Join <ChevronRight size={14} />
              </button>
            </div>
            <div className="contest-item">
              <div className="c-info">
                <h4>Algorithm Arena</h4>
                <span className="c-time"><Clock size={14} /> Starts in 2h</span>
              </div>
              <button className="btn-secondary btn-sm disabled">Soon</button>
            </div>
            <div className="contest-item">
              <div className="c-info">
                <h4>Data Structure Duel</h4>
                <span className="c-time"><Clock size={14} /> Tomorrow</span>
              </div>
              <button className="btn-secondary btn-sm disabled">Soon</button>
            </div>
          </div>
        </div>
      </div>

      {/* Start Battle */}
      <div className="glass-card start-battle-card">
        <div className="glowing-orb"></div>
        <h2>Ready for Battle?</h2>
        <p>Challenge a random opponent in a real-time coding duel. Solve problems faster to win rating points.</p>
        <button className="btn-primary animate-pulse-btn" onClick={() => navigate('/matchmaking')}>
          <Swords size={22} /> Find Opponent
        </button>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity glass-card" style={{ marginTop: 32 }}>
        <div className="card-header">
          <h3>Recent Matches</h3>
          <Target />
        </div>
        <div className="activity-list">
          <div className="match-row win">
            <span className="m-result">Victory</span>
            <span className="m-op">vs CodeNinja_99</span>
            <span className="m-rating">+25</span>
          </div>
          <div className="match-row win">
            <span className="m-result">Victory</span>
            <span className="m-op">vs AlgoMaster</span>
            <span className="m-rating">+18</span>
          </div>
          <div className="match-row loss">
            <span className="m-result">Defeat</span>
            <span className="m-op">vs ByteWizard</span>
            <span className="m-rating">-12</span>
          </div>
          <div className="match-row win">
            <span className="m-result">Victory</span>
            <span className="m-op">vs StackOverflow</span>
            <span className="m-rating">+22</span>
          </div>
        </div>
      </div>
    </>
  );
}
