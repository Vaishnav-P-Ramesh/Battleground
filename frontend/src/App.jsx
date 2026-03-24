import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Matchmaking from './pages/Matchmaking';
import Battle from './pages/Battle';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/auth" replace />;
  return children;
}

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === '/' || location.pathname === '/auth';

  return (
    <div id="app">
      {!hideNav && <Navbar />}
      <main id={hideNav ? undefined : "main-content"}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/matchmaking" element={<ProtectedRoute><Matchmaking /></ProtectedRoute>} />
          <Route path="/battle" element={<ProtectedRoute><Battle /></ProtectedRoute>} />
          <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
