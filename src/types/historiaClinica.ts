import { Paciente } from "./paciente";

export interface HistoriaClinica {
    id: number;
    detalles: string;
    fechaCreacion: string;
    paciente: Paciente;
  }