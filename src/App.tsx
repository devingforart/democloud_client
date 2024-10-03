import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, Modal, Box, TextField, CircularProgress } from '@mui/material';
import { ClipLoader } from 'react-spinners';
import './app.css';

// Estilo para el modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
};

const AudioUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [uploadedTracks, setUploadedTracks] = useState<{ file_url: string, trackName: string }[]>([]);

  // Recuperar los tracks al cargar la página
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tracks');
        setUploadedTracks(response.data.map((track: any) => ({
          file_url: track.file_url,
          trackName: `${track.artist} - ${track.title}`,  // Ahora obtenemos el nombre correctamente
        })));
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    };

    fetchTracks();
  }, []);


  // Configuración para Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'audio/*': [] },
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    },
  });

  const handleCloseModal = () => setOpenModal(false);
  const handleOpenModal = () => setOpenModal(true);

  const onFileUpload = async () => {
    if (!selectedFile || !title || !artist) {
      setUploadStatus('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8080/upload?artist=${artist}&title=${title}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('File uploaded successfully!');
      setAudioUrl(`http://localhost:8080${response.data.file_url}`); // Ajustar la URL completa del archivo
      setUploadedTracks((prev) => [...prev, { file_url: response.data.file_url, trackName: `${artist} - ${title}` }]); // Añadir la nueva pista a la lista
    } catch (error) {
      console.error('Error uploading the file:', error);
      setUploadStatus('File upload failed. Try again.');
    } finally {
      setLoading(false);
      handleCloseModal(); // Cerrar el modal después de subir
    }
  };

  const deleteTrack = async (file_url: string) => {
    try {
      // Extraer el nombre del archivo de la URL
      const filename = file_url.split('/').pop(); // Esto obtiene solo el nombre del archivo
      console.log('Deleting file:', filename); // Verifica el nombre del archivo en la consola

      await axios.delete(`http://localhost:8080/audio/${filename}`);
      setUploadedTracks((prev) => prev.filter((track) => track.file_url !== file_url)); // Eliminar pista de la lista
    } catch (error) {
      console.error('Error deleting the file:', error);
    }
  };
  return (
    <div>
      {/* AppBar en la parte superior */}
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Audio Uploader
          </Typography>
          <Button color="inherit" onClick={handleOpenModal}>
            Subir
          </Button>
        </Toolbar>
      </AppBar>

      {/* Añadir un margen superior para compensar el AppBar fijo */}
      <div style={{ marginTop: '70px' }}>
        {/* Modal para ingresar metadatos y archivo */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={style}>
            <h3>Enter Song Details</h3>
            <div
              {...getRootProps()}
              style={{
                border: '2px dashed #aaa',
                padding: '50px',
                textAlign: 'center',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              <input {...getInputProps()} />
              {!loading ? (
                <p>Drag and drop an audio file here, or click to select one</p>
              ) : (
                <ClipLoader color="#36d7b7" loading={loading} size={50} />
              )}
            </div>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={onFileUpload}
              style={{ marginTop: '20px' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
          </Box>
        </Modal>

        {/* Status y vista previa de audio */}
        {uploadStatus && <p>{uploadStatus}</p>}

        {audioUrl && (
          <div>
            <h3>Audio Preview:</h3>
            <audio controls>
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Listado de pistas subidas */}
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Tracks</h3>
          <ul>
            {uploadedTracks.map((track, index) => (
              <li key={`${track.file_url}-${index}`}>
                {track.trackName}{' '}
                <Button variant="outlined" color="secondary" onClick={() => deleteTrack(track.file_url)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AudioUpload;
