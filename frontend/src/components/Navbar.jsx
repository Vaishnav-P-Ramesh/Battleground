import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Swords, Trophy, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/profile', label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/dashboard')}>
        <Swords size={24} className="accent-icon" />
        <span>DSA BATTLEGROUND</span>
      </div>

      <div className="nav-links">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-btn${location.pathname === item.path ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="nav-user" onClick={() => navigate('/profile')}>
        <div className="user-info">
          <span className="username">{user?.username || 'Player'}</span>
          <span className="user-rating">⚡ {user?.rating || 1500}</span>
        </div>
        <div className="avatar">
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--accent-subtle)', color: 'var(--accent)', fontWeight: 800, fontSize: '1rem'
          }}>
            {(user?.username || 'P')[0].toUpperCase()}
          </div>
        </div>
      </div>
    </nav>
  );
}
