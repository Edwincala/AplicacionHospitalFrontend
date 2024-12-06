export interface HorarioDoctor {
    id: string;
    doctor: {
      id: string;
      nombre: string;
    };
    inicio: string;
    fin: string;
    disponible: boolean;
  }