export default function Pagination({ page, total, perPage = 9, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="pagination">
      <button className="page-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
      <button className="page-btn" disabled={page === pages} onClick={() => onChange(page + 1)}>›</button>
    </div>
  );
}
