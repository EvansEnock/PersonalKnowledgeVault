import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FileUpload from '../components/FileUpload';

export default function Uploads() {
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState([]);

  const handleUploaded = (result) => {
    setUploaded(prev => [result, ...prev]);
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <h2 className="page-title">Upload Files</h2>
          <p className="page-subtitle">Attach files to your vault — they become searchable notes automatically.</p>
          <FileUpload onUploaded={handleUploaded} />
          {uploaded.length > 0 && (
            <div className="upload-history">
              <h3 className="section-title">Uploaded this session</h3>
              {uploaded.map((r, i) => (
                <div key={i} className="upload-history-item">
                  <span className="file-icon">◈</span>
                  <span className="upload-filename">{r.original_filename}</span>
                  <span className="upload-size">{(r.size_bytes / 1024).toFixed(1)} KB</span>
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => navigate(`/notes/${r.note_id}`)}
                  >
                    View note →
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
