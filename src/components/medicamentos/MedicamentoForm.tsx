import { useFormik } from "formik";
import { useMedicamentosStore } from "../../store/medicamentosStore";
import * as Yup from "yup";
import { Button, TextField, Typography } from "@mui/material";

const MedicamentoForm: React.FC = () => {

    const { crearOModificarMedicamento } = useMedicamentosStore();

    const formik = useFormik({
        initialValues: {
          id: '',
          nombre: '',
          descripcion: '',
          cantidadEnStock: 0,
          laboratorio: '',
          precio: 0,
          urlImagen: '',
        },
        validationSchema: Yup.object({
          nombre: Yup.string().required('El nombre es obligatorio'),
          descripcion: Yup.string().required('La descripción es obligatoria'),
          cantidadEnStock: Yup.number().min(0, 'Cantidad no puede ser negativa').required('La cantidad es obligatoria'),
          laboratorio: Yup.string().required('El laboratorio es obligatorio'),
          precio: Yup.number().min(0, 'El precio debe ser positivo').required('El precio es obligatorio'),
        }),
        onSubmit: async (values, { resetForm }) => {
          const success = await crearOModificarMedicamento(values);
          if (success) {
            alert('Medicamento guardado exitosamente.');
            resetForm();
          } else {
            alert('Error al guardar el medicamento.');
          }
        },
      });

  return (
    <div className="p-4 border border-gray-300 rounded">
      <Typography variant="h5" className="mb-4">
        Crear o Modificar Medicamento
      </Typography>
      <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-4">
        <TextField
          label="Nombre"
          name="nombre"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={formik.values.descripcion}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
          helperText={formik.touched.descripcion && formik.errors.descripcion}
        />
        <TextField
          label="Cantidad en Stock"
          name="cantidadEnStock"
          type="number"
          value={formik.values.cantidadEnStock}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.cantidadEnStock && Boolean(formik.errors.cantidadEnStock)}
          helperText={formik.touched.cantidadEnStock && formik.errors.cantidadEnStock}
        />
        <TextField
          label="Laboratorio"
          name="laboratorio"
          value={formik.values.laboratorio}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.laboratorio && Boolean(formik.errors.laboratorio)}
          helperText={formik.touched.laboratorio && formik.errors.laboratorio}
        />
        <TextField
          label="Precio"
          name="precio"
          type="number"
          value={formik.values.precio}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.precio && Boolean(formik.errors.precio)}
          helperText={formik.touched.precio && formik.errors.precio}
        />
        <TextField
          label="URL Imagen"
          name="urlImagen"
          value={formik.values.urlImagen}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <Button type="submit" variant="contained" color="primary">
          Guardar Medicamento
        </Button>
      </form>
    </div>
  )
}

export default MedicamentoForm