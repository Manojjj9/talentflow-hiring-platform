import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { seedDatabase } from './api/db.js';

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./api/browser');

  return worker.start();
}

// Seeding the database
seedDatabase();

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});