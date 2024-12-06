import { useEffect, useState } from "react";
import useHistoriasClinicasStore from "../store/historiasClinicasStore";
import { Alert, Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { Sidebar } from "../components/layouts/Sidebar";
import ConsejosSalud from "../components/historiaClinica/ConsejosSalud";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Dashboard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [historiaId, setHistoriaId] = useState<number | null>(1); // Establecemos un ID por defecto
  const user = useAuthStore(state => state.user);
  const { 
    selectedHistoria, 
    obtenerHistoriaPorPaciente,
    loading, 
    error 
  } = useHistoriasClinicasStore();

  useEffect(() => {
    console.log("User Role:", user?.role);
    console.log("Historia ID:", historiaId);
    const cargarHistoriaClinica = async () => {
      await obtenerHistoriaPorPaciente("2f25387e-8af2-483d-a7d8-ce60aaf01ab0");
    };

    cargarHistoriaClinica();
  }, []);

  useEffect(() => {
    console.log("Selected Historia:", selectedHistoria);
    if (selectedHistoria) {
      setHistoriaId(selectedHistoria.id);
    }
  }, [selectedHistoria]);

  return (
    <Box display="flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Box flexGrow={1} p={3}>
        <h1 className="text-2xl font-bold mb-4">
          Bienvenido, {user?.nombre} {user?.apellido}
        </h1>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {selectedHistoria ? (
              <Box className="mb-4">
                <Typography variant="h5" className="mb-2">
                  Historia Clínica
                </Typography>
                <Card className="mb-4">
                  <CardContent>
                    <Typography variant="body1">
                      {selectedHistoria.detalles}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Typography variant="h5" className="mb-2">
                  Consejo de salud personalizado
                </Typography>
                {historiaId && <ConsejosSalud historiaId={historiaId} />}
              </Box>
            ) : (
              <Typography variant="h5">
                Aún no tienes registros en la historia clínica.
              </Typography>
            )}
          </>
        )}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;