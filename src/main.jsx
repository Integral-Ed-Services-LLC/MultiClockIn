import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Wait for user data before rendering the app
function startAppWithUser(userData) {
  const root = createRoot(document.getElementById('root'));
  root.render(<App userData={userData} />);
}

// Listen for postMessage from parent
window.addEventListener('message', (event) => {
  if (event.data && (event.data.email || event.data.firstName)) {
    console.log('[ClockIn] Initializing app with user:', event.data);
    startAppWithUser(event.data);
  }
});
