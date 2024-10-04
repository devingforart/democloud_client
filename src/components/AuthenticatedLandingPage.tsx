import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const AuthenticatedLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <Box sx={styles.hero}>
        <Typography variant="h3" style={styles.title}>
          ¡Bienvenido a DemoCloud!
        </Typography>
        <Typography variant="h5" style={styles.subtitle}>
          Sube y comparte tus demos de música con las principales discográficas del mundo.
        </Typography>
        <Typography variant="body1" style={styles.description}>
          Con DemoCloud puedes gestionar tus pistas, obtener estadísticas detalladas de tus reproducciones y conectar con las mejores oportunidades en la industria musical. ¡Déjanos ayudarte a llevar tu carrera al siguiente nivel!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          style={styles.ctaButton}
          onClick={() => navigate('/my-tracks')}
        >
          Ver Mis Pistas
        </Button>
      </Box>

      <Box sx={styles.features}>
        <Typography variant="h4" style={styles.featuresTitle}>
          Características Exclusivas
        </Typography>
        <ul style={styles.featureList}>
          <li>✔ Almacenamiento seguro y privado de tus pistas</li>
          <li>✔ Estadísticas detalladas y métricas de audiencia</li>
          <li>✔ Conexión directa con sellos discográficos</li>
          <li>✔ Promoción y visibilidad garantizada</li>
        </ul>
      </Box>

      <Box sx={styles.footer}>
        <Typography variant="body2">
          ¿Necesitas ayuda? Contáctanos en soporte@democloud.com
        </Typography>
      </Box>
    </div>
  );
};

// Estilos para la página de usuarios autenticados
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
  },
  hero: {
    marginTop: '50px',
    marginBottom: '40px',
    padding: '20px',
  },
  title: {
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: '20px',
    fontSize: '48px',
  },
  subtitle: {
    color: '#4A4A4A',
    marginBottom: '30px',
    fontSize: '24px',
  },
  description: {
    color: '#4A4A4A',
    marginBottom: '30px',
    fontSize: '18px',
  },
  ctaButton: {
    backgroundColor: '#4A90E2',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '18px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: '#357ABD',
    },
  },
  features: {
    textAlign: 'left',
    maxWidth: '800px',
    margin: '0 auto',
    marginTop: '20px',
  },
  featuresTitle: {
    color: '#4A90E2',
    fontWeight: 'bold',
    marginBottom: '20px',
    fontSize: '36px',
  },
  featureList: {
    color: '#4A4A4A',
    fontSize: '18px',
    lineHeight: '1.8',
    marginLeft: '20px',
  },
  footer: {
    marginTop: '40px',
    paddingBottom: '20px',
    color: '#4A4A4A',
  },
};

export default AuthenticatedLandingPage;
