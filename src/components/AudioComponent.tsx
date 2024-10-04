import { useAuth0 } from "@auth0/auth0-react"; // Asegúrate de importar Auth0
import { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, CircularProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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

interface AudioComponentProps {
  openModal: boolean;
  handleCloseModal: () => void;
}

const AudioComponent = ({ openModal, handleCloseModal }: AudioComponentProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>(''); // URL del archivo subido
  const [demoUrl, setDemoUrl] = useState<string>(''); // URL única para compartir
  const { demo_id } = useParams<{ demo_id: string }>();
  const { user } = useAuth0(); // Obtener el objeto `user` de Auth0
  const navigate = useNavigate();

  // Verificar si hay un demo_id en la URL
  useEffect(() => {
    if (demo_id) {
      const fetchDemoDetails = async () => {
        try {
          const response = await axios.get(`https://devingfor.art/demo_details/${demo_id}`);
          const track = response.data;
          setTitle(track.title);
          setArtist(track.artist);
          setAudioUrl(`https://devingfor.art${track.file_url}`);
          setDemoUrl(`${window.location.origin}/demo/${demo_id}`);
        } catch (error) {
          console.error('Error fetching demo details:', error);
        }
      };
      fetchDemoDetails();
    }
  }, [demo_id]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'audio/*': [] },
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    },
  });

  const onFileUpload = async () => {
    if (!selectedFile || !title || !artist) {
      setUploadStatus('Please fill in all fields');
      return;
    }

    if (!user) {
      setUploadStatus('User not authenticated');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      const user_id = user.sub; // Obtener el user_id del objeto `user` de Auth0

      // Enviar el archivo al backend con el encabezado `user_id`
      const response = await axios.post(
        `https://devingfor.art/upload?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`,
        formData,
        {
          headers: { 'X-User-Id': user.sub, 'Content-Type': 'application/json' },

        }
      );

      const demoId = response.data.demo_id;
      const demoUrl = `${window.location.origin}/demo/${demoId}`;

      setDemoUrl(demoUrl);
      setUploadStatus('File uploaded successfully!');
      setAudioUrl(`https://devingfor.art${response.data.file_url}`);

      // Redirigir a la página con el demo_id en la URL
      navigate(`/demo/${demoId}`);
    } catch (error) {
      console.error('Error uploading the file:', error);
      setUploadStatus('File upload failed. Please check the server logs.');
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  return (
    <div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          <h3>Enter Song Details</h3>
          <div {...getRootProps()} style={{ border: '2px dashed #aaa', padding: '50px', textAlign: 'center', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            {!loading ? (
              <p>Drag and drop an audio file here, or click to select one</p>
            ) : (
              <ClipLoader color="#36d7b7" loading={loading} size={50} />
            )}
          </div>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" />
          <TextField label="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} fullWidth margin="normal" />
          <Button variant="contained" color="primary" onClick={onFileUpload} style={{ marginTop: '20px' }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </Box>
      </Modal>




    </div>
  );
};

export default AudioComponent;
