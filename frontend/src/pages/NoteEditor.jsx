import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { notesApi } from '../Services/api';

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    notesApi.get(id)
      .then(n => setForm({ title: n.title, content: n.content }))
      .catch(() => setError('Note not found'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required');
      return;
    }
    setSaving(true); setError('');
    try {
      if (isEdit) {
        await notesApi.update(id, form);
      } else {
        const n = await notesApi.create(form);
        navigate(`/notes/${n.id}`, { replace: true });
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this note permanently?')) return;
    await notesApi.delete(id);
    navigate('/');
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <div className="editor-header">
            <button className="btn-ghost" onClick={() => navigate(-1)}>← Back</button>
            <h2 className="page-title">{isEdit ? 'Edit Note' : 'New Note'}</h2>
          </div>
          {loading ? <div className="loading-center">Loading…</div> : (
            <form onSubmit={handleSave} className="editor-form">
              <div className="field">
                <label className="field-label">Title</label>
                <input
                  className="field-input field-input-lg"
                  type="text"
                  placeholder="Note title…"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required autoFocus
                />
              </div>
              <div className="field field-grow">
                <label className="field-label">Content</label>
                <textarea
                  className="field-textarea"
                  placeholder="Start writing…"
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  required
                />
              </div>
              {error && <div className="form-error">{error}</div>}
              {saved && <div className="form-success">✓ Saved</div>}
              <div className="editor-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create note'}
                </button>
                {isEdit && (
                  <button type="button" className="btn-danger" onClick={handleDelete}>
                    Delete note
                  </button>
                )}
                <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
