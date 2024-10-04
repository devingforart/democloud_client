import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './AppBar.css';
import { useAuth0 } from '@auth0/auth0-react';

interface AppBarComponentProps {
  onUploadClick: () => void;
}

export const AppBarComponent = ({ onUploadClick }: AppBarComponentProps) => {
  const { user, logout } = useAuth0(); // Obtener el objeto `user` de Auth0

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <div className="topButtons">
          <Button color="inherit" component={Link} to="/">
            Inicio
          </Button>

          {user && <>
            <Button color="inherit" component={Link} to="/my-tracks">
              Mis Tracks
            </Button>

            <Button color="inherit" onClick={onUploadClick}>
              Subir
            </Button>
          </>
          }


          <Button
            color="inherit"
            onClick={() => logout({ returnTo: window.location.origin })} // Cerrar sesión
            style={{ marginLeft: 'auto' }} // Alineación a la derecha
          >
            Cerrar Sesión
          </Button>

        </div>
      </Toolbar>
    </AppBar>
  );
};
