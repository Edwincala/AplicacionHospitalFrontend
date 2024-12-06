import * as Yup from 'yup';
import useCitasStore from '../store/citasStore';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import useHorariosStore from '../store/horariosDoctorStore';
import useDoctoresPacientesStore from '../store/pacientesDoctoresStore';

const validationSchema = Yup.object({
    pacienteId: Yup.string().required('El paciente es requerido'),
    doctorId: Yup.string().required('El doctor es requerido'),
    horarioId: Yup.string().required('Debe seleccionar un horario disponible'),
});


export const Citas: React.FC = () => {

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
    const [horariosDisponibles, setHorariosDisponibles] = useState<any[]>([]);

    const { citas, loading: citasLoading, error: citasError, agendarCita, cancelarCita } = useCitasStore();
    const { horarios, loading: horariosLoading, obtenerHorariosPorDoctor } = useHorariosStore();
    const {
        doctores,
        pacientes,
        loadingDoctores,
        loadingPacientes,
        error: doctoresPacientesError,
        obtenerDoctores,
        obtenerPacientes
    } = useDoctoresPacientesStore();

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            await Promise.all([
                obtenerDoctores(),
                obtenerPacientes()
            ]);
        };
        cargarDatos();
    }, []);

    const formik = useFormik({
        initialValues: {
            pacienteId: '',
            doctorId: '',
            horarioId: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const horarioSeleccionado = horariosDisponibles.find(h => h.id === values.horarioId);
            if (!horarioSeleccionado) return;

            const success = await agendarCita(
                'ID_DEL_ADMIN_ACTUAL',
                values.pacienteId,
                values.doctorId,
                horarioSeleccionado.inicio
            );

            if (success) {
                setOpenDialog(false);
                formik.resetForm();
                setHorariosDisponibles([]);
            }
        },
    });

    // Efecto para cargar horarios cuando se selecciona un doctor y fecha
    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                if (formik.values.doctorId && selectedDate) {
                    await obtenerHorariosPorDoctor(formik.values.doctorId);
                    const horariosDelDia = (horarios || []).filter(horario =>
                        dayjs(horario.inicio).isSame(selectedDate, 'day') && horario.disponible
                    );
                    setHorariosDisponibles(horariosDelDia);
                } else {
                    setHorariosDisponibles([]);
                }
            } catch (error) {
                console.error('Error al cargar horarios:', error);
                setHorariosDisponibles([]);
            }
        };

        fetchHorarios();
    }, [formik.values.doctorId, selectedDate]);

    const handleCancelarCita = async (citaId: string) => {
        await cancelarCita(citaId);
    };

    const loading = citasLoading || loadingDoctores || loadingPacientes || horariosLoading;
    const error = citasError || doctoresPacientesError;

    if (loading && !openDialog) {
        return (
            <Box className="flex justify-center items-center h-screen">
                <CircularProgress />
            </Box>
        );
    }

    const doctoresList = doctores || [];
    const pacientesList = pacientes || [];
    const citasList = citas || [];
    return (
        <Box className="p-4">
            <Box className="flex justify-between items-center mb-4">
                <Typography variant="h4">Gestión de Citas</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenDialog(true)}
                    disabled={loading || doctoresList.length === 0 || pacientesList.length === 0}
                >
                    Nueva Cita
                </Button>
            </Box>

            {error && <Alert severity="error" className="mb-4">{error}</Alert>}

            {doctoresList.length === 0 && !loading && (
                <Alert severity="info" className="mb-4">
                    No hay doctores disponibles en el sistema
                </Alert>
            )}

            <Grid container spacing={2}>
                {citasList.map((cita) => (
                    <Grid item xs={12} md={6} lg={4} key={cita.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    Paciente: {cita.paciente.nombre}
                                </Typography>
                                <Typography>
                                    Doctor: {cita.doctor.nombre}
                                </Typography>
                                <Typography>
                                    Fecha: {dayjs(cita.fechaHora).format('DD/MM/YYYY HH:mm')}
                                </Typography>
                                <Typography>
                                    Estado: {cita.estado}
                                </Typography>
                                {cita.estado !== 'CANCELADA' && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleCancelarCita(cita.id)}
                                        className="mt-2"
                                    >
                                        Cancelar Cita
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Agendar Nueva Cita</DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <Box className="space-y-4">
                            <TextField
                                fullWidth
                                select
                                label="Paciente"
                                name="pacienteId"
                                value={formik.values.pacienteId}
                                onChange={formik.handleChange}
                                error={formik.touched.pacienteId && Boolean(formik.errors.pacienteId)}
                                helperText={formik.touched.pacienteId && formik.errors.pacienteId}
                                disabled={loading || pacientesList.length === 0}
                            >
                                {pacientesList.map((paciente) => (
                                    <MenuItem key={paciente.id} value={paciente.id}>
                                        {paciente.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                select
                                label="Doctor"
                                name="doctorId"
                                value={formik.values.doctorId}
                                onChange={formik.handleChange}
                                error={formik.touched.doctorId && Boolean(formik.errors.doctorId)}
                                helperText={formik.touched.doctorId && formik.errors.doctorId}
                                disabled={loading || doctoresList.length === 0}
                            >
                                {doctoresList.map((doctor) => (
                                    <MenuItem key={doctor.id} value={doctor.id}>
                                        {doctor.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Seleccionar Fecha"
                                    value={selectedDate}
                                    onChange={(value) => setSelectedDate(value)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            disabled: !formik.values.doctorId || loading,
                                        },
                                    }}
                                />
                            </LocalizationProvider>

                            {horariosDisponibles.length > 0 && (
                                <TextField
                                    fullWidth
                                    select
                                    label="Horario Disponible"
                                    name="horarioId"
                                    value={formik.values.horarioId}
                                    onChange={formik.handleChange}
                                    error={formik.touched.horarioId && Boolean(formik.errors.horarioId)}
                                    helperText={formik.touched.horarioId && formik.errors.horarioId}
                                >
                                    {horariosDisponibles.map((horario) => (
                                        <MenuItem key={horario.id} value={horario.id}>
                                            {dayjs(horario.inicio).format('HH:mm')} - {dayjs(horario.fin).format('HH:mm')}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}

                            {formik.values.doctorId && selectedDate && horariosDisponibles.length === 0 && (
                                <Alert severity="info">
                                    No hay horarios disponibles para la fecha seleccionada
                                </Alert>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading || horariosDisponibles.length === 0}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Agendar'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}