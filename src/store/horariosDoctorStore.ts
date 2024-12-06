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
        set({ error: 'Error al obtener los horarios', loading: false });
      }
    },
  
    crearHorario: async (doctorId: string, inicio: string, fin: string) => {
      set({ loading: true, error: null });
      try {
        await api.post('/horarios/crear', {
          doctorId,
          inicio,
          fin
        });
        return true;
      } catch (error) {
        set({ error: 'Error al crear el horario', loading: false });
        return false;
      } finally {
        set({ loading: false });
      }
    },
  
    eliminarHorario: async (horarioId: string) => {
      set({ loading: true, error: null });
      try {
        await api.delete(`/horarios/${horarioId}`);
        set((state) => ({
          horarios: state.horarios.filter(h => h.id !== horarioId)
        }));
        return true;
      } catch (error) {
        set({ error: 'Error al eliminar el horario', loading: false });
        return false;
      } finally {
        set({ loading: false });
      }
    },
  }));
  
  export default useHorariosStore;