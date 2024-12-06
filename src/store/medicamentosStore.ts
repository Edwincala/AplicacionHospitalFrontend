import { create } from "zustand";
import api from "../services/api";

export interface Medicamento {
    id: string;
    nombre: string;
    descripcion: string;
    cantidadEnStock: number;
    laboratorio: string;
    precio: number;
    urlImagen: string | null;
}

interface MedicamentosState {
    medicamentos: Medicamento[];
    loading: boolean;
    error: string | null;
  
    fetchMedicamentos: () => Promise<void>;
    buscarMedicamentosPorNombre: (nombre: string) => Promise<void>;
    buscarMedicamentosPorLaboratorio: (laboratorio: string, ascendente: boolean) => Promise<void>;
    buscarPorRangoDePrecio: (precioMin: number, precioMax: number) => Promise<void>;
    crearOModificarMedicamento: (medicamento: Omit<Medicamento, 'id'> & { id?: string }) => Promise<boolean>;
    eliminarMedicamento: (id: string) => Promise<boolean>;
  }

  export const useMedicamentosStore = create<MedicamentosState>((set) => ({
    medicamentos: [],
    loading: false,
    error: null,
  
    fetchMedicamentos: async () => {
      set({ loading: true, error: null });
      try {
        const response = await api.get('/medicamentos');
        set({ medicamentos: response.data, loading: false });
      } catch (error) {
        console.error('Error al obtener medicamentos:', error);
        set({ error: 'No se pudieron obtener los medicamentos.', loading: false });
      }
    },
  
    buscarMedicamentosPorNombre: async (nombre) => {
      set({ loading: true, error: null });
      try {
        const response = await api.get(`/medicamentos/nombre/${nombre}`);
        set({ medicamentos: response.data.content, loading: false });
      } catch (error) {
        console.error('Error al buscar medicamentos:', error);
        set({ error: 'No se encontraron medicamentos.', loading: false });
      }
    },
  
    buscarMedicamentosPorLaboratorio: async (laboratorio, ascendente) => {
      set({ loading: true, error: null });
      try {
        const endpoint = ascendente
          ? `/medicamentos/buscar/laboratorio/asc?laboratorio=${laboratorio}`
          : `/medicamentos/buscar/laboratorio/desc?laboratorio=${laboratorio}`;
        const response = await api.get(endpoint);
        set({ medicamentos: response.data, loading: false });
      } catch (error) {
        console.error('Error al buscar medicamentos por laboratorio:', error);
        set({ error: 'No se encontraron medicamentos.', loading: false });
      }
    },
  
    buscarPorRangoDePrecio: async (precioMin, precioMax) => {
      set({ loading: true, error: null });
      try {
        const response = await api.get(`/medicamentos/buscar/precio`, {
          params: { precioMin, precioMax },
        });
        set({ medicamentos: response.data, loading: false });
      } catch (error) {
        console.error('Error al buscar medicamentos por precio:', error);
        set({ error: 'No se encontraron medicamentos.', loading: false });
      }
    },
  
    crearOModificarMedicamento: async (medicamento) => {
      try {
        const response = await api.post('/medicamentos', medicamento);
        return response.status === 200;
      } catch (error) {
        console.error('Error al crear o modificar medicamento:', error);
        return false;
      }
    },
  
    eliminarMedicamento: async (id) => {
      try {
        const response = await api.delete(`/medicamentos/id/${id}`);
        return response.status === 200;
      } catch (error) {
        console.error('Error al eliminar medicamento:', error);
        return false;
      }
    },
  }));