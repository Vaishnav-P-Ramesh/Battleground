import { useState } from 'react';
import { Trophy, Crown } from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: 'AlgoKing', rating: 2450, wins: 156, losses: 12, streak: 15 },
  { rank: 2, name: 'ByteWizard', rating: 2380, wins: 142, losses: 18, streak: 8 },
  { rank: 3, name: 'CodeNinja_99', rating: 2310, wins: 130, losses: 22, streak: 12 },
  { rank: 4, name: 'StackOverflow', rating: 2200, wins: 118, losses: 30, streak: 5 },
  { rank: 5, name: 'RecursionQueen', rating: 2150, wins: 110, losses: 28, streak: 7 },
  { rank: 6, name: 'BinaryBoss', rating: 2080, wins: 98, losses: 34, streak: 3 },
  { rank: 7, name: 'DataDragon', rating: 1990, wins: 88, losses: 40, streak: 4 },
  { rank: 8, name: 'HeapHero', rating: 1920, wins: 82, losses: 42, streak: 2 },
  { rank: 42, name: 'Player_01', rating: 1500, wins: 24, losses: 8, streak: 5, isYou: true },
];

export default function Leaderboard() {
  const [filter, setFilter] = useState('global');
  const filters = ['global', 'weekly', 'friends'];

  return (
    <>
      <div className="page-header">
        <h2>
          <Trophy size={28} style={{ verticalAlign: 'middle', marginRight: 12, color: 'var(--accent)' }} />
          Leaderboard
        </h2>
        <div className="filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Rating</th>
              <th>W / L</th>
              <th>Win Rate</th>
              <th>Streak</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((player) => (
              <tr key={player.rank} className={player.isYou ? 'you-row' : ''}>
                <td>
                  {player.rank <= 3 ? (
                    <span className="text-warning" style={{ fontWeight: 800 }}>
                      <Crown size={16} className="crown" /> #{player.rank}
                    </span>
                  ) : (
                    <span>#{player.rank}</span>
                  )}
                </td>
                <td>
                  <div className="player-cell">
                    <div className="sm-avatar" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: player.isYou ? 'var(--accent-subtle)' : 'rgba(255,255,255,0.03)',
                      color: player.isYou ? 'var(--accent)' : 'var(--text-muted)',
                      fontWeight: 800, fontSize: '0.75rem'
                    }}>
                      {player.name[0]}
                    </div>
                    <span>{player.name} {player.isYou && <span className="accent">(You)</span>}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {player.rating}
                </td>
                <td>
                  <span className="win">{player.wins}</span>
                  {' / '}
                  <span className="loss">{player.losses}</span>
                </td>
                <td>{((player.wins / (player.wins + player.losses)) * 100).toFixed(1)}%</td>
                <td><span className="streak">🔥 {player.streak}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
