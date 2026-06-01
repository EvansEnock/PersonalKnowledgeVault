import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../Services/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');

  if (!user) return null;

  const formatDate = (str) => new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <h2 className="page-title">Profile</h2>
          <div className="profile-grid">
            <div className="profile-card">
              <div className="profile-avatar">{user.username[0].toUpperCase()}</div>
              <div className="profile-info">
                <h3 className="profile-username">{user.username}</h3>
                {user.email && <p className="profile-email">{user.email}</p>}
                <p className="profile-since">Member since {formatDate(user.created_at)}</p>
                <div className="profile-badges">
                  <span className={`badge ${user.is_active ? 'badge-active' : 'badge-inactive'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Account Actions</h3>
              <p className="card-text">Signed in as <strong>{user.username}</strong></p>
              <button className="btn-danger" onClick={handleLogout}>Sign out</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
