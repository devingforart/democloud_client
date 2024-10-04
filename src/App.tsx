import { useState } from 'react';
import { AppBarComponent } from './components/AppBarComponent';
import { LandingPage } from './components/LandingPage';
import AudioComponent from './components/AudioComponent';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route } from 'react-router-dom';
import DemoPage from './components/DemoPage';
import UploadedTracks from './components/UploadedTracks';
import AuthenticatedLandingPage from './components/AuthenticatedLandingPage';

const App = () => {
  const { isAuthenticated } = useAuth0(); // Control de autenticación
  const [openModal, setOpenModal] = useState(false); // Estado para controlar el modal

  // Funciones para abrir y cerrar el modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <div>
      {isAuthenticated && <AppBarComponent onUploadClick={handleOpenModal} />
      }
      <div style={isAuthenticated ? { marginTop: '70px' } : { marginTop: '-10px' }}>
        <Routes>
          {/* Mostrar la nueva landing page para usuarios autenticados */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <AuthenticatedLandingPage />
              ) : (
                <LandingPage />
              )
            }
          />
          {/* Solo se renderiza una vez */}
          <Route path="/my-tracks" element={<>  <AppBarComponent onUploadClick={handleOpenModal} /> <UploadedTracks /> </>} />
          <Route path="/demo/:demo_id" element={<DemoPage />} />
        </Routes>
      </div>

      {/* Modal de Subida de Archivos */}
      <AudioComponent openModal={openModal} handleCloseModal={handleCloseModal} />
    </div>
  );
};

export default App;
