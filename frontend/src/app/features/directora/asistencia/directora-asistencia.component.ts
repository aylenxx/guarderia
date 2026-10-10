import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AsistenciaGeneralDto } from '../../../core/models/asistencia-general.models';

@Component({
  selector: 'app-directora-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './directora-asistencia.component.html',
  styleUrls: ['./directora-asistencia.component.css']
})
export class DirectoraAsistenciaComponent implements OnInit {
  asistencias: AsistenciaGeneralDto[] = [];
  fechaInicio: string = new Date().toISOString().split('T')[0];
  fechaFin: string = new Date().toISOString().split('T')[0];
  cargando: boolean = false;
  mensajeError: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.consultarAsistencia();
  }

  consultarAsistencia(): void {
    if (!this.fechaInicio || !this.fechaFin) return;
    
    if (this.fechaInicio > this.fechaFin) {
        this.mensajeError = 'La fecha de inicio no puede ser mayor a la fecha de fin.';
        this.asistencias = [];
        return;
    }

    this.cargando = true;
    this.mensajeError = '';
    
    this.http.get<AsistenciaGeneralDto[]>(`http://localhost:8080/api/asistencias/general?fechaInicio=${this.fechaInicio}&fechaFin=${this.fechaFin}`)
      .subscribe({
        next: (data) => {
          this.asistencias = data;
          this.cargando = false;
        },
        error: (err) => {
          this.mensajeError = 'Error al cargar la asistencia consolidada.';
          this.cargando = false;
        }
      });
  }
}
