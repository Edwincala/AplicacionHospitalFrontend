import { create } from "zustand";
import { HorarioDoctor } from "../types/horarioDoctor";
import api from "../services/api";

interface HorariosStore {
    horarios: HorarioDoctor[];
  loading: boolean;
  error: string | null;
  obtenerHorariosPorDoctor: (doctorId: string) => Promise<void>;
  crearHorario: (doctorId: string, inicio: string, fin: string) => Promise<boolean>;
  eliminarHorario: (horarioId: string) => Promise<boolean>;
}

const useHorariosStore = create<HorariosStore>((set) => ({
  horarios: [],
  loading: false,
  error: null,

  obtenerHorariosPorDoctor: async (doctorId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/horarios/doctor/${doctorId}`);
      set({ horarios: response.data, loading: false });
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      set({ error: 'Error al obtener los horarios', loading: false });
    }
  },

  crearHorario: async (doctorId: string, inicio: string, fin: string) => {
    set({ loading: true, error: null });
    try {
      // Ajustamos para enviar los parámetros en la URL
      const response = await api.post(`/horarios/crear?doctorId=${doctorId}&inicio=${inicio}&fin=${fin}`);
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al crear horario:', error);
      set({ error: 'Error al crear el horario', loading: false });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  eliminarHorario: async (horarioId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/horarios/${horarioId}`);
      if (response.status === 200) {
        set((state) => ({
          horarios: state.horarios.filter(h => h.id !== horarioId)
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      set({ error: 'Error al eliminar el horario', loading: false });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
  
  export default useHorariosStore;