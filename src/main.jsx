// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { seedDatabase } from './api/db.js';

// An async function to control the startup sequence
async function startApp() {
  // 1. Ensure the database is seeded before doing anything else
  await seedDatabase();

  // 2. Start the MSW worker if in development
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./api/browser');
    console.log("Starting MSW worker...");
    await worker.start();
  }
  
  // 3. Render the React application
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

// Start the application
startApp();