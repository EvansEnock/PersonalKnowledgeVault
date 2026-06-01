import { useNavigate } from 'react-router-dom';
import { notesApi } from '../Services/api';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

export default function NoteCard({ note, onDeleted }) {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this note?')) return;
    await notesApi.delete(note.id);
    onDeleted?.(note.id);
  };

  const preview = note.summary || note.content;
  const words = preview.split(' ').slice(0, 20).join(' ');
  const snippet = words + (preview.split(' ').length > 20 ? '…' : '');

  return (
    <article className="note-card" onClick={() => navigate(`/notes/${note.id}`)}>
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>
        <span className="note-card-time">{timeAgo(note.updated_at)}</span>
      </div>
      <p className="note-card-snippet">{snippet}</p>
      {note.file_path && (
        <div className="note-card-file">
          <span className="file-icon">◈</span>
          <span>{note.file_path.split('/').pop()}</span>
        </div>
      )}
      <div className="note-card-footer">
        <button
          className="note-card-edit"
          onClick={(e) => { e.stopPropagation(); navigate(`/notes/${note.id}/edit`); }}
        >
          Edit
        </button>
        <button className="note-card-delete" onClick={handleDelete}>Delete</button>
      </div>
    </article>
  );
}
