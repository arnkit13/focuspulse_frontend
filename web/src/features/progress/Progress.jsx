import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { toast } from '../../lib/toast.js';
import './Progress.css';

export default function Progress() {
  const navigate = useNavigate();
  const [historyTasks, setHistoryTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'today', 'week', 'month'

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getHistoryTasks();
      // Sort by most recently completed
      data.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
      setHistoryTasks(data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      toast('Failed to load history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      setHistoryTasks(historyTasks.filter(t => t.id !== taskId));
      toast('Task permanently deleted', 'success');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast('Error deleting task: ' + err.message, 'error');
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to delete ALL your task history? This cannot be undone.')) return;
    try {
      await api.deleteAllHistoryTasks();
      setHistoryTasks([]);
      toast('History cleared successfully', 'success');
    } catch (err) {
      console.error('Error clearing history:', err);
      toast('Error clearing history: ' + err.message, 'error');
    }
  };

  const filterTasks = () => {
    const now = new Date();
    return historyTasks.filter(task => {
      if (timeFilter === 'all') return true;
      if (!task.completedAt) return false;
      
      const taskDate = new Date(task.completedAt);
      const diffTime = Math.abs(now - taskDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (timeFilter === 'today') return diffDays <= 1 && now.getDate() === taskDate.getDate();
      if (timeFilter === 'week') return diffDays <= 7;
      if (timeFilter === 'month') return diffDays <= 30;
      return true;
    });
  };

  const filteredTasks = filterTasks();
  
  // Calculate stats
  const totalCompleted = filteredTasks.length;
  const totalMinutes = filteredTasks.reduce((acc, curr) => acc + (curr.pomodoroDuration || 0), 0);

  // A simple max value for the progress bar based on filter
  const maxGoal = timeFilter === 'today' ? 5 : timeFilter === 'week' ? 20 : timeFilter === 'month' ? 80 : Math.max(100, totalCompleted);
  const progressPercent = Math.min(100, (totalCompleted / maxGoal) * 100);

  return (
    <div className="progress-page">
      <header className="progress-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
        <h2>Your Progress & History</h2>
      </header>

      <main className="progress-main">
        {/* Statistics & Progress Bar */}
        <section className="stats-section">
          <div className="filter-buttons">
            <button className={timeFilter === 'today' ? 'active' : ''} onClick={() => setTimeFilter('today')}>Today</button>
            <button className={timeFilter === 'week' ? 'active' : ''} onClick={() => setTimeFilter('week')}>This Week</button>
            <button className={timeFilter === 'month' ? 'active' : ''} onClick={() => setTimeFilter('month')}>This Month</button>
            <button className={timeFilter === 'all' ? 'active' : ''} onClick={() => setTimeFilter('all')}>All Time</button>
          </div>

          <div className="stats-cards">
            <div className="stat-card">
              <h3>{totalCompleted}</h3>
              <p>Tasks Completed</p>
            </div>
            <div className="stat-card">
              <h3>{totalMinutes}</h3>
              <p>Focus Minutes</p>
            </div>
          </div>

          <div className="progress-container">
            <div className="progress-label">
              <span>Goal Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </section>

        {/* History List */}
        <section className="history-section">
          <div className="history-header">
            <h3>Completed Tasks</h3>
            {historyTasks.length > 0 && (
              <button className="clear-history-btn" onClick={handleClearHistory}>
                Clear All History
              </button>
            )}
          </div>

          {loading ? (
            <p className="history-empty">Loading history...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="history-empty">No completed tasks found for this period.</p>
          ) : (
            <ul className="history-list">
              {filteredTasks.map(task => (
                <li key={task.id} className="history-item">
                  <div className="history-info">
                    <span className="history-name">{task.name}</span>
                    <span className="history-meta">
                      {task.pomodoroDuration} mins • Completed {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                  <button className="history-delete-btn" onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
