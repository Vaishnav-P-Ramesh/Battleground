import { NavLink, useNavigate } from 'react-router-dom';
import { Swords } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/dashboard')}>
        <Swords className="accent-icon" />
        <span>DSA BATTLEGROUND</span>
      </div>
      <div className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
          Dashboard
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
          Leaderboard
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
          Profile
        </NavLink>
      </div>
      <div className="nav-user" onClick={() => navigate('/profile')}>
        <div className="user-info">
          <span className="username">user_1337</span>
          <span className="user-rating">2150 ELO</span>
        </div>
        <div className="avatar">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user_1337&backgroundColor=1f2937" alt="avatar" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
