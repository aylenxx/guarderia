import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from '../../../core/services/asistencia.service';
import { AsistenciaAulaRequest, AsistenciaAulaResponse, AsistenciaItem } from '../../../core/models/asistencia.models';
import { Aula } from '../../../core/models/matricula.models';

@Component({
  selector: 'app-profesora-asistencia',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="header-card">
        <div>
          <div class="badge-tag">Rol Profesora</div>
          <h2>Registro de Asistencia de Aula</h2>
          <p class="subtitle">Marque la asistencia diaria de los niños de su aula. La hora se obtiene automáticamente del sistema.</p>
        </div>
        <div>
          <a routerLink="/profesora" class="btn-secondary">← Volver al Panel</a>
        </div>
      </div>

      <!-- Alertas de éxito y error -->
      <div *ngIf="successResponse" class="alert-success" role="alert">
        <span class="alert-icon">✅</span>
        <div>
          <strong>{{ successResponse.mensaje }}</strong>
          <div class="response-meta">
            <span>Hora Servidor: <strong>{{ successResponse.horaRegistroServidor }}</strong></span>
            <span>• Presentes: <strong>{{ successResponse.totalPresentes }}</strong></span>
            <span>• Ausentes: <strong>{{ successResponse.totalAusentes }}</strong></span>
          </div>
        </div>
      </div>

      <div *ngIf="errorMessage" class="alert-error" role="alert">
        <span class="alert-icon">⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Filtros de Aula y Fecha -->
      <div class="filter-card">
        <div class="filters-row">
          <div class="filter-group">
            <label for="aulaSelect">Aula:</label>
            <select id="aulaSelect" [(ngModel)]="aulaSeleccionadaId" (change)="cargarAsistencias()" class="form-control">
              <option *ngFor="let aula of aulas" [value]="aula.id">
                {{ aula.nombre }} (Capacidad: {{ aula.capacidad }})
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="fechaSelect">Fecha de Asistencia:</label>
            <input
              id="fechaSelect"
              type="date"
              [(ngModel)]="fechaSeleccionada"
              (change)="cargarAsistencias()"
              class="form-control"
            />
          </div>

          <div class="metrics-pill">
            <div class="metric">
              <span class="metric-num text-green">{{ totalPresentes }}</span>
              <span class="metric-lbl">Presentes</span>
            </div>
            <div class="metric">
              <span class="metric-num text-red">{{ totalAusentes }}</span>
              <span class="metric-lbl">Ausentes</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado de Carga -->
      <div *ngIf="cargando" class="state-card">
        <div class="spinner"></div>
        <p>Cargando lista de niños para asistencia...</p>
      </div>

      <!-- Sin Niños -->
      <div *ngIf="!cargando && items.length === 0" class="state-card">
        <div class="state-icon">🚸</div>
        <h3>No hay niños matriculados en esta aula</h3>
        <p>No es posible registrar asistencia en un aula sin niños activos.</p>
      </div>

      <!-- Lista de Asistencia -->
      <div *ngIf="!cargando && items.length > 0" class="attendance-card">
        <div class="table-header">
          <span>Niño / Documento</span>
          <span>Estado de Asistencia</span>
          <span>Observación Opcional</span>
        </div>

        <div class="table-body">
          <div *ngFor="let item of items; let i = index" class="attendance-row" [class.row-absent]="!item.presente">
            <div class="child-cell">
              <div class="avatar-mini">{{ item.nombreCompleto.charAt(0) }}</div>
              <div>
                <strong>{{ item.nombreCompleto }}</strong>
                <div class="dni-sub">DNI: {{ item.documentoIdentidad }}</div>
              </div>
            </div>

            <div class="status-cell">
              <div class="toggle-buttons">
                <button
                  type="button"
                  (click)="item.presente = true"
                  class="btn-toggle btn-present"
                  [class.active]="item.presente"
                >
                  ✓ Presente
                </button>
                <button
                  type="button"
                  (click)="item.presente = false"
                  class="btn-toggle btn-absent"
                  [class.active]="!item.presente"
                >
                  ✕ Ausente
                </button>
              </div>
              <span *ngIf="item.horaRegistro" class="time-tag">
                🕒 Registrado: {{ item.horaRegistro }}
              </span>
            </div>

            <div class="obs-cell">
              <input
                type="text"
                [(ngModel)]="item.observaciones"
                placeholder="Observación (tardanza, justificación...)"
                class="obs-input"
              />
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="server-notice">
            <span>ℹ️ La fecha y hora de registro son procesadas automáticamente por el servidor.</span>
          </div>
          <button
            type="button"
            (click)="guardarAsistencia()"
            [disabled]="guardando"
            class="btn-save"
          >
            <span *ngIf="!guardando">💾 Guardar Asistencia de Aula</span>
            <span *ngIf="guardando">Guardando en el servidor...</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }
    .header-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.75rem 2rem;
      border: 1px solid #e2e8f0;
      border-top: 5px solid #0284c7;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .badge-tag {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      margin-bottom: 0.4rem;
      text-transform: uppercase;
    }
    h2 {
      font-size: 1.5rem;
      color: #1e293b;
      margin: 0 0 0.25rem 0;
    }
    .subtitle {
      color: #64748b;
      font-size: 0.9rem;
      margin: 0;
    }
    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
      padding: 0.65rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      border: 1px solid #cbd5e1;
    }

    .alert-success {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 1rem 1.25rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .alert-icon {
      font-size: 1.3rem;
    }
    .response-meta {
      font-size: 0.85rem;
      margin-top: 0.35rem;
      color: #15803d;
      display: flex;
      gap: 0.85rem;
    }
    .alert-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 0.85rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    .filters-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .filter-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
    }
    .form-control {
      padding: 0.55rem 0.85rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #1e293b;
      background: #ffffff;
    }
    .metrics-pill {
      margin-left: auto;
      display: flex;
      gap: 1.25rem;
      background: #f8fafc;
      padding: 0.4rem 1rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .metric {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .metric-num {
      font-size: 1.1rem;
      font-weight: 700;
    }
    .metric-lbl {
      font-size: 0.75rem;
      color: #64748b;
    }
    .text-green { color: #16a34a; }
    .text-red { color: #dc2626; }

    .state-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 3rem;
      text-align: center;
      border: 1px solid #e2e8f0;
      color: #64748b;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 4px solid #e0f2fe;
      border-top-color: #0284c7;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem auto;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .state-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .attendance-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
      overflow: hidden;
    }
    .table-header {
      background: #f8fafc;
      padding: 0.85rem 1.25rem;
      display: grid;
      grid-template-columns: 2fr 1.5fr 2fr;
      font-weight: 700;
      font-size: 0.85rem;
      color: #475569;
      border-bottom: 1px solid #e2e8f0;
    }
    .table-body {
      display: flex;
      flex-direction: column;
    }
    .attendance-row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 2fr;
      padding: 1rem 1.25rem;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.15s;
    }
    .attendance-row:hover {
      background: #fcfcfd;
    }
    .row-absent {
      background: #fffafa;
    }
    @media (max-width: 768px) {
      .table-header { display: none; }
      .attendance-row {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
    }

    .child-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .avatar-mini {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #e0f2fe;
      color: #0369a1;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }
    .dni-sub {
      font-size: 0.75rem;
      color: #64748b;
    }

    .status-cell {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .toggle-buttons {
      display: inline-flex;
      background: #f1f5f9;
      border-radius: 6px;
      padding: 0.2rem;
      gap: 0.2rem;
      width: fit-content;
    }
    .btn-toggle {
      border: none;
      padding: 0.35rem 0.75rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      background: transparent;
      color: #64748b;
      transition: all 0.2s;
    }
    .btn-present.active {
      background: #16a34a;
      color: #ffffff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    .btn-absent.active {
      background: #dc2626;
      color: #ffffff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    .time-tag {
      font-size: 0.7rem;
      color: #64748b;
    }

    .obs-cell {
      display: flex;
    }
    .obs-input {
      width: 100%;
      padding: 0.45rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.85rem;
      color: #1e293b;
    }
    .obs-input:focus {
      outline: none;
      border-color: #0284c7;
    }

    .card-footer {
      padding: 1.25rem 1.5rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .server-notice {
      font-size: 0.8rem;
      color: #64748b;
    }
    .btn-save {
      background: #0284c7;
      color: #ffffff;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-save:hover:not(:disabled) {
      background: #0369a1;
    }
    .btn-save:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }
  `]
})
export class ProfesoraAsistenciaComponent implements OnInit {
  private readonly asistenciaService = inject(AsistenciaService);

  public aulas: Aula[] = [];
  public aulaSeleccionadaId: number = 1;
  public fechaSeleccionada: string = new Date().toISOString().substring(0, 10);
  public items: AsistenciaItem[] = [];
  public cargando: boolean = true;
  public guardando: boolean = false;
  public successResponse: AsistenciaAulaResponse | null = null;
  public errorMessage: string | null = null;

  ngOnInit(): void {
    this.cargarAulas();
  }

  public cargarAulas(): void {
    this.asistenciaService.getAulas().subscribe({
      next: (data) => {
        this.aulas = data;
        if (this.aulas.length > 0) {
          this.aulaSeleccionadaId = this.aulas[0].id;
          this.cargarAsistencias();
        }
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las aulas.';
        this.cargando = false;
      }
    });
  }

  public cargarAsistencias(): void {
    this.cargando = true;
    this.errorMessage = null;
    this.successResponse = null;

    this.asistenciaService.getAsistenciaAula(this.aulaSeleccionadaId, this.fechaSeleccionada).subscribe({
      next: (items) => {
        this.items = items;
        this.cargando = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.mensaje || 'Error al cargar la lista de asistencia.';
        this.cargando = false;
      }
    });
  }

  public get totalPresentes(): number {
    return this.items.filter(i => i.presente).length;
  }

  public get totalAusentes(): number {
    return this.items.filter(i => !i.presente).length;
  }

  public guardarAsistencia(): void {
    if (this.items.length === 0) {
      return;
    }

    this.guardando = true;
    this.errorMessage = null;
    this.successResponse = null;

    const request: AsistenciaAulaRequest = {
      aulaId: this.aulaSeleccionadaId,
      fecha: this.fechaSeleccionada,
      registros: this.items.map(i => ({
        ninoId: i.ninoId,
        presente: i.presente,
        observaciones: i.observaciones || ''
      }))
    };

    this.asistenciaService.registrarAsistencia(request).subscribe({
      next: (res) => {
        this.guardando = false;
        this.successResponse = res;
        this.cargarAsistencias();
      },
      error: (err) => {
        this.guardando = false;
        this.errorMessage = err?.error?.mensaje || 'Error al guardar la asistencia de aula.';
      }
    });
  }
}
