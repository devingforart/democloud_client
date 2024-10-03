import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './index.css';

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("No se encontró el contenedor con id 'app'");
}
