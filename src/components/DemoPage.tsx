import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DemoPage = () => {
  const { demoId } = useParams<{ demoId: string }>();
  const [demoUrl, setDemoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/demo/${demoId}`);
        setDemoUrl(response.data.file_url); // El servidor debe devolver la URL del archivo
      } catch (error) {
        setError('Demo not found');
      }
    };

    fetchDemo();
  }, [demoId]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {demoUrl ? (
        <div>
          <h2>Listen to the Demo</h2>
          <audio controls>
            <source src={demoUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : (
        <p>Loading demo...</p>
      )}
    </div>
  );
};

export default DemoPage;
