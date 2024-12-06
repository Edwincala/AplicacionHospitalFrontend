import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import useDoctoresPacientesStore from '../store/pacientesDoctoresStore';
import useHorariosStore from '../store/horariosDoctorStore';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const validationSchema = Yup.object({
    inicio: Yup.date()
      .required('La fecha de inicio es requerida')
      .min(new Date(), 'La fecha debe ser futura'),
    fin: Yup.date()
      .required('La fecha de fin es requerida')
      .min(Yup.ref('inicio'), 'La fecha de fin debe ser posterior a la fecha de inicio'),
  });

const HorariosDoctor: React.FC<{doctorId: string}> = ({ doctorId }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const { horarios, loading, error, obtenerHorariosPorDoctor, crearHorario, eliminarHorario } = useHorariosStore();
    const { doctores, obtenerDoctores } = useDoctoresPacientesStore();
  
    useEffect(() => {
      obtenerHorariosPorDoctor(doctorId);
      obtenerDoctores();
    }, [doctorId]);
  
    const formik = useFormik({
      initialValues: {
        inicio: dayjs(),
        fin: dayjs().add(1, 'hour'),
      },
      validationSchema,
      onSubmit: async (values) => {
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
      },
    });
  
    const handleEliminarHorario = async (horarioId: string) => {
      const success = await eliminarHorario(horarioId);
      if (success) {
        obtenerHorariosPorDoctor(doctorId);
      }
    };
  
    const nombreDoctor = doctores.find(d => d.id === doctorId)?.nombre || 'Doctor';

    return (
        <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5">Horarios de {nombreDoctor}</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Agregar Horario
        </Button>
      </Box>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}

      {loading ? (
        <Box className="flex justify-center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {horarios.map((horario) => (
            <Grid item xs={12} md={6} lg={4} key={horario.id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" className="font-bold mb-2">
                    Horario
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
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
    )
}  

export default HorariosDoctor;