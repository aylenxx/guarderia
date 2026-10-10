export type Role = 'DIRECTORA' | 'PROFESORA' | 'RECEPCION';

export interface User {
  username: string;
  nombreCompleto: string;
  rol: Role;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  username: string;
  nombreCompleto: string;
  rol: Role;
}

export interface UserProfile {
  id: number;
  username: string;
  nombreCompleto: string;
  rol: Role;
}
