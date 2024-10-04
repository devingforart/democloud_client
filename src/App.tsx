import { useState } from 'react';
import { AppBarComponent } from './components/AppBarComponent';
import { LandingPage } from './components/LandingPage';
import AudioComponent from './components/AudioComponent';
import { useAuth0 } from '@auth0/auth0-react';

const App = () => {
  const { isAuthenticated } = useAuth0();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <div>
      <AppBarComponent onUploadClick={handleOpenModal} />
      <div style={{ marginTop: '70px' }}>
        {/* Si el usuario no está autenticado, mostramos la landing page */}
        {!isAuthenticated ? (
          <LandingPage />
        ) : (
          // Si está autenticado, mostramos el componente de subir audio
          <AudioComponent openModal={openModal} handleCloseModal={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

export default App;
