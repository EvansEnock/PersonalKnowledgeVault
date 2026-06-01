import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { notesApi } from '../Services/api';

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export default function NoteView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    notesApi.get(id)
      .then(setNote)
      .catch(() => setError('Note not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="app-layout"><Navbar /><div className="app-body"><Sidebar /><main className="main-content loading-center">Loading…</main></div></div>
  );
  if (error) return (
    <div className="app-layout"><Navbar /><div className="app-body"><Sidebar /><main className="main-content"><div className="empty-state"><h3>{error}</h3><button className="btn-primary" onClick={() => navigate('/')}>Go back</button></div></main></div></div>
  );

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <div className="note-view-header">
            <button className="btn-ghost" onClick={() => navigate('/')}>← All Notes</button>
            <button className="btn-secondary" onClick={() => navigate(`/notes/${id}/edit`)}>Edit</button>
          </div>
          <article className="note-view">
            <h1 className="note-view-title">{note.title}</h1>
            <div className="note-view-meta">
              <span>Created {formatDate(note.created_at)}</span>
              {note.updated_at !== note.created_at && (
                <span>· Updated {formatDate(note.updated_at)}</span>
              )}
            </div>
            {note.summary && (
              <div className="note-summary">
                <div className="summary-label">AI Summary</div>
                <p>{note.summary}</p>
              </div>
            )}
            {note.file_path && (
              <div className="note-attachment">
                <span className="file-icon">◈</span>
                <span>Attachment: {note.file_path.split('/').pop()}</span>
              </div>
            )}
            <div className="note-content">
              {note.content.split('\n').map((line, i) =>
                line ? <p key={i}>{line}</p> : <br key={i} />
              )}
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
