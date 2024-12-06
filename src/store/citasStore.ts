import { create } from "zustand";
import api from "../services/api";
import { Cita } from "../types/Cita";

interface CitasStore {
  citas: Cita[];
  loading: boolean;
  error: string | null;
  obtenerCitasPorPaciente: (pacienteId: string) => Promise<void>;
  agendarCita: (usuarioId: string, pacienteId: string, doctorId: string, fechaHora: string) => Promise<boolean>;
  cancelarCita: (citaId: string) => Promise<boolean>;
}

const useCitasStore = create<CitasStore>((set) => ({
  citas: [],
  loading: false,
  error: null,

  obtenerCitasPorPaciente: async (pacienteId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/citas/paciente/${pacienteId}`);
      set({ citas: response.data, loading: false });
    } catch (error) {
      set({ 
        error: 'Error al obtener las citas', 
        loading: false 
      });
    }
  },

  agendarCita: async (usuarioId: string, pacienteId: string, doctorId: string, fechaHora: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/citas/agendar', null, {
        params: {
          usuarioId,
          pacienteId,
          doctorId,
          fechaHora
        }
      });
      return response.status === 200;
    } catch (error) {
      set({ 
        error: 'Error al agendar la cita', 
        loading: false 
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  cancelarCita: async (citaId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/citas/cancelar/${citaId}`);
      if (response.status === 200) {
        set((state) => ({
          citas: state.citas.map(cita => 
            cita.id === citaId 
              ? { ...cita, estado: 'CANCELADA' as const }
              : cita
          )
        }));
        return true;
      }
      return false;
    } catch (error) {
      set({ 
        error: 'Error al cancelar la cita', 
        loading: false 
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCitasStore;