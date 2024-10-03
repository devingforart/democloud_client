import { AppBar, Toolbar, Typography, Button } from '@mui/material';

interface AppBarComponentProps {
  onUploadClick: () => void;
}

export const AppBarComponent = ({ onUploadClick }: AppBarComponentProps) => {
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Demo Cloud
        </Typography>
        <Button color="inherit" onClick={onUploadClick}>
          Subir
        </Button>
      </Toolbar>
    </AppBar>
  );
};
