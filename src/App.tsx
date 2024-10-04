import { useState } from 'react';
import { AppBarComponent } from './components/AppBarComponent';
import { LandingPage } from './components/LandingPage';
import AudioComponent from './components/AudioComponent';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route } from 'react-router-dom'; // Importa solo Routes y Route, sin BrowserRouter
import DemoPage from './components/DemoPage'; // Importa DemoPage

const App = () => {
  const { isAuthenticated } = useAuth0();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <div>
      <AppBarComponent onUploadClick={handleOpenModal} />
      <div style={{ marginTop: '70px' }}>
        {/* Definir las rutas de la aplicación */}
        <Routes>
          {/* Ruta principal: muestra la landing page o el componente de audio según la autenticación */}
          <Route
            path="/"
            element={!isAuthenticated ? <LandingPage /> : <AudioComponent openModal={openModal} handleCloseModal={handleCloseModal} />}
          />
          {/* Nueva ruta para mostrar la página del demo */}
          <Route path="/demo/:demo_id" element={<DemoPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
