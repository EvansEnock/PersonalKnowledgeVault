import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setError(''); setLoading(true);
    try {
      await register({ username: form.username, email: form.email || undefined, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const f = (key) => ({ value: form[key], onChange: e => setForm(p => ({...p, [key]: e.target.value})) });

  return (
    <div className="auth-page">
      <div className="auth-bg"></div>
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">◈</span>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Start building your knowledge base</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label className="field-label">Username</label>
            <input className="field-input" type="text" placeholder="your_username" required autoFocus {...f('username')} />
          </div>
          <div className="field">
            <label className="field-label">Email <span className="optional">(optional)</span></label>
            <input className="field-input" type="email" placeholder="you@example.com" {...f('email')} />
          </div>
          <div className="field">
            <label className="field-label">Password</label>
            <input className="field-input" type="password" placeholder="Min. 6 characters" required {...f('password')} />
          </div>
          <div className="field">
            <label className="field-label">Confirm Password</label>
            <input className="field-input" type="password" placeholder="••••••••" required {...f('confirm')} />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="auth-switch">Have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
