import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import NoteCard from '../components/NoteCard';
import Pagination from '../components/Pagination';
import { notesApi } from '../Services/api';
import { useAuth } from '../context/AuthContext';

const PER_PAGE = 9;

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [searching, setSearching] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notesApi.list();
      setNotes(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleSearch = useCallback(async (q) => {
    setSearch(q);
    setPage(1);
    if (!q.trim()) {
      fetchNotes();
      return;
    }
    setSearching(true);
    try {
      const data = await notesApi.search(q);
      setNotes(data);
    } finally {
      setSearching(false);
    }
  }, [fetchNotes]);

  const handleDeleted = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const paged = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return notes.slice(start, start + PER_PAGE);
  }, [notes, page]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar noteCount={notes.length} />
        <main className="main-content">
          <div className="dashboard-header">
            <div>
              <h2 className="dashboard-greeting">{greeting()}, {user?.username}</h2>
              <p className="dashboard-meta">
                {notes.length === 0 ? 'No notes yet' : `${notes.length} note${notes.length !== 1 ? 's' : ''} in your vault`}
              </p>
            </div>
            <button className="btn-primary" onClick={() => navigate('/notes/new')}>
              + New Note
            </button>
          </div>

          <SearchBar onSearch={handleSearch} />

          {search && (
            <p className="search-status">
              {searching ? 'Searching…' : `${notes.length} result${notes.length !== 1 ? 's' : ''} for "${search}"`}
            </p>
          )}

          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="note-skeleton" />)}
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">◈</span>
              <h3>{search ? 'No notes match your search' : 'Your vault is empty'}</h3>
              <p>{search ? 'Try different keywords' : 'Create your first note to get started'}</p>
              {!search && (
                <button className="btn-primary" onClick={() => navigate('/notes/new')}>
                  Create a note
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="notes-grid">
                {paged.map(note => (
                  <NoteCard key={note.id} note={note} onDeleted={handleDeleted} />
                ))}
              </div>
              <Pagination page={page} total={notes.length} perPage={PER_PAGE} onChange={setPage} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
