import { create } from "zustand";
import { HistoriaClinica } from "../types/historiaClinica";
import api from "../services/api";

const HISTORIA_MOCK = {
    id: 1,
    detalles: "Paciente con historial de hipertensión arterial. Control regular cada 3 meses. Último control mostró presión arterial de 135/85. Realiza ejercicio moderado 3 veces por semana. Dieta baja en sodio. Medicación actual: Losartán 50mg/día.",
    fechaCreacion: "2024-12-06",
    paciente: {
      id: "2f25387e-8af2-483d-a7d8-ce60aaf01ab0",
      nombre: "Usuario",
      apellido: "Prueba"
    }
  };

interface HistoriasClinicasState {
    historias: HistoriaClinica[];
    selectedHistoria: HistoriaClinica | null;
    loading: boolean;
    error: string | null;
    consejo: string | null;
    loadingConsejo: boolean;
    obtenerHistorias: () => Promise<void>;
    obtenerHistoriaPorPaciente: (pacienteId: string) => Promise<void>;
    actualizarHistoria: (id: number, detalles: string) => Promise<boolean>;
    obtenerConsejoDeSalud: (historiaId: number) => Promise<void>;
}


const useHistoriasClinicasStore = create<HistoriasClinicasState>((set) => ({
    historias: [HISTORIA_MOCK],
    selectedHistoria: HISTORIA_MOCK,
    loading: false,
    error: null,
    consejo: null,
    loadingConsejo: false,

    obtenerHistorias: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get<HistoriaClinica[]>('/historiasClinicas');
            set({ historias: response.data, loading: false });
        } catch (error: any) {
            set({ 
                error: 'Error al obtener las historias clínicas', 
                loading: false 
            });
        }
    },

    obtenerHistoriaPorPaciente: async (pacienteId: string) => {
        set({ loading: true, error: null });
        try {
          // Simulamos una llamada al backend
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ 
            selectedHistoria: HISTORIA_MOCK,
            loading: false 
          });
        } catch (error: any) {
          set({ error: 'Error al obtener la historia clínica', loading: false });
        }
      },

    actualizarHistoria: async (id: number, detalles: string) => {
        set({ loading: true, error: null });
        try {
            const response = await api.put(`/historiasClinicas/${id}`, { detalles });
            if (response.status === 200) {
                set((state) => ({
                    historias: state.historias.map(historia =>
                        historia.id === id ? { ...historia, detalles } : historia
                    ),
                    loading: false
                }));
                return true;
            }
            return false;
        } catch (error: any) {
            const errorMessage = error.response?.status === 403 
                ? 'No tienes permiso para editar esta historia clínica'
                : 'Error al actualizar la historia clínica';
            set({ error: errorMessage, loading: false });
            return false;
        }
    },

    obtenerConsejoDeSalud: async (historiaId: number) => {
        set({ loadingConsejo: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          const consejoMock = "Basado en su historial de hipertensión, se recomienda:\n" +
            "1. Mantener el control regular de la presión arterial\n" +
            "2. Continuar con la dieta baja en sodio\n" +
            "3. Mantener la rutina de ejercicio moderado\n" +
            "4. Tomar la medicación según lo prescrito\n" +
            "5. Evitar el consumo excesivo de alcohol y eliminar el tabaco si corresponde";
          
          set({ consejo: consejoMock, loadingConsejo: false });
        } catch (error: any) {
          set({ 
            error: 'Error al obtener el consejo de salud',
            loadingConsejo: false 
          });
        }
      },
}));
  export default useHistoriasClinicasStore;