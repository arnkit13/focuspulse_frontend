import './toast.css';

export function toast(message, type = 'success') {
  // Check if container exists, if not create it
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Create the toast element
  const toastEl = document.createElement('div');
  toastEl.className = `toast ${type}`;
  
  // Create an icon or indicator based on type
  let icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'info') icon = 'ℹ️';

  toastEl.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  
  // Append to container
  container.appendChild(toastEl);

  // Remove the toast after the animation finishes (3s total)
  setTimeout(() => {
    if (toastEl.parentNode) {
      toastEl.parentNode.removeChild(toastEl);
    }
  }, 3000);
}
