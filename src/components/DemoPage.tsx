import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, IconButton, CircularProgress } from '@mui/material';
import { PlayArrow, Pause, Stop } from '@mui/icons-material';
import WaveSurfer from 'wavesurfer.js';

const DemoPage = () => {
  const { demo_id } = useParams<{ demo_id: string }>();
  const [track, setTrack] = useState<{ artist: string; title: string; file_url: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  // Obtener detalles del demo por demo_id
  useEffect(() => {
    const fetchDemoDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/demo_details/${demo_id}`);
        setTrack({
          artist: response.data.artist,
          title: response.data.title,
          file_url: `http://localhost:8080${response.data.file_url}`,
        });
      } catch (error) {
        console.error('Error fetching demo details:', error);
      }
    };

    if (demo_id) {
      fetchDemoDetails();
    }
  }, [demo_id]);

  // Inicializar WaveSurfer una vez que se obtengan los detalles del demo
  useEffect(() => {
    if (track && waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4A90E2', // Misma configuración de color
        progressColor: '#50E3C2',
        height: 80,
        barWidth: 2,
        normalize: true,
      });

      wavesurferRef.current.load(track.file_url);

      wavesurferRef.current.on('ready', () => {
        setDuration(wavesurferRef.current?.getDuration() || 0);
      });

      wavesurferRef.current.on('audioprocess', () => {
        setCurrentTime(wavesurferRef.current?.getCurrentTime() || 0);
      });

      wavesurferRef.current.on('finish', () => {
        setIsPlaying(false);
      });
    }
  }, [track]);

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
        setIsPlaying(false);
      } else {
        wavesurferRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const stopPlayback = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  return (
    <div style={styles.container}>
      {track ? (
        <div style={styles.trackItem}>
          <Typography variant="h4" style={styles.trackName}>
            {track.artist} - {track.title}
          </Typography>
          <div ref={waveformRef} style={styles.waveformContainer} />
          <div style={styles.controls}>
            <IconButton onClick={togglePlayPause} style={styles.playPauseButton}>
              {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
            </IconButton>
            <IconButton onClick={stopPlayback} style={styles.stopButton}>
              <Stop fontSize="large" />
            </IconButton>
            <Typography variant="body1" style={styles.timeInfo}>
              {Math.floor(currentTime)}s / {Math.floor(duration)}s
            </Typography>
          </div>
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

// Estilos consistentes con `UploadedTracks`
const styles = {
  container: {
    backgroundColor: '#F5F7FA',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
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
};

export default DemoPage;
