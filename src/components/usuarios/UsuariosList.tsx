import { useEffect } from "react";
import useUserStore from "../../store/userStore";
import { Button, Typography } from "@mui/material";

const UsuariosList: React.FC = () => {

    const {usuarios, fetchUsuarios, deleteUsuario} = useUserStore();
    
    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);
    
  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-4">
        Gestión de Usuarios
      </Typography>
      <div className="space-y-4">
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow"
          >
            <div>
              <Typography>
                <strong>{usuario.nombre} {usuario.apellido}</strong> - {usuario.rol}
              </Typography>
              <Typography color="textSecondary">{usuario.username}</Typography>
            </div>
            <Button
              variant="outlined"
              color="error"
              onClick={() => deleteUsuario(usuario.id)}
            >
              Eliminar
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UsuariosList