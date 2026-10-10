import { ContactoAutorizado } from './matricula.models';

export interface FichaNino {
  id: number;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  documentoIdentidad: string;
  fechaNacimiento: string;
  alergias: string;
  indicacionesMedicas: string;
  aulaId: number;
  aulaNombre: string;
  contactos: ContactoAutorizado[];
}

export interface AsistenciaItem {
  ninoId: number;
  nombreCompleto: string;
  documentoIdentidad: string;
  presente: boolean;
  horaRegistro?: string;
  observaciones?: string;
}

export interface AsistenciaRegistroItem {
  ninoId: number;
  presente: boolean;
  observaciones?: string;
}

export interface AsistenciaAulaRequest {
  aulaId: number;
  fecha: string;
  registros: AsistenciaRegistroItem[];
}

export interface AsistenciaAulaResponse {
  aulaId: number;
  aulaNombre: string;
  fecha: string;
  horaRegistroServidor: string;
  totalRegistrados: number;
  totalPresentes: number;
  totalAusentes: number;
  mensaje: string;
}
