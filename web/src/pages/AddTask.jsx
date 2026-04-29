import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { toast } from '../lib/toast.js';
import './AddTask.css';

export default function AddTask() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [pomodoroDuration, setPomodoroDuration] = useState(1); // Default to 1 minute
  const [editing, setEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await api.getTasks();
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    fetchTasks();
  }, []);

  // Session check to ensure the user is still logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleTaskInput = (e) => {
    setTaskName(e.target.value);
  };

  // Handle saving or updating a task
  const handleSaveTask = async (e) => {
    if (e) e.preventDefault();
    if (taskName.trim() === '') return; // Prevent saving empty tasks

    const taskData = { 
      name: taskName, 
      pomodoroDuration: parseFloat(pomodoroDuration) 
    };

    try {
      if (editing) {
        const updated = await api.updateTask(currentTaskId, taskData);
        setTasks(tasks.map((task) => (task.id === currentTaskId ? updated : task)));
      } else {
        const created = await api.createTask(taskData);
        setTasks([...tasks, created]);
      }

      // Reset form fields after saving task
      setTaskName('');
      setPomodoroDuration(1);
      setEditing(false);
      setCurrentTaskId(null);
      toast('Task saved successfully', 'success');
    } catch (err) {
      console.error('Error saving task:', err);
      toast('Error saving task: ' + err.message, 'error');
    }
  };

  const handleCancel = (e) => {
    if (e) e.preventDefault();
    navigate('/dashboard'); // Navigate to the dashboard on cancel
  };

  const handleDeleteTask = async (e) => {
    if (e) e.preventDefault();
    if (!currentTaskId) return;

    try {
      await api.deleteTask(currentTaskId);
      setTasks(tasks.filter((task) => task.id !== currentTaskId));
      
      setEditing(false);
      setCurrentTaskId(null);
      toast('Task deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast('Error deleting task: ' + err.message, 'error');
    }
  };

  // Function to handle task click (edit mode)
  const handleTaskClick = (task) => {
    setTaskName(task.name);
    setPomodoroDuration(task.pomodoroDuration);
    setEditing(true);
    setCurrentTaskId(task.id);
  };

  return (
    <div className="dashboard">
      <header className="dash-header">
        <span className="dash-logo">Add New Task</span>
        <button type="button" className="signout-btn" onClick={handleCancel}>Back</button>
      </header>

      <main className="dash-main">
        <h2>{editing ? 'Edit Task' : 'Add New Task'}</h2>

        {/* Using a div instead of a form prevents accidental "Enter" key reloads */}
        <div className="task-form">
          <input
            type="text"
            placeholder="What are you working on?"
            value={taskName}
            onChange={handleTaskInput}
          />

                    <div className="pomodoro-duration">
            <label>Pomodoro Duration (minutes):</label>
            <input
                type="number"
                value={pomodoroDuration}
                min="1"
                max="120"
                step="1"
                onChange={(e) => setPomodoroDuration(e.target.value)}
            />
            </div>

          <div className="modal-buttons">
            <button 
              type="button" 
              className="save-btn" 
              onClick={handleSaveTask}
            >
              {editing ? 'Update Task' : 'Save Task'}
            </button>
            
            {editing && (
              <button 
                type="button" 
                className="delete-btn" 
                onClick={handleDeleteTask}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Task List */}
        {/* Task List */}
<div className="task-list">
  <h3>Your Tasks</h3>
  <ul>
    {tasks.map((task) => (
      <li key={task.id}>
        <span 
          style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
          onClick={() => handleTaskClick(task)}
        >
          {task.name} - {task.pomodoroDuration} minutes {/* Corrected here */}
        </span>
      </li>
    ))}
  </ul>
</div>
      </main>
    </div>
  );
}