import { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, CircularProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { ClipLoader } from 'react-spinners';
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
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [uploadedTracks, setUploadedTracks] = useState<{ file_url: string, trackName: string }[]>([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tracks');
        setUploadedTracks(response.data.map((track: any) => ({
          file_url: track.file_url,
          trackName: `${track.artist} - ${track.title}`,
        })));
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    };

    fetchTracks();
  }, []);

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

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8080/upload?artist=${artist}&title=${title}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadStatus('File uploaded successfully!');
      setAudioUrl(`http://localhost:8080${response.data.file_url}`);
      setUploadedTracks((prev) => [...prev, { file_url: response.data.file_url, trackName: `${artist} - ${title}` }]);
    } catch (error) {
      console.error('Error uploading the file:', error);
      setUploadStatus('File upload failed. Try again.');
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const deleteTrack = async (file_url: string) => {
    try {
      const filename = file_url.split('/').pop();
      await axios.delete(`http://localhost:8080/audio/${filename}`);
      setUploadedTracks((prev) => prev.filter((track) => track.file_url !== file_url));
    } catch (error) {
      console.error('Error deleting the file:', error);
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

      {uploadStatus && <p>{uploadStatus}</p>}
      {audioUrl && (
        <div>
          <h3>Audio Preview:</h3>
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
        </div>
      )}

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
  );
};

export default AudioComponent;
