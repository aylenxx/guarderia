import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarcadoEntradaSalidaRequest, MarcadoEntradaSalidaResponse, VerificacionRecojo } from '../models/recepcion.models';

@Injectable({
  providedIn: 'root'
})
export class RecepcionService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/recepcion';

  public consultarAutorizados(termino?: string): Observable<VerificacionRecojo[]> {
    let params = new HttpParams();
    if (termino && termino.trim().length > 0) {
      params = params.set('termino', termino.trim());
    }
    return this.http.get<VerificacionRecojo[]>(`${this.API_URL}/autorizados`, { params });
  }

  public registrarMarcado(request: MarcadoEntradaSalidaRequest): Observable<MarcadoEntradaSalidaResponse> {
    return this.http.post<MarcadoEntradaSalidaResponse>(`${this.API_URL}/marcado`, request);
  }

  public listarMarcadosHoy(): Observable<MarcadoEntradaSalidaResponse[]> {
    return this.http.get<MarcadoEntradaSalidaResponse[]>(`${this.API_URL}/marcados-hoy`);
  }
}
