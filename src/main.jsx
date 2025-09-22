// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App.jsx';
import { seedDatabase } from './api/db.js';

async function startApp() {
  await seedDatabase();
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./api/browser');
    console.log("Starting MSW worker...");
    await worker.start();
  }
  
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
}

startApp();