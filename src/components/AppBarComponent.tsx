import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import './AppBar.css'

interface AppBarComponentProps {
  onUploadClick: () => void;
}

export const AppBarComponent = ({ onUploadClick }: AppBarComponentProps) => {
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <div className="topButtons">
          <Button color="inherit">
            Inicio
          </Button>
          <Button color="inherit">
            Mis Tracks
          </Button>
          <Button color="inherit">
            Mensajes
          </Button>
          <Button color="inherit">
            Recomendaciones
          </Button>
          <Button color="inherit" onClick={onUploadClick}>
            Subir
          </Button>
        </div>

      </Toolbar>
    </AppBar>
  );
};
