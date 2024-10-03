import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const UploadedTracks = () => {
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
  );
};

export default UploadedTracks;
