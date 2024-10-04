import { Modal, Box, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

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

const MetadataModal = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'audio/*': [] },
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    },
  });

  const onFileUpload = async () => {
    if (!selectedFile || !title || !artist) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      await axios.post(`https://devingfor.art/upload?artist=${artist}&title=${title}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Handle successful upload
    } catch (error) {
      console.error('Error uploading the file:', error);
    } finally {
      setLoading(false);
      onClose(); // Cerrar el modal
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <h3>Enter Song Details</h3>
        <div {...getRootProps()} style={{ border: '2px dashed #aaa', padding: '50px', textAlign: 'center', cursor: 'pointer' }}>
          <input {...getInputProps()} />
          {!loading ? <p>Drag and drop an audio file here, or click to select one</p> : <ClipLoader color="#36d7b7" loading={loading} size={50} />}
        </div>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" />
        <TextField label="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} fullWidth margin="normal" />
        <Button variant="contained" color="primary" onClick={onFileUpload} style={{ marginTop: '20px' }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </Box>
    </Modal>
  );
};

export default MetadataModal;
