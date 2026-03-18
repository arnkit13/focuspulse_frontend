import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [timer, setTimer] = useState(25 * 60); // Default time (Pomodoro: 25 minutes)
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('pomodoro'); // 'pomodoro', 'shortBreak', 'longBreak'

  // Store default times for each session type
  const sessionTimes = {
    pomodoro: 25 * 60,  // 25 minutes
    shortBreak: 5 * 60, // 5 minutes
    longBreak: 15 * 60, // 15 minutes
  };

  // Create a new audio object for the alarm sound
  const alarmSound = new Audio('/alarm.mp3');  // Make sure the sound file is placed in the public folder

  // Ensure audio plays after user interaction, handle errors
  alarmSound.load(); // Preload the audio

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (!token || !stored) {
      navigate('/login');
    } else {
      setUser(JSON.parse(stored));
    }
  }, [navigate]);

  function handleSignOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 0) {
            clearInterval(interval);
            setIsActive(false);
            alarmSound.play().catch((err) => console.log("Error playing sound:", err)); // Play alarm sound and handle errors
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
    alarmSound.pause(); // Stop the alarm sound
    alarmSound.currentTime = 0; // Reset the sound to the beginning
  }

  function switchSession(type) {
    setSessionType(type);
    setTimer(sessionTimes[type]); // Set the timer to the specific session type time
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? `0${sec}` : sec}`;
  };

  // Add Task Button Click Handler (Navigate to Add Task Page)
  const handleAddTaskClick = () => {
    navigate('/add-task'); // Navigate to Add New Task screen
  };

  // Navigate to Profile Page
  const handleProfileClick = () => {
    navigate('/profile');
  };

  if (!user) return null;

  return (
    <div className="dashboard">
      <header className="dash-header">
        <span className="dash-logo">FocusPulse</span>
        <div className="profile-container">
          {/* Profile Card with Image and Email */}
          <div className="profile-card" onClick={handleProfileClick}>
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="profile-pic"
              />
            ) : (
              <div className="profile-pic-placeholder">No Image</div>
            )}
            <div className="profile-info">
              <p>{user.email}</p> {/* Display email */}
            </div>
          </div>
          <button className="signout-btn" onClick={handleSignOut}>Sign out</button>
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
      </main>
    </div>
  );
}