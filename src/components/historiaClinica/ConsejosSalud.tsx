import { Alert, Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import useHistoriasClinicasStore from "../../store/historiasClinicasStore";

interface ConsejosSaludProps {
    historiaId: number;
  }

  const ConsejosSalud: React.FC<ConsejosSaludProps> = ({historiaId}) => {
    const { consejo, loadingConsejo, error, obtenerConsejoDeSalud } = useHistoriasClinicasStore();
  
    useEffect(() => {
      console.log("Requesting consejo for historia ID:", historiaId);
      if (historiaId) {
        obtenerConsejoDeSalud(historiaId);
      }
    }, [historiaId]);
  
    console.log("Current consejo state:", { consejo, loadingConsejo, error });
  
    if (loadingConsejo) {
      return (
        <Box className="flex justify-center p-4">
          <CircularProgress />
        </Box>
      );
    }
  
    if (error) {
      return (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      );
    }
  
    if (!consejo) {
      return (
        <Alert severity="info">
          No hay consejos de salud disponibles en este momento.
        </Alert>
      );
    }
  
    return (
      <Card className="mt-4">
        <CardContent>
          <Typography variant="h6" className="mb-2">
            Consejo de Salud Personalizado
          </Typography>
          <Typography>
            {consejo}
          </Typography>
        </CardContent>
      </Card>
    );
  };

export default ConsejosSalud