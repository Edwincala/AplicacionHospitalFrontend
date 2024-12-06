import { create } from "zustand";
import { Cita } from "../types/Cita";
import api from "../services/api";

export interface CitaDoctor extends Cita {
    observaciones?: string;
  }
  
  // Store para las citas del doctor
  interface CitasDoctorStore {
    citasDoctor: CitaDoctor[];
    loading: boolean;
    error: string | null;
    obtenerCitasDoctor: (username: string) => Promise<void>;
    marcarCitaCompletada: (citaId: string, observaciones: string) => Promise<boolean>;
  }
  
  const useCitasDoctorStore = create<CitasDoctorStore>((set) => ({
    citasDoctor: [],
    loading: false,
    error: null,
  
    obtenerCitasDoctor: async (username: string) => {
      set({ loading: true, error: null });
      try {
        // Primero obtenemos el ID del doctor usando su username
        const doctorResponse = await api.get(`/doctores/buscar/${username}`);
        const doctorId = doctorResponse.data.id;
        
        const response = await api.get(`/citas/doctor/${doctorId}`);
        set({ citasDoctor: response.data, loading: false });
      } catch (error) {
        console.error('Error al obtener las citas:', error);
        set({ error: 'Error al obtener las citas', loading: false });
      }
    },
  
    marcarCitaCompletada: async (citaId: string, observaciones: string) => {
      set({ loading: true, error: null });
      try {
        const response = await api.post(`/citas/${citaId}/completar`, { observaciones });
        if (response.status === 200) {
          set((state) => ({
            citasDoctor: state.citasDoctor.map(cita => 
              cita.id === citaId 
                ? { ...cita, estado: 'COMPLETADA', observaciones }
                : cita
            ),
            loading: false
          }));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error al completar la cita:', error);
        set({ error: 'Error al completar la cita', loading: false });
        return false;
      }
    },
  }));

  export default useCitasDoctorStore;