import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface HistoriaClinicaFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (detalles: string) => Promise<void>;
    initialDetalles?: string;
    loading?: boolean;
    error?: string | null;
    mode: 'create' | 'edit';
  }

  const validationSchema = Yup.object({
    detalles: Yup.string()
      .required('Los detalles son requeridos')
      .min(10, 'Los detalles deben tener al menos 10 caracteres'),
  });

const HistoriaClinicaForm:React.FC<HistoriaClinicaFormProps> = ({open, onClose, onSubmit, initialDetalles, loading, error, mode}) => {
  
    const formik = useFormik({
        initialValues: {
          detalles: initialDetalles || '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
          await onSubmit(values.detalles);
        },});

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {mode === 'create' ? 'Crear Nueva Historia Clínica' : 'Editar Historia Clínica'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              multiline
              rows={8}
              name="detalles"
              label="Detalles"
              value={formik.values.detalles}
              onChange={formik.handleChange}
              error={formik.touched.detalles && Boolean(formik.errors.detalles)}
              helperText={formik.touched.detalles && formik.errors.detalles}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : mode === 'create' ? 'Crear' : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
  )
}

export default HistoriaClinicaForm