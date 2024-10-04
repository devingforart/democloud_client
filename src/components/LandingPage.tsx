import { Button, Typography, Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

export const LandingPage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div style={styles.container}>
      <Box sx={styles.hero}>
        <Typography variant="h2" style={styles.title}>
          Welcome to Demo Cloud
        </Typography>
        <Typography variant="h5" style={styles.subtitle}>
          Send your demos to top record labels effortlessly.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          style={styles.ctaButton}
          onClick={() => loginWithRedirect()}
        >
          Register / Log In
        </Button>
      </Box>

      <Box sx={styles.features}>
        <Typography variant="h4" style={styles.featuresTitle}>
          Why Demo Cloud?
        </Typography>
        <ul style={styles.featureList}>
          <li>✔ Simple and fast demo submission</li>
          <li>✔ Connect with top labels</li>
          <li>✔ Secure and private file storage</li>
          <li>✔ Track your demo submissions</li>
        </ul>
      </Box>

      <Box sx={styles.footer}>
        <Typography variant="body2">Privacy Policy | Terms & Conditions</Typography>
      </Box>
    </div>
  );
};

// Estilos para la Landing Page
const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    padding: '40px 20px',
  },
  hero: {
    marginTop: '50px',
    marginBottom: '40px',
  },
  title: {
    fontWeight: 'bold',
    color: '#4A90E2', // Color vibrante
    marginBottom: '20px',
  },
  subtitle: {
    color: '#4A4A4A',
    marginBottom: '30px',
  },
  ctaButton: {
    backgroundColor: '#4A90E2',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '18px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  features: {
    textAlign: 'left',
    maxWidth: '800px',
    margin: '0 auto',
  },
  featuresTitle: {
    color: '#4A90E2',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  featureList: {
    color: '#4A4A4A',
    fontSize: '18px',
    lineHeight: '1.8',
  },
  footer: {
    marginTop: '40px',
    paddingBottom: '20px',
    color: '#4A4A4A',
  },
};
