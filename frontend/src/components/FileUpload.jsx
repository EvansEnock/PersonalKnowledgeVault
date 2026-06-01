import { useState, useRef } from 'react';
import { uploadsApi } from '../Services/api';

export default function FileUpload({ onUploaded }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const upload = async (file) => {
    setUploading(true);
    setError('');
    setResult(null);
    try {
      const r = await uploadsApi.upload(file);
      setResult(r);
      onUploaded?.(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) upload(file);
  };

  return (
    <div className="file-upload-container">
      <div
        className={`drop-zone ${dragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" hidden onChange={onFileChange}
          accept=".pdf,.txt,.md,.png,.jpg,.jpeg" />
        <div className="drop-zone-content">
          {uploading ? (
            <><div className="upload-spinner"></div><p>Uploading…</p></>
          ) : (
            <>
              <span className="drop-icon">⬆</span>
              <p className="drop-title">Drop a file or click to browse</p>
              <p className="drop-hint">PDF, TXT, MD, PNG, JPG · Max 10 MB</p>
            </>
          )}
        </div>
      </div>
      {result && (
        <div className="upload-success">
          <span>✓</span> <strong>{result.original_filename}</strong> uploaded — note #{result.note_id} created
        </div>
      )}
      {error && <div className="upload-error">✕ {error}</div>}
    </div>
  );
}
