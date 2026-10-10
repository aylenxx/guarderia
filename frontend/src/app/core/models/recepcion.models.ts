import { ContactoAutorizado } from './matricula.models';

export interface VerificacionRecojo {
  ninoId: number;
  nombreCompleto: string;
  documentoIdentidad: string;
  aulaNombre: string;
  alergias: string;
  indicacionesMedicas: string;
  personasAutorizadas: ContactoAutorizado[];
}

export type TipoMovimiento = 'ENTRADA' | 'SALIDA';

export interface MarcadoEntradaSalidaRequest {
  ninoId: number;
  tipo: TipoMovimiento;
  personaEntregaRecoge: string;
  dniPersona?: string;
  observaciones?: string;
}

export interface MarcadoEntradaSalidaResponse {
  id: number;
  ninoId: number;
  nombreNino: string;
  documentoNino: string;
  aulaNombre: string;
  tipo: TipoMovimiento;
  fecha: string;
  horaServidor: string;
  personaEntregaRecoge: string;
  dniPersona: string;
  observaciones: string;
  mensaje: string;
}
