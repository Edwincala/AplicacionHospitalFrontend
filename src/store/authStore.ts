import {create} from "zustand";
import { User } from "../types/User";
import api from "../services/api";
import { LoginResponse } from "../types/LoginResponse";


interface AuthState {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  
  login: async (username: string, password: string) => {
    try {
        const response = await api.post<LoginResponse>('/auth/login', {
            username,
            password
        });
        
        const userData: User = {
            username: username, // Añadimos el username
            nombre: response.data.nombre,
            apellido: response.data.apellido,
            role: response.data.role
        };
        
        set({ user: userData });
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
    } catch (error) {
        console.error('Error en login:', error);
        return false;
    }
},

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  }
}));