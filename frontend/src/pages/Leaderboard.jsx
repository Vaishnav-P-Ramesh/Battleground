import { Crown } from 'lucide-react';

function Leaderboard() {
  return (
    <section id="leaderboard" className="screen active">
      <div className="page-header">
          <h2>Global Leaderboard</h2>
          <div className="filters">
              <button className="filter-btn active">All-Time</button>
              <button className="filter-btn">Weekly</button>
          </div>
      </div>
      <div className="table-container glass-card mt-4">
          <table className="leaderboard-table">
              <thead>
                  <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Rating</th>
                      <th>Wins</th>
                  </tr>
              </thead>
              <tbody>
                  <tr className="top-3 rank-1">
                      <td>#1</td>
                      <td className="player-cell">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=tourist" className="sm-avatar" alt="tourist" /> 
                        tourist <Crown className="crown text-warning" size={16} />
                      </td>
                      <td className="accent">3400</td>
                      <td>1432</td>
                  </tr>
                  <tr className="top-3 rank-2">
                      <td>#2</td>
                      <td className="player-cell">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=benq" className="sm-avatar" alt="benq" /> 
                        benq
                      </td>
                      <td className="accent">3250</td>
                      <td>1120</td>
                  </tr>
                  <tr className="top-3 rank-3">
                      <td>#3</td>
                      <td className="player-cell">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=radewoosh" className="sm-avatar" alt="radewoosh" /> 
                        radewoosh
                      </td>
                      <td className="accent">3100</td>
                      <td>980</td>
                  </tr>
                  <tr className="you-row">
                      <td>#42</td>
                      <td className="player-cell">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user_1337&backgroundColor=1f2937" className="sm-avatar" alt="You" /> 
                        user_1337
                      </td>
                      <td className="accent">2150</td>
                      <td>142</td>
                  </tr>
              </tbody>
          </table>
      </div>
    </section>
  );
}

export default Leaderboard;
