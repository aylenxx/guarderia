export interface Aula {
  id: number;
  nombre: string;
  capacidad: number;
}

export interface ContactoAutorizado {
  id?: number;
  nombres: string;
  apellidos: string;
  parentesco: string;
  telefono: string;
  documentoIdentidad: string;
}

export interface MatriculaRequest {
  nombres: string;
  apellidos: string;
  documentoIdentidad: string;
  fechaNacimiento: string;
  alergias?: string;
  indicacionesMedicas?: string;
  aulaId: number;
  contactos: ContactoAutorizado[];
}

export interface MatriculaResponse {
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
  fechaMatricula: string;
  totalContactos: number;
  mensaje: string;
}

export interface MatriculaDetalleResponse {
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
  fechaMatricula: string;
  activo: boolean;
  contactos: ContactoAutorizado[];
}
