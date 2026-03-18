import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTask.css';

export default function AddTask() {
  const navigate = useNavigate();

  // Initialize tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [taskName, setTaskName] = useState('');
  const [pomodoroDuration, setPomodoroDuration] = useState(1); // Default to 1 minute
  const [editing, setEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);

  // Sync tasks to localStorage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Session check to ensure the user is still logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // We only run this logic if we're not already on the login page or dashboard
    if (!token || !user) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        navigate('/login'); // Navigate to login if no token or user found in localStorage
      }
    }
  }, [navigate]);

  const handleTaskInput = (e) => {
    setTaskName(e.target.value);
  };

  // Handle saving or updating a task
  const handleSaveTask = (e) => {
    // Prevent form refresh (and page reload)
    if (e) e.preventDefault();

    if (taskName.trim() === '') return; // Prevent saving empty tasks

    const newTask = { 
      id: Date.now(), 
      name: taskName, 
      pomodoroDuration: parseFloat(pomodoroDuration) 
    };

    let updatedTasks;
    if (editing) {
      updatedTasks = tasks.map((task, index) =>
        index === currentTaskIndex ? { ...task, name: taskName, pomodoroDuration: parseFloat(pomodoroDuration) } : task
      );
    } else {
      updatedTasks = [...tasks, newTask];
    }

    setTasks(updatedTasks);

    // Reset form fields after saving task
    setTaskName('');
    setPomodoroDuration(0.9);
    setEditing(false);
    setCurrentTaskIndex(null);
  };

  const handleCancel = (e) => {
    if (e) e.preventDefault();
    navigate('/dashboard'); // Navigate to the dashboard on cancel
  };

  const handleDeleteTask = (e) => {
  if (e) e.preventDefault();

  // Filter out the task at currentTaskIndex
  const updatedTasks = tasks.filter((_, index) => index !== currentTaskIndex);
  setTasks(updatedTasks);

  // Reset editing state and current task index
  setEditing(false);
  setCurrentTaskIndex(null);

  // Navigate to the dashboard after deletion
   // This should happen after the state update to reflect the changes
};

  // Function to handle task click (edit mode)
  const handleTaskClick = (index) => {
    const task = tasks[index];
    setTaskName(task.name);
    setPomodoroDuration(task.pomodoroDuration);
    setEditing(true);
    setCurrentTaskIndex(index);
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
    {tasks.map((task, index) => (
      <li key={task.id}>
        <span 
          style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
          onClick={() => handleTaskClick(index)}
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