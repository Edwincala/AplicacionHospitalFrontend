import { Button, MenuItem, TextField, Typography } from "@mui/material";
import useUserStore from "../../store/userStore";
import { useState } from "react";
import { Rol } from "../../store/userStore";

const roles: Rol[] = ['DOCTOR', 'ADMINISTRATIVO', 'PACIENTE'];

const UsuarioForm: React.FC = () => {
    const { addUsuario } = useUserStore();
    const [formData, setFormData] = useState<{
        nombre: string;
        apellido: string;
        username: string;
        rol: Rol; // Asegúrate de usar Rol en lugar de string
    }>({
        nombre: '',
        apellido: '',
        username: '',
        rol: 'PACIENTE', // Valor por defecto válido para Rol
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: name === 'rol' ? (value as Rol) : value, // Convierte el valor de rol explícitamente a tipo Rol
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addUsuario(formData);
        setFormData({ nombre: '', apellido: '', username: '', rol: 'PACIENTE' });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white shadow rounded-md">
            <Typography variant="h5">Crear Usuario</Typography>
            <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
            />
            <TextField
                fullWidth
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
            />
            <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
            />
            <TextField
                fullWidth
                select
                label="Rol"
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
            >
                {roles.map((rol) => (
                    <MenuItem key={rol} value={rol}>
                        {rol}
                    </MenuItem>
                ))}
            </TextField>
            <Button type="submit" variant="contained" color="primary">
                Crear Usuario
            </Button>
        </form>
    );
};

export default UsuarioForm;