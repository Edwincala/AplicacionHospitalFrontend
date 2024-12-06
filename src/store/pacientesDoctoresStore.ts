import { create } from "zustand";
import api from "../services/api";

interface Doctor {
    id: string;
    nombre: string;
    especialidad: string;
  }
  
  interface Paciente {
    id: string;
    nombre: string;
    email: string;
  }
  
  interface DoctoresPacientesStore {
    doctores: Doctor[];
    pacientes: Paciente[];
    loadingDoctores: boolean;
    loadingPacientes: boolean;
    error: string | null;
    obtenerDoctores: () => Promise<void>;
    obtenerPacientes: () => Promise<void>;
  }
  
  const useDoctoresPacientesStore = create<DoctoresPacientesStore>((set) => ({
    doctores: [],
    pacientes: [],
    loadingDoctores: false,
    loadingPacientes: false,
    error: null,
  
    obtenerDoctores: async () => {
      set({ loadingDoctores: true, error: null });
      try {
        const response = await api.get('/doctores');
        set({ doctores: response.data, loadingDoctores: false });
      } catch (error) {
        set({ error: 'Error al obtener los doctores', loadingDoctores: false });
      }
    },
  
    obtenerPacientes: async () => {
      set({ loadingPacientes: true, error: null });
      try {
        const response = await api.get('/pacientes');
        set({ pacientes: response.data, loadingPacientes: false });
      } catch (error) {
        set({ error: 'Error al obtener los pacientes', loadingPacientes: false });
      }
    },
  }));
  
  export default useDoctoresPacientesStore;