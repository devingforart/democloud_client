import { useState } from 'react';
import axios from 'axios';

const AudioUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadStatus('File uploaded successfully!');
      setAudioUrl(response.data.file_url);
    } catch (error) {
      console.error('Error uploading the file:', error);
      setUploadStatus('File upload failed.');
    }
  };

  return (
    <div>
      {uploadStatus && <p>{uploadStatus}</p>}
      {audioUrl && (
        <div>
          <h3>Audio Preview:</h3>
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioUpload;
