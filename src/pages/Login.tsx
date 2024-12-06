import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authStore.ts";
import { Button, Card, CardContent, TextField, Typography } from "@mui/material";


export const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(username, password);
      
      if (success) {
        // Log para debug
        console.log('Login exitoso, redirigiendo...');
        navigate('/dashboard', { replace: true });
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error durante el login:', err);
      setError('Error al intentar iniciar sesión');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardContent>
          <Typography variant="h5" className="mb-4 text-center">
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Usuario"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin/doctor/paciente"
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Cualquier contraseña"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700"
            >
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};