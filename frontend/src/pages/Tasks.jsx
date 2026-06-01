import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { tasksApi } from '../Services/api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const done = filter === 'all' ? undefined : filter === 'done';
      setTasks(await tasksApi.list(done));
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const t = await tasksApi.create({ title: newTitle, description: newDesc || undefined });
      setTasks(prev => [t, ...prev]);
      setNewTitle(''); setNewDesc('');
    } finally { setAdding(false); }
  };

  const toggle = async (task) => {
    const updated = await tasksApi.update(task.id, { is_done: !task.is_done });
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
  };

  const remove = async (id) => {
    if (!confirm('Delete task?')) return;
    await tasksApi.delete(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const visible = tasks; // already filtered by API

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <div className="dashboard-header">
            <h2 className="page-title">Tasks</h2>
            <div className="filter-group">
              {['all','pending','done'].map(f => (
                <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={addTask} className="task-add-form">
            <input
              className="field-input"
              placeholder="New task title…"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <input
              className="field-input"
              placeholder="Description (optional)"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
            />
            <button type="submit" className="btn-primary" disabled={adding}>
              {adding ? 'Adding…' : 'Add task'}
            </button>
          </form>

          {loading ? <div className="loading-center">Loading…</div> : visible.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">◻</span>
              <h3>No tasks</h3>
              <p>Add a task to get started</p>
            </div>
          ) : (
            <div className="tasks-list">
              {visible.map(task => (
                <div key={task.id} className={`task-item ${task.is_done ? 'done' : ''}`}>
                  <button className="task-check" onClick={() => toggle(task)}>
                    {task.is_done ? '✓' : '○'}
                  </button>
                  <div className="task-body">
                    <p className="task-title">{task.title}</p>
                    {task.description && <p className="task-desc">{task.description}</p>}
                  </div>
                  <button className="task-delete" onClick={() => remove(task.id)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
