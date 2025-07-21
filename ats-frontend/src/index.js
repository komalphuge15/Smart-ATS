// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';  // Make sure this file exists or comment it out
import App from './App';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
