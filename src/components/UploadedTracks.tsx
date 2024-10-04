import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, Snackbar, Slide } from '@mui/material';
import { PlayArrow, Pause, Stop, Delete, ContentCopy, CheckCircleOutline } from '@mui/icons-material';
import WaveSurfer from 'wavesurfer.js';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';
import { Alert } from '@mui/material';

const UploadedTracks = () => {
  const [uploadedTracks, setUploadedTracks] = useState<{ file_url: string, trackName: string, demo_id: string }[]>([]);
  const [loadedTracks, setLoadedTracks] = useState<number>(5); // Número máximo de pistas a cargar inicialmente
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
  const [currentTime, setCurrentTime] = useState<number[]>([]);
  const [duration, setDuration] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [trackToDelete, setTrackToDelete] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useAuth0();

  const waveformRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wavesurferRefs = useRef<(WaveSurfer | null)[]>([]);

  // Cargar las pistas del servidor
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        if (user) {
          const user_id = user.sub;
          const response = await axios.get('http://localhost:8080/tracks', {
            headers: { user_id, 'Content-Type': 'application/json' },
          });

          setUploadedTracks(response.data.map((track: any) => ({
            file_url: track.file_url,
            trackName: `${track.artist} - ${track.title}`,
            demo_id: track.demo_id,
          })));

          setIsPlaying(new Array(response.data.length).fill(false));
          setCurrentTime(new Array(response.data.length).fill(0));
          setDuration(new Array(response.data.length).fill(0));
        }
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    };
    fetchTracks();
  }, [user]);

  // Inicializar WaveSurfer y evitar duplicados
  useEffect(() => {
    uploadedTracks.slice(0, loadedTracks).forEach((track, index) => {
      if (waveformRefs.current[index] && wavesurferRefs.current[index]) {
        wavesurferRefs.current[index]?.destroy();
        wavesurferRefs.current[index] = null;
      }

      if (waveformRefs.current[index] && !wavesurferRefs.current[index]) {
        wavesurferRefs.current[index] = WaveSurfer.create({
          container: waveformRefs.current[index],
          waveColor: '#4A90E2',
          progressColor: '#50E3C2',
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

  // Eliminar instancias al desmontar
  useEffect(() => {
    return () => {
      wavesurferRefs.current.forEach((wave) => wave?.destroy());
    };
  }, []);

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

  const copyToClipboard = (demo_id: string) => {
    const privateLink = `${window.location.origin}/demo/${demo_id}`;
    navigator.clipboard.writeText(privateLink);
    setOpenSnackbar(false);
    setTimeout(() => setOpenSnackbar(true), 100);
  };

  return (
    <div style={styles.container}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          icon={<CheckCircleOutline fontSize="inherit" />}
          sx={{ backgroundColor: '#4caf50', color: '#ffffff', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        >
          🎉 Link copied successfully!
        </Alert>
      </Snackbar>

      <h3 style={styles.title}>Tracks by {user?.name}</h3>
      <ul style={styles.trackList}>
        {uploadedTracks.slice(0, loadedTracks).map((track, index) => (
          <li key={`${track.file_url}-${index}`} style={styles.trackItem}>
            <div style={styles.trackHeader}>
              <Typography variant="h6" style={styles.trackName}>
                <Link to={`/demo/${track.demo_id}`} style={{ textDecoration: 'none', color: '#4A90E2' }}>{track.trackName}</Link>
              </Typography>
              <Tooltip title="Copy private link">

                <IconButton onClick={() => copyToClipboard(track.demo_id)} style={styles.copyButton}>
                  <Typography style={{ fontSize: '12px', marginRight:'5px' }}>
                    Copy Share Link
                  </Typography>
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
            <div ref={(el) => (waveformRefs.current[index] = el)} style={styles.waveformContainer} />
            <div style={styles.controls}>
              <IconButton onClick={() => togglePlayPause(index)} style={styles.playPauseButton}>
                {isPlaying[index] ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
              </IconButton>
              <IconButton onClick={() => stopPlayback(index)} style={styles.stopButton}>
                <Stop fontSize="large" />
              </IconButton>
              <Typography variant="body1" style={styles.timeInfo}>
                {Math.floor(currentTime[index])}s / {Math.floor(duration[index])}s
              </Typography>
            </div>
            <Button variant="outlined" color="error" onClick={() => handleOpenDeleteDialog(track.file_url)} startIcon={<Delete />} style={styles.deleteButton}>
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

const styles = {
  container: {
    backgroundColor: '#F5F7FA',
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
    color: '#4A90E2',
  },
  waveformContainer: {
    marginBottom: '10px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
  },
  playPauseButton: {
    color: '#50E3C2',
  },
  stopButton: {
    color: '#D0021B',
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
  copyButton: {
    borderRadius: '10px',
  }
};

export default UploadedTracks;
