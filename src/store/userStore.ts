import { create } from "zustand";
import api from "../services/api";

export type Rol = "ADMINISTRATIVO" | "DOCTOR" | "PACIENTE";

interface Usuario {
    id: string;
    nombre: string;
    apellido: string;
    username: string;
    rol: Rol;
    especialidad?: string;  // Para doctores
    direccion?: string;     // Para pacientes
    telefono?: string;      // Para pacientes
}

interface UserStore {
    usuarios: Usuario[];
    loading: boolean;
    error: string | null;
    fetchUsuarios: () => Promise<void>;
    addUsuario: (perfilDto: any) => Promise<void>;
    deleteUsuario: (id: string, tipo: string) => Promise<void>;
}

interface Usuario {
    id: string;
    nombre: string;
    apellido: string;
    username: string;
    rol: Rol;
    especialidad?: string;  // Para doctores
    direccion?: string;     // Para pacientes
    telefono?: string;      // Para pacientes
}

interface UserStore {
    usuarios: Usuario[];
    loading: boolean;
    error: string | null;
    fetchUsuarios: () => Promise<void>;
    addUsuario: (perfilDto: any) => Promise<void>;
    deleteUsuario: (id: string, tipo: string) => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
    usuarios: [],
    loading: false,
    error: null,

    fetchUsuarios: async () => {
        set({ loading: true, error: null });
        try {
            const [empleadosRes, doctoresRes, pacientesRes] = await Promise.all([
                api.get("/empleados"),
                api.get("/doctores"),
                api.get("/pacientes")
            ]);

            // Combinar todos los usuarios
            const allUsers = [
                ...(empleadosRes.data || []),
                ...(doctoresRes.data || []),
                ...(pacientesRes.data || [])
            ];

            // Filtrar duplicados por ID
            const uniqueUsers = allUsers.filter((user, index, self) =>
                index === self.findIndex((u) => u.id === user.id)
            );

            set({ usuarios: uniqueUsers, loading: false });
        } catch (error) {
            console.error("Error fetching usuarios:", error);
            set({ error: "Error al cargar usuarios", loading: false });
        }
    },

    addUsuario: async (usuario) => {
        set({ loading: true, error: null });
        try {
            let response;
            const userData = {
                ...usuario,
                password: usuario.password || "defaultPassword123!", // Contraseña por defecto si no se proporciona
            };

            switch (usuario.rol) {
                case 'DOCTOR':
                    response = await api.post("/doctores", userData);
                    break;
                case 'PACIENTE':
                    response = await api.post("/pacientes", userData);
                    break;
                case 'ADMINISTRATIVO':
                    response = await api.post("/empleados", userData);
                    break;
                default:
                    throw new Error("Rol no válido");
            }

            if (response.status === 200 || response.status === 201) {
                await set((state) => {
                    const newUser = response.data;
                    // Asegurarse de que no haya duplicados al agregar
                    const usuarios = state.usuarios.filter(u => u.id !== newUser.id);
                    return { 
                        usuarios: [...usuarios, newUser],
                        loading: false 
                    };
                });
            }
        } catch (error) {
            console.error("Error adding usuario:", error);
            set({ error: "Error al crear usuario", loading: false });
            throw error;
        }
    },

    deleteUsuario: async (id, tipo) => {
        set({ loading: true, error: null });
        try {
            let endpoint;
            switch (tipo) {
                case 'DOCTOR':
                    endpoint = `/doctores/${id}`;
                    break;
                case 'PACIENTE':
                    endpoint = `/pacientes/id/${id}`;
                    break;
                case 'ADMINISTRATIVO':
                    endpoint = `/empleados/${id}`;
                    break;
                default:
                    throw new Error("Tipo de usuario no válido");
            }

            await api.delete(endpoint);
            set((state) => ({
                usuarios: state.usuarios.filter((u) => u.id !== id),
                loading: false
            }));
        } catch (error) {
            console.error("Error deleting usuario:", error);
            set({ error: "Error al eliminar usuario", loading: false });
            throw error;
        }
    }
}));

export default useUserStore;