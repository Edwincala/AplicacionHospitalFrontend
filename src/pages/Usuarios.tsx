import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import useUserStore, { Rol } from "../store/userStore";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Paper, Snackbar, TextField, Typography } from "@mui/material";


const roles: Rol[] = ['DOCTOR', 'ADMINISTRATIVO', 'PACIENTE'];

interface FormData {
    nombre: string;
    apellido: string;
    username: string;
    password: string;
    rol: Rol;
    especialidad?: string;
    direccion?: string;
    telefono?: string;
  }

export const Usuarios:React.FC = () => {

    const { usuarios, loading, error, fetchUsuarios, addUsuario, deleteUsuario } = useUserStore();
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [formData, setFormData] = useState<FormData>({
      nombre: '',
      apellido: '',
      username: '',
      password: '',
      rol: 'PACIENTE',
    });
  
    useEffect(() => {
      fetchUsuarios();
    }, [fetchUsuarios]);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const showSnackbar = (message: string, severity: 'success' | 'error') => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setOpenSnackbar(true);
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await addUsuario(formData);
        setOpenDialog(false);
        showSnackbar('Usuario creado exitosamente', 'success');
        setFormData({
          nombre: '',
          apellido: '',
          username: '',
          password: '',
          rol: 'PACIENTE',
        });
        fetchUsuarios(); // Recargar la lista
      } catch (error) {
        showSnackbar('Error al crear el usuario', 'error');
      }
    };
  
    const handleDelete = async (id: string, rol: Rol) => {
      if (window.confirm('¿Está seguro de eliminar este usuario?')) {
        try {
          await deleteUsuario(id, rol);
          showSnackbar('Usuario eliminado exitosamente', 'success');
        } catch (error) {
          showSnackbar('Error al eliminar el usuario', 'error');
        }
      }
    };
  
    const renderRoleSpecificFields = () => {
      switch (formData.rol) {
        case 'DOCTOR':
          return (
            <TextField
              fullWidth
              label="Especialidad"
              name="especialidad"
              value={formData.especialidad || ''}
              onChange={handleInputChange}
              required
              margin="normal"
            />
          );
        case 'PACIENTE':
          return (
            <>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formData.direccion || ''}
                onChange={handleInputChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono || ''}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </>
          );
        default:
          return null;
      }
    };

    return (
        <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Gestión de Usuarios
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Nuevo Usuario
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          ) : (
            <Grid container spacing={2}>
              {usuarios.map((usuario) => (
                <Grid item xs={12} sm={6} md={4} key={usuario.id}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6">
                          {usuario.nombre} {usuario.apellido}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          @{usuario.username}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'primary.main',
                            mt: 1,
                            fontWeight: 'medium'
                          }}
                        >
                          {usuario.rol}
                        </Typography>
                        {usuario.rol === 'DOCTOR' && usuario.especialidad && (
                          <Typography variant="body2">
                            Especialidad: {usuario.especialidad}
                          </Typography>
                        )}
                        {usuario.rol === 'PACIENTE' && (
                          <>
                            {usuario.direccion && (
                              <Typography variant="body2">
                                Dirección: {usuario.direccion}
                              </Typography>
                            )}
                            {usuario.telefono && (
                              <Typography variant="body2">
                                Teléfono: {usuario.telefono}
                              </Typography>
                            )}
                          </>
                        )}
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(usuario.id, usuario.rol)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid>
              ))}
              {usuarios.length === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="textSecondary">
                      No hay usuarios registrados
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                select
                label="Rol"
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                required
                margin="normal"
              >
                {roles.map((rol) => (
                  <MenuItem key={rol} value={rol}>
                    {rol}
                  </MenuItem>
                ))}
              </TextField>
              {renderRoleSpecificFields()}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Crear Usuario
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    );
}