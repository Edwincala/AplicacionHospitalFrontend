import { useEffect, useState} from "react";
import useHistoriasClinicasStore from "../store/historiasClinicasStore";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import HistoriaClinicaForm from "../components/historiaClinica/HistoriaClinicaForm";
import { useAuthStore } from "../store/authStore";
import { HistoriaClinica } from "../types/historiaClinica";
import ConsejosSalud from "../components/historiaClinica/ConsejosSalud";

export const HistoriasClinicas = () => {

    const [openForm, setOpenForm] = useState(false);
  const user = useAuthStore(state => state.user);
  const { 
    historias, 
    loading, 
    error, 
    selectedHistoria,
    obtenerHistoriaPorPaciente,
    actualizarHistoria 
  } = useHistoriasClinicasStore();

  useEffect(() => {
    // Si es un paciente, solo obtener su historia
    if (user?.role === 'PACIENTE') {
      obtenerHistoriaPorPaciente(user.id);
    }
    // Si es doctor, podría ver una lista o búsqueda de pacientes
  }, [user]);

  const handleSubmit = async (detalles: string) => {
    if (!selectedHistoria || user?.role !== 'DOCTOR') return;
    
    const success = await actualizarHistoria(selectedHistoria.id, detalles);
    if (success) {
      setOpenForm(false);
    }
  };

    return (
        <Box className="p-4">
      <Typography variant="h4" className="mb-4">
        {user?.role === 'PACIENTE' ? 'Mi Historia Clínica' : 'Historias Clínicas'}
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <Box className="flex justify-center">
          <CircularProgress />
        </Box>
      ) : user?.role === 'PACIENTE' ? (
        // Vista para pacientes
        selectedHistoria ? (
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6">Detalles de la Historia Clínica</Typography>
                <Typography>{selectedHistoria.detalles}</Typography>
                {/* Mostrar consejos de salud solo para pacientes */}
                <ConsejosSalud historiaId={selectedHistoria.id} />
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Alert severity="info">No se encontró historia clínica</Alert>
        )
      ) : (
        // Vista para doctores
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenForm(true)}
            className="mb-4"
          >
            Nueva Historia Clínica
          </Button>

          {/* Lista de historias clínicas para doctores */}
          <Grid container spacing={2}>
            {historias.map((historia: HistoriaClinica) => (
              <Grid item xs={12} md={6} lg={4} key={historia.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      Paciente: {historia.paciente.nombre}
                    </Typography>
                    <Typography>
                      Fecha: {dayjs(historia.fechaCreacion).format('DD/MM/YYYY')}
                    </Typography>
                    <Typography className="mt-2">
                      {historia.detalles}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setOpenForm(true);
                      }}
                      className="mt-2"
                    >
                      Editar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      
      <HistoriaClinicaForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        initialDetalles={selectedHistoria?.detalles}
        mode={selectedHistoria ? 'edit' : 'create'}
        loading={loading}
        error={error}
      />
    </Box>
    );
}