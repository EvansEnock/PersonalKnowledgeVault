import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NoteEditor from './pages/NoteEditor';
import NoteView from './pages/NoteView';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import Uploads from './pages/Uploads';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-full"><div className="loading-logo">◈</div></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-full"><div className="loading-logo">◈</div></div>;
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/notes/new" element={<ProtectedRoute><NoteEditor /></ProtectedRoute>} />
          <Route path="/notes/:id" element={<ProtectedRoute><NoteView /></ProtectedRoute>} />
          <Route path="/notes/:id/edit" element={<ProtectedRoute><NoteEditor /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/uploads" element={<ProtectedRoute><Uploads /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
