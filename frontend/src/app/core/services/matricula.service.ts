import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aula, MatriculaDetalleResponse, MatriculaRequest, MatriculaResponse } from '../models/matricula.models';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/matriculas';

  public getAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${this.API_URL}/aulas`);
  }

  public registrarMatricula(data: MatriculaRequest): Observable<MatriculaResponse> {
    return this.http.post<MatriculaResponse>(this.API_URL, data);
  }

  public getMatriculados(): Observable<MatriculaResponse[]> {
    return this.http.get<MatriculaResponse[]>(this.API_URL);
  }

  public getNinoPorId(id: number): Observable<MatriculaDetalleResponse> {
    return this.http.get<MatriculaDetalleResponse>(`${this.API_URL}/${id}`);
  }

  public actualizarMatricula(id: number, data: MatriculaRequest): Observable<MatriculaResponse> {
    return this.http.put<MatriculaResponse>(`${this.API_URL}/${id}`, data);
  }
}
