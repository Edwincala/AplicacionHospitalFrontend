import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import useHorariosStore from '../store/horariosDoctorStore';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';


const validationSchema = Yup.object({
  inicio: Yup.date()
    .required('La fecha de inicio es requerida')
    .min(new Date(), 'La fecha debe ser futura'),
  fin: Yup.date()
    .required('La fecha de fin es requerida')
    .min(Yup.ref('inicio'), 'La fecha de fin debe ser posterior a la fecha de inicio'),
});

const HorariosDoctor: React.FC<{username: string}> = ({username}) => {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [errorDoctor, setErrorDoctor] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);
  const { 
    horarios, 
    loading: loadingHorarios, 
    error: errorHorarios, 
    obtenerHorariosPorDoctor, 
    crearHorario, 
    eliminarHorario 
  } = useHorariosStore();

  useEffect(() => {
    const obtenerDoctorId = async () => {
        try {
            const response = await api.get(`/doctores/perfil/${username}`);
            if (response.data && response.data.id) {
                setDoctorId(response.data.id);
                obtenerHorariosPorDoctor(response.data.id);
            }
        } catch (error) {
            console.error('Error al obtener datos del doctor:', error);
            setErrorDoctor('No se pudo obtener la información del doctor');
        } finally {
            setLoadingDoctor(false);
        }
    };

    obtenerDoctorId();
}, [username]);

  useEffect(() => {
    if (doctorId) {
      obtenerHorariosPorDoctor(doctorId);
    }
  }, [doctorId]);

  if (loadingDoctor) {
    return (
        <Box className="flex justify-center items-center h-screen">
            <CircularProgress />
        </Box>
    );
}

if (errorDoctor || !doctorId) {
    return (
        <Box className="p-4">
            <Alert severity="error">
                {errorDoctor || 'No se pudo obtener la información del doctor'}
            </Alert>
        </Box>
    );
}
  
const formik = useFormik({
  initialValues: {
      inicio: dayjs(),
      fin: dayjs().add(1, 'hour'),
  },
  validationSchema,
  onSubmit: async (values) => {
      if (doctorId) {
          const success = await crearHorario(
              doctorId,
              values.inicio.toISOString(),
              values.fin.toISOString()
          );
          
          if (success) {
              setOpenDialog(false);
              formik.resetForm();
              obtenerHorariosPorDoctor(doctorId);
          }
      }
  },
});

  const handleEliminarHorario = async (horarioId: string) => {
    if (!doctorId) return;

    const success = await eliminarHorario(horarioId);
    if (success && doctorId) {
      obtenerHorariosPorDoctor(doctorId);
    }
  };

  if (loadingDoctor) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (errorDoctor) {
    return (
      <Box className="p-4">
        <Alert severity="error">{errorDoctor}</Alert>
      </Box>
    );
  }

  if (!doctorId) {
    return (
      <Box className="p-4">
        <Alert severity="error">No se pudo obtener la información del doctor</Alert>
      </Box>
    );
  }
    return (
      <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5">
          Mis Horarios de Atención
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Agregar Horario
        </Button>
      </Box>

      {errorHorarios && (
        <Alert severity="error" className="mb-4">
          {errorHorarios}
        </Alert>
      )}

      {loadingHorarios ? (
        <Box className="flex justify-center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {horarios.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">
                No hay horarios configurados. Agregue nuevos horarios de atención.
              </Alert>
            </Grid>
          ) : (
            horarios.map((horario) => (
              <Grid item xs={12} md={6} lg={4} key={horario.id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" className="font-bold mb-2">
                      Horario de Atención
                    </Typography>
                    <Typography>
                      Inicio: {dayjs(horario.inicio).format('DD/MM/YYYY HH:mm')}
                    </Typography>
                    <Typography>
                      Fin: {dayjs(horario.fin).format('DD/MM/YYYY HH:mm')}
                    </Typography>
                    <Typography className="mb-2">
                      Estado: {horario.disponible ? 'Disponible' : 'No disponible'}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleEliminarHorario(horario.id)}
                      size="small"
                    >
                      Eliminar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Agregar Nuevo Horario</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Box className="space-y-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Fecha y Hora de Inicio"
                  value={formik.values.inicio}
                  onChange={(value) => formik.setFieldValue('inicio', value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.inicio && Boolean(formik.errors.inicio),
                      helperText: formik.touched.inicio && formik.errors.inicio as string,
                    },
                  }}
                />

                <Box className="mt-4">
                  <DateTimePicker
                    label="Fecha y Hora de Fin"
                    value={formik.values.fin}
                    onChange={(value) => formik.setFieldValue('fin', value)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.fin && Boolean(formik.errors.fin),
                        helperText: formik.touched.fin && formik.errors.fin as string,
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loadingHorarios}
            >
              {loadingHorarios ? <CircularProgress size={24} /> : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
    )
}  

export default HorariosDoctor;