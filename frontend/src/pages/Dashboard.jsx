import { useNavigate } from 'react-router-dom';
import { BarChart2, Zap, Calendar, Activity } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <section id="dashboard" className="screen active">
      <div className="dashboard-grid">
        <div className="dash-left">
          <div className="glass-card stat-card profile-summary">
            <div className="card-header">
              <h3>Overview</h3>
              <BarChart2 />
            </div>
            <div className="stat-highlight">
              <span className="label">Global Rank</span>
              <span className="value accent">#42</span>
            </div>
            <div className="stat-row">
              <div className="stat-item">
                <span className="label">Wins</span>
                <span className="value win">142</span>
              </div>
              <div className="stat-item">
                <span className="label">Losses</span>
                <span className="value loss">38</span>
              </div>
              <div className="stat-item">
                <span className="label">Win Rate</span>
                <span className="value">78.8%</span>
              </div>
              <div className="stat-item">
                <span className="label">Streak</span>
                <span className="value streak">🔥 5</span>
              </div>
            </div>
          </div>
          
          <div className="glass-card start-battle-card">
            <div className="glowing-orb"></div>
            <h2>Ready for Combat?</h2>
            <p>Find an opponent of similar skill to test your coding limits.</p>
            <button className="btn-primary animate-pulse-btn" onClick={() => navigate('/matchmaking')}>
              <Zap /> FIND MATCH
            </button>
          </div>
        </div>

        <div className="dash-right">
          <div className="glass-card contests-card">
            <div className="card-header">
              <h3>Ongoing Contests</h3>
              <Calendar />
            </div>
            <div className="contest-list">
              <div className="contest-item live">
                <div className="c-info">
                  <h4>Weekly Byte #45</h4>
                  <span className="c-time"><span className="dot"></span>Live Now - 1h 20m left</span>
                </div>
                <button className="btn-secondary">Join</button>
              </div>
              <div className="contest-item live">
                <div className="c-info">
                  <h4>1v1 Blitz Tournament</h4>
                  <span className="c-time"><span className="dot"></span>Live Now - 5h left</span>
                </div>
                <button className="btn-secondary">Join</button>
              </div>
              <div className="contest-item">
                <div className="c-info">
                  <h4>Global Coding Clash</h4>
                  <span className="c-time">Starts in 2 days</span>
                </div>
                <button className="btn-secondary disabled">Wait</button>
              </div>
            </div>
          </div>
          
          <div className="glass-card recent-activity">
            <div className="card-header">
              <h3>Recent Matches</h3>
              <Activity />
            </div>
            <div className="activity-list">
              <div className="match-row win">
                <span className="m-result">VICTORY</span>
                <span className="m-op">vs. dark_coder</span>
                <span className="m-rating">+12</span>
              </div>
              <div className="match-row loss">
                <span className="m-result">DEFEAT</span>
                <span className="m-op">vs. algo_master</span>
                <span className="m-rating">-8</span>
              </div>
              <div className="match-row win">
                <span className="m-result">VICTORY</span>
                <span className="m-op">vs. bit_manip</span>
                <span className="m-rating">+15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
