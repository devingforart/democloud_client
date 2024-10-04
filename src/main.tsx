import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react'; // Auth0 Import
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter

import './index.css';

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      {/* Envolvemos la aplicación con Auth0Provider */}
      <Auth0Provider
        domain="dev-yfa8skztvtel11w1.us.auth0.com" // Reemplaza con tu dominio de Auth0
        clientId="I4XqKFBek7U8pPO3HEhmsSn8p6xF3hY3" // Reemplaza con el clientId de tu app Auth0
        authorizationParams={{
          redirect_uri: window.location.origin, // Cambia redirectUri a redirect_uri dentro de authorizationParams
        }}
      >
        {/* Envuelve la aplicación con BrowserRouter */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Auth0Provider>
    </React.StrictMode>
  );
} else {
  console.error("No se encontró el contenedor con id 'app'");
}
