import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { PlayArrow, Pause, Stop, Delete } from '@mui/icons-material';
import WaveSurfer from 'wavesurfer.js';

const UploadedTracks = () => {
  const [uploadedTracks, setUploadedTracks] = useState<{ file_url: string, trackName: string, demo_id: string }[]>([]);
  const [loadedTracks, setLoadedTracks] = useState<number>(5); // Número máximo de pistas a cargar inicialmente
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null); // Índice de la pista actual
  const [isPlaying, setIsPlaying] = useState<boolean[]>([]); // Array de estados de reproducción por pista
  const [currentTime, setCurrentTime] = useState<number[]>([]); // Array de tiempos de reproducción por pista
  const [duration, setDuration] = useState<number[]>([]); // Array de duraciones por pista
  const [openDialog, setOpenDialog] = useState<boolean>(false); // Estado del diálogo de eliminación
  const [trackToDelete, setTrackToDelete] = useState<string | null>(null); // Pista a eliminar

  const waveformRefs = useRef<(HTMLDivElement | null)[]>([]); // Array de refs para cada pista
  const wavesurferRefs = useRef<(WaveSurfer | null)[]>([]); // Array de WaveSurfers para cada pista

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tracks');
        console.log('RESPONMSE', response)
        setUploadedTracks(response.data.map((track: any) => ({
          file_url: track.file_url,
          trackName: `${track.artist} - ${track.title}`,
          demo_id: track.demo_id // Asegúrate de recibir el demo_id
        })));
        // Inicializar estados para cada pista
        setIsPlaying(new Array(response.data.length).fill(false));
        setCurrentTime(new Array(response.data.length).fill(0));
        setDuration(new Array(response.data.length).fill(0));
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    };

    fetchTracks();
  }, []);

  useEffect(() => {
    uploadedTracks.slice(0, loadedTracks).forEach((track, index) => {
      if (waveformRefs.current[index] && !wavesurferRefs.current[index]) {
        // Crear un nuevo objeto WaveSurfer para cada pista
        wavesurferRefs.current[index] = WaveSurfer.create({
          container: waveformRefs.current[index],
          waveColor: '#4A90E2', // Color de la onda
          progressColor: '#50E3C2', // Color del progreso
          height: 80,
          barWidth: 2,
          normalize: true,
        });

        wavesurferRefs.current[index]?.load(`http://localhost:8080${track.file_url}`);

        wavesurferRefs.current[index]?.on('ready', () => {
          const trackDuration = wavesurferRefs.current[index]?.getDuration() || 0;
          setDuration((prevDurations) => {
            const newDurations = [...prevDurations];
            newDurations[index] = trackDuration;
            return newDurations;
          });
        });

        wavesurferRefs.current[index]?.on('audioprocess', () => {
          const trackCurrentTime = wavesurferRefs.current[index]?.getCurrentTime() || 0;
          setCurrentTime((prevTimes) => {
            const newTimes = [...prevTimes];
            newTimes[index] = trackCurrentTime;
            return newTimes;
          });
        });

        wavesurferRefs.current[index]?.on('finish', () => {
          setIsPlaying((prevPlaying) => {
            const newPlaying = [...prevPlaying];
            newPlaying[index] = false;
            return newPlaying;
          });
        });
      }
    });
  }, [uploadedTracks, loadedTracks]);

  const togglePlayPause = (index: number) => {
    if (wavesurferRefs.current[index]) {
      if (isPlaying[index]) {
        wavesurferRefs.current[index]?.pause();
        setIsPlaying((prevPlaying) => {
          const newPlaying = [...prevPlaying];
          newPlaying[index] = false;
          return newPlaying;
        });
      } else {
        if (currentTrackIndex !== null && wavesurferRefs.current[currentTrackIndex]) {
          wavesurferRefs.current[currentTrackIndex]?.pause();
          setIsPlaying((prevPlaying) => {
            const newPlaying = [...prevPlaying];
            newPlaying[currentTrackIndex] = false;
            return newPlaying;
          });
        }
        wavesurferRefs.current[index]?.play();
        setIsPlaying((prevPlaying) => {
          const newPlaying = [...prevPlaying];
          newPlaying[index] = true;
          return newPlaying;
        });
        setCurrentTrackIndex(index);
      }
    }
  };

  const stopPlayback = (index: number) => {
    if (wavesurferRefs.current[index]) {
      wavesurferRefs.current[index]?.stop();
      setIsPlaying((prevPlaying) => {
        const newPlaying = [...prevPlaying];
        newPlaying[index] = false;
        return newPlaying;
      });
      setCurrentTime((prevTimes) => {
        const newTimes = [...prevTimes];
        newTimes[index] = 0;
        return newTimes;
      });
    }
  };

  const handleOpenDeleteDialog = (file_url: string) => {
    setTrackToDelete(file_url);
    setOpenDialog(true);
  };
  console.log('Uploaded Tracks:', uploadedTracks);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTrackToDelete(null);
  };

  const confirmDeleteTrack = async () => {
    if (trackToDelete) {
      try {
        const filename = trackToDelete.split('/').pop();
        await axios.delete(`http://localhost:8080/audio/${filename}`);
        setUploadedTracks((prev) => prev.filter((track) => track.file_url !== trackToDelete));
      } catch (error) {
        console.error('Error deleting the file:', error);
      } finally {
        handleCloseDialog();
      }
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Tracks by South Atoms</h3>
      <ul style={styles.trackList}>
        {uploadedTracks.slice(0, loadedTracks).map((track, index) => (

          <li key={`${track.file_url}-${index}`} style={styles.trackItem}>
            <Typography variant="h6" style={styles.trackName}>
              <a href={`http://localhost:8080/demo/${track.demo_id}`} target="_blank" rel="noopener noreferrer">
                {track.trackName}
              </a>
            </Typography>
            <div ref={(el) => (waveformRefs.current[index] = el)} style={styles.waveformContainer} />
            <div style={styles.controls}>
              <IconButton onClick={() => togglePlayPause(index)} style={styles.playPauseButton}>
                {isPlaying[index] ? (
                  <Pause fontSize="large" />
                ) : (
                  <PlayArrow fontSize="large" />
                )}
              </IconButton>
              <IconButton onClick={() => stopPlayback(index)} style={styles.stopButton}>
                <Stop fontSize="large" />
              </IconButton>
              <Typography variant="body1" style={styles.timeInfo}>
                {Math.floor(currentTime[index])}s / {Math.floor(duration[index])}s
              </Typography>
            </div>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleOpenDeleteDialog(track.file_url)}
              startIcon={<Delete />}
              style={styles.deleteButton}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>

      {uploadedTracks.length > loadedTracks && (
        <Button variant="contained" color="primary" onClick={() => setLoadedTracks((prev) => prev + 5)} style={styles.loadMoreButton}>
          Load More
        </Button>
      )}

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this track? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteTrack} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Estilos para la UI
const styles = {
  container: {
    backgroundColor: '#F5F7FA', // Fondo claro
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  title: {
    color: '#4A4A4A',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  trackList: {
    listStyle: 'none',
    padding: 0,
  },
  trackItem: {
    backgroundColor: '#FFFFFF',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  },
  trackName: {
    color: '#4A90E2', // Azul vibrante
  },
  waveformContainer: {
    marginBottom: '10px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
  },
  playPauseButton: {
    color: '#50E3C2', // Color del progreso
  },
  stopButton: {
    color: '#D0021B', // Rojo para el botón de stop
  },
  timeInfo: {
    marginLeft: '10px',
    color: '#4A4A4A',
  },
  deleteButton: {
    marginTop: '10px',
    color: '#D0021B',
  },
  loadMoreButton: {
    marginTop: '20px',
    backgroundColor: '#4A90E2',
    color: '#FFF',
  },
};

export default UploadedTracks;
