import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: '⊞', label: 'All Notes', path: '/' },
  { icon: '✦', label: 'New Note', path: '/notes/new' },
  { icon: '◈', label: 'Uploads', path: '/uploads' },
  { icon: '◻', label: 'Tasks', path: '/tasks' },
  { icon: '◉', label: 'Profile', path: '/profile' },
];

export default function Sidebar({ noteCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <p className="sidebar-label">WORKSPACE</p>
        {navItems.map(item => (
          <button
            key={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.path === '/' && noteCount > 0 && (
              <span className="sidebar-badge">{noteCount}</span>
            )}
          </button>
        ))}
      </div>
      <div className="sidebar-footer">
        <p className="sidebar-label">PKV v1.0</p>
      </div>
    </aside>
  );
}
