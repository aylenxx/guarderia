import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsistenciaAulaRequest, AsistenciaAulaResponse, AsistenciaItem, FichaNino } from '../models/asistencia.models';
import { Aula } from '../models/matricula.models';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/asistencias';
  private readonly AULAS_URL = 'http://localhost:8080/api/matriculas/aulas';

  public getAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(this.AULAS_URL);
  }

  public getFichasPorAula(aulaId: number): Observable<FichaNino[]> {
    return this.http.get<FichaNino[]>(`${this.API_URL}/fichas/aula/${aulaId}`);
  }

  public getAsistenciaAula(aulaId: number, fecha?: string): Observable<AsistenciaItem[]> {
    let params = new HttpParams();
    if (fecha) {
      params = params.set('fecha', fecha);
    }
    return this.http.get<AsistenciaItem[]>(`${this.API_URL}/aula/${aulaId}`, { params });
  }

  public registrarAsistencia(request: AsistenciaAulaRequest): Observable<AsistenciaAulaResponse> {
    return this.http.post<AsistenciaAulaResponse>(`${this.API_URL}/aula`, request);
  }
}
