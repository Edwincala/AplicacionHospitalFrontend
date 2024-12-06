import { useEffect, useState } from "react";
import useCitasDoctorStore, { CitaDoctor } from "../store/citasDoctorStore";
import { useAuthStore } from "../store/authStore";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

const CitasDoctor: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedCita, setSelectedCita] = useState<CitaDoctor | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const user = useAuthStore(state => state.user);
  const { citasDoctor, loading, error, obtenerCitasDoctor, marcarCitaCompletada } = useCitasDoctorStore();

  useEffect(() => {
    if (user?.username && user.role === 'DOCTOR') {
      obtenerCitasDoctor(user.username);
    }
  }, [user]);

  // Si el usuario no es un doctor, mostramos un mensaje de error
  if (!user || user.role !== 'DOCTOR') {
    return (
      <Box className="p-4">
        <Alert severity="error">
          Acceso no autorizado. Esta página es solo para doctores.
        </Alert>
      </Box>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCompletarCita = async () => {
    if (selectedCita) {
      const success = await marcarCitaCompletada(selectedCita.id, observaciones);
      if (success) {
        setOpenDialog(false);
        setSelectedCita(null);
        setObservaciones('');
      }
    }
  };

  const now = dayjs();

  const citasHoy = citasDoctor.filter(cita =>
    dayjs(cita.fechaHora).isSame(now, 'day') && cita.estado !== 'CANCELADA'
  );

  const citasFuturas = citasDoctor.filter(cita =>
    dayjs(cita.fechaHora).isAfter(now, 'day') && cita.estado !== 'CANCELADA'
  );

  const citasPasadas = citasDoctor.filter(cita =>
    dayjs(cita.fechaHora).isBefore(now, 'day') || cita.estado === 'COMPLETADA'
  );

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  const renderCitaCard = (cita: CitaDoctor) => (
    <Card key={cita.id} className="mb-4">
      <CardContent>
        <Typography variant="h6">
          {dayjs(cita.fechaHora).format('HH:mm')} - Paciente: {cita.paciente.nombre}
        </Typography>
        <Typography color="textSecondary">
          Fecha: {dayjs(cita.fechaHora).format('DD/MM/YYYY')}
        </Typography>
        <Typography>
          Estado: {cita.estado}
        </Typography>
        {cita.observaciones && (
          <Typography className="mt-2">
            Observaciones: {cita.observaciones}
          </Typography>
        )}
        {cita.estado === 'CONFIRMADA' && dayjs(cita.fechaHora).isSameOrBefore(now) && (
          <Button
            variant="contained"
            color="primary"
            className="mt-2"
            onClick={() => {
              setSelectedCita(cita);
              setOpenDialog(true);
            }}
          >
            Completar Cita
          </Button>
        )}
      </CardContent>
    </Card>
  );
  return (
    <Box className="p-4">
      <Typography variant="h4" className="mb-4">
        Mis Citas - Dr. {user.nombre} {user.apellido}
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Tabs value={tabValue} onChange={handleTabChange} className="mb-4">
        <Tab label={`Hoy (${citasHoy.length})`} />
        <Tab label={`Próximas (${citasFuturas.length})`} />
        <Tab label="Historial" />
      </Tabs>

      <Box role="tabpanel" hidden={tabValue !== 0}>
        {citasHoy.length === 0 ? (
          <Alert severity="info">No hay citas programadas para hoy</Alert>
        ) : (
          citasHoy.map(renderCitaCard)
        )}
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 1}>
        {citasFuturas.length === 0 ? (
          <Alert severity="info">No hay citas futuras programadas</Alert>
        ) : (
          citasFuturas.map(renderCitaCard)
        )}
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 2}>
        {citasPasadas.length === 0 ? (
          <Alert severity="info">No hay historial de citas</Alert>
        ) : (
          citasPasadas.map(renderCitaCard)
        )}
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Completar Cita</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Observaciones"
            fullWidth
            multiline
            rows={4}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCompletarCita} variant="contained" disabled={loading}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CitasDoctor;