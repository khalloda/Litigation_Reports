/**
 * Simple Main Entry Point
 *
 * A simplified version of the main.tsx for testing the authentication system.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App-simple';
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
