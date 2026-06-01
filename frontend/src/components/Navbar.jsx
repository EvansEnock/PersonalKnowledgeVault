import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <span className="navbar-icon">◈</span>
        <span className="navbar-title">Knowledge Vault</span>
      </div>
      <div className="navbar-right">
        {user && (
          <>
            <div className="navbar-user" onClick={() => navigate('/profile')}>
              <div className="avatar">{user.username[0].toUpperCase()}</div>
              <span className="username-text">{user.username}</span>
            </div>
            <button className="btn-ghost" onClick={handleLogout}>Sign out</button>
          </>
        )}
      </div>
    </nav>
  );
}
