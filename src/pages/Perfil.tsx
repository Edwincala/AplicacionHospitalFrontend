import { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";


const Perfil: React.FC = () => {
  const user = useAuthStore(state => state.user);
    const [profileData, setProfileData] = useState({
        nombre: user?.nombre || '',
        apellido: user?.apellido || ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await api.put('/usuarios/perfil', profileData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setSuccess('Perfil actualizado correctamente');
            }
        } catch (err) {
            console.error('Error al actualizar perfil:', err);
            setError('Error al actualizar el perfil');
        }
    };

  return (
    <Paper className="p-6 max-w-2xl mx-auto mt-8">
            <Typography variant="h4" className="mb-6">
                Perfil de Usuario
            </Typography>
            
            {error && (
                <Typography color="error" className="mb-4">
                    {error}
                </Typography>
            )}
            
            {success && (
                <Typography color="success" className="mb-4">
                    {success}
                </Typography>
            )}
            
            <form onSubmit={handleSubmit}>
                <Box className="space-y-4">
                    <TextField
                        fullWidth
                        label="Nombre"
                        value={profileData.nombre}
                        onChange={(e) => setProfileData({
                            ...profileData,
                            nombre: e.target.value
                        })}
                    />
                    
                    <TextField
                        fullWidth
                        label="Apellido"
                        value={profileData.apellido}
                        onChange={(e) => setProfileData({
                            ...profileData,
                            apellido: e.target.value
                        })}
                    />
                    
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="mt-4"
                    >
                        Guardar Cambios
                    </Button>
                </Box>
            </form>
        </Paper>
  );
};

export default Perfil;