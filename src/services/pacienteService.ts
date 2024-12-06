import api from "./api";
import {Paciente} from "../types/Paciente";

export const getPacientes = async (): Promise<Paciente[]> => {
    const response = await api.get("/pacientes");
    return response.data;
}

export const createPaciente = async (paciente: Paciente): Promise<void> => {
    await api.post("/pacientes", paciente);
}

