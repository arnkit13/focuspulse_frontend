import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { toast } from '../lib/toast.js';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  // Initialize user from localStorage
  const getInitialUser = () => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  };

  const [user] = useState(getInitialUser);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [timer, setTimer] = useState(25 * 60); // Default time (Pomodoro: 25 minutes)
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('pomodoro'); // 'pomodoro', 'shortBreak', 'longBreak'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Store default times for each session type
  const sessionTimes = {
    pomodoro: 25 * 60,  // 25 minutes
    shortBreak: 5 * 60, // 5 minutes
    longBreak: 15 * 60, // 15 minutes
  };

  // Create a ref for the alarm sound
  const alarmSoundRef = useRef(null);

  // Initialize the audio object
  useEffect(() => {
    alarmSoundRef.current = new Audio('/alarm.mp3');
    alarmSoundRef.current.load(); // Preload the audio
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      navigate('/login');
    } else {
      api.getTasks()
        .then(data => setTasks(data))
        .catch(err => console.error('Error fetching tasks on dashboard:', err));
    }
  }, [navigate, user]);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 0) {
            clearInterval(interval);
            setIsActive(false);
            alarmSoundRef.current.play().catch((err) => console.log("Error playing sound:", err)); // Play alarm sound and handle errors
            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timer]);

  function handleStart() {
    setIsActive(true);
  }

  function handlePause() {
    setIsActive(false);
  }

  function handleReset() {
    setIsActive(false);
    // Reset timer to the specific session type time
    setTimer(sessionTimes[sessionType]); // Reset to the time corresponding to the current session type
    if (alarmSoundRef.current) {
      alarmSoundRef.current.pause(); // Stop the alarm sound
      alarmSoundRef.current.currentTime = 0; // Reset the sound to the beginning
    }
  }

  function switchSession(type) {
    setSessionType(type);
    setTimer(sessionTimes[type]); // Set the timer to the specific session type time
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const minsStr = minutes < 10 ? `0${minutes}` : minutes;
    const secStr = sec < 10 ? `0${sec}` : sec;
    return `${minsStr}:${secStr}`;
  };

  // Add Task Button Click Handler (Navigate to Add Task Page)
  const handleAddTaskClick = () => {
    navigate('/add-task'); // Navigate to Add New Task screen
  };

  // Navigate to Profile Page
  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigateProfile = () => {
    navigate('/profile');
  };

  const handleNavigateSettings = () => {
    navigate('/settings');
  };

  const handleNavigateProgress = () => {
    navigate('/progress');
  };

  const handleTaskSelect = (task) => {
    setCurrentTask(task);
    setSessionType('pomodoro');
    setTimer(task.pomodoroDuration * 60);
    setIsActive(false);
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      if (currentTask && currentTask.id === taskId) {
        setCurrentTask(null);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      toast('Error deleting task: ' + err.message, 'error');
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      await api.completeTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      if (currentTask && currentTask.id === taskId) {
        setCurrentTask(null);
      }
      toast('Task marked as completed!', 'success');
    } catch (err) {
      console.error('Error completing task:', err);
      toast('Error completing task: ' + err.message, 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="header-left">
          <span className="dash-logo">FocusPulse</span>
        </div>
        <div className="profile-container">
          <div className="profile-wrapper">
            {/* Profile Card with Image and Name/Email */}
            <div className="profile-card" onClick={handleProfileClick}>
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="profile-pic"
                />
              ) : (
                <div className="profile-pic-placeholder">👤</div>
              )}
              <div className="profile-info">
                <p>{user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}</p>
              </div>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="profile-dropdown">
                <button onClick={handleNavigateProgress}>📊 Progress & History</button>
                <button onClick={handleNavigateProfile}>👤 Edit Profile</button>
                <button onClick={handleNavigateSettings}>⚙️ Settings</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="dash-main">
        <h2>Welcome, {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}</h2>

        <div className="session-buttons">
          <button
            className={sessionType === 'pomodoro' ? 'active' : ''}
            onClick={() => switchSession('pomodoro')}
          >
            POMODORO
          </button>
          <button
            className={sessionType === 'shortBreak' ? 'active' : ''}
            onClick={() => switchSession('shortBreak')}
          >
            SHORT BREAK
          </button>
          <button
            className={sessionType === 'longBreak' ? 'active' : ''}
            onClick={() => switchSession('longBreak')}
          >
            LONG BREAK
          </button>
        </div>

        <div className="timer-display">
          <p>{formatTime(timer)}</p>
        </div>

        <div className="control-buttons">
          {isActive ? (
            <button onClick={handlePause} className="control-btn">PAUSE</button>
          ) : (
            <button onClick={handleStart} className="control-btn">START</button>
          )}
          <button onClick={handleReset} className="control-btn">RESET</button>
        </div>

        {/* Add Task Button */}
        <div className="add-task">
          <button className="add-task-btn" onClick={handleAddTaskClick}>+ Add Task</button>
        </div>

        {/* Task List Section */}
        <div className="dashboard-tasks">
          <h3>Your Tasks</h3>
          {currentTask && (
            <p className="task-working-on">
              Working on: {currentTask.name} ({currentTask.pomodoroDuration} mins)
            </p>
          )}
          {tasks.length === 0 ? (
            <p className="task-empty">No tasks yet. Click "+ Add Task" to create one!</p>
          ) : (
            <ul className="task-list-ul">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`task-list-item ${currentTask && currentTask.id === task.id ? 'active-task' : ''}`}
                >
                  <div
                    className="task-content"
                    onClick={() => handleTaskSelect(task)}
                  >
                    <span className="task-title">{task.name}</span>
                    <span className="task-duration">{task.pomodoroDuration} minutes</span>
                  </div>
                  <div className="task-actions">
                    <button
                      className="task-complete-btn"
                      onClick={(e) => { e.stopPropagation(); handleTaskComplete(task.id); }}
                    >
                      Finish
                    </button>
                    <button
                      className="task-delete-btn"
                      onClick={(e) => { e.stopPropagation(); handleTaskDelete(task.id); }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}