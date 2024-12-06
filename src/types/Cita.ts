export interface Cita {
    id: string;
    paciente: {
      id: string;
      nombre: string;
    };
    doctor: {
      id: string;
      nombre: string;
    };
    fechaHora: string;
    estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';
  }