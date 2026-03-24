import { Zap, Flame, TrendingUp, BarChart, History, ArrowUp, ArrowDown } from 'lucide-react';

function Profile() {
  return (
    <section id="profile" className="screen active">
      <div className="profile-header glass-card">
          <div className="profile-main">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user_1337&backgroundColor=1f2937" alt="You" className="huge-avatar" />
              <div>
                  <h2>user_1337</h2>
                  <p className="text-secondary">Joined Jan 2026</p>
                  <div className="badges mt-2">
                      <span className="badge"><Zap className="accent" size={16} /> Fast Solver</span>
                      <span className="badge"><Flame className="win" size={16} /> 10 Win Streak</span>
                  </div>
              </div>
          </div>
          <div className="profile-rank-info">
              <span className="rank-title">Current Rating</span>
              <div className="rank-score accent">2150 <TrendingUp className="win" size={32} /></div>
          </div>
      </div>
      
      <div className="profile-grid mt-4">
          <div className="glass-card activity-graph">
              <div className="card-header">
                  <h3>Activity Graph</h3>
                  <BarChart />
              </div>
              <div className="mock-graph mt-2">
                  <div className="bar h-20"></div><div className="bar h-40"></div><div className="bar h-60"></div>
                  <div className="bar h-90"></div><div className="bar h-40"></div><div className="bar h-100"></div>
                  <div className="bar h-80"></div><div className="bar h-50"></div><div className="bar h-30"></div>
                  <div className="bar h-70"></div><div className="bar h-80"></div><div className="bar h-60"></div>
                  <div className="bar h-100"></div><div className="bar h-90"></div><div className="bar h-70"></div>
                  <div className="bar h-40"></div><div className="bar h-60"></div><div className="bar h-80"></div>
              </div>
          </div>
          <div className="glass-card match-history">
              <div className="card-header">
                  <h3>Match History</h3>
                  <History />
              </div>
              <div className="history-list mt-2">
                  <div className="h-item win">
                    <div className="h-icon"><ArrowUp size={18} /></div> 
                    <div className="h-text"><p>vs dark_coder</p><span className="text-secondary text-sm">Merge K Lists</span></div> 
                    <span className="h-score win">+15</span>
                  </div>
                  <div className="h-item loss">
                    <div className="h-icon"><ArrowDown size={18} /></div> 
                    <div className="h-text"><p>vs algo_master</p><span className="text-secondary text-sm">Dijkstra's Algo</span></div> 
                    <span className="h-score loss">-12</span>
                  </div>
                  <div className="h-item win">
                    <div className="h-icon"><ArrowUp size={18} /></div> 
                    <div className="h-text"><p>vs bit_hack</p><span className="text-secondary text-sm">Two Sum</span></div> 
                    <span className="h-score win">+8</span>
                  </div>
              </div>
          </div>
      </div>
    </section>
  );
}

export default Profile;
