import { useState } from 'react';
import { AppBarComponent } from './components/AppBarComponent';
import AudioComponent from './components/AudioComponent';

const App = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <div>
      <AppBarComponent onUploadClick={handleOpenModal} />
      <div style={{ marginTop: '70px' }}>
        <AudioComponent openModal={openModal} handleCloseModal={handleCloseModal} />
      </div>
    </div>
  );
};

export default App;
