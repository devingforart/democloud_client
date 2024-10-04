import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom'; // Aquí ya se usa BrowserRouter

import './index.css';

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <Auth0Provider
        domain="dev-yfa8skztvtel11w1.us.auth0.com"
        clientId="I4XqKFBek7U8pPO3HEhmsSn8p6xF3hY3"
        authorizationParams={{ redirect_uri: window.location.origin }}
        cacheLocation="localstorage"
        useRefreshTokens={true}
      >
        {/* Solo un <BrowserRouter> en la jerarquía */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Auth0Provider>
    </React.StrictMode>
  );
} else {
  console.error("No se encontró el contenedor con id 'app'");
}
