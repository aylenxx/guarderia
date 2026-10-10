import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatriculaService } from '../../../core/services/matricula.service';
import { MatriculaResponse } from '../../../core/models/matricula.models';

@Component({
  selector: 'app-matricula-lista',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="header-card">
        <div class="header-left">
          <div class="badge-tag">Rol Directora</div>
          <h2>Gestión y Modificación de Niños Matriculados</h2>
          <p class="subtitle">Consulta los datos de los niños registrados y actualiza su información personal, aula o contactos autorizados.</p>
        </div>
        <div class="header-actions">
          <a routerLink="/directora" class="btn-secondary">← Volver al Panel</a>
          <a routerLink="/directora/matricula" class="btn-primary">+ Nueva Matrícula</a>
        </div>
      </div>

      <!-- Barra de búsqueda y filtros -->
      <div class="filter-card">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Buscar por nombre, apellido o DNI del niño..."
            class="search-input"
          />
        </div>
        <div class="stats-summary">
          <div class="stat-item">
            <span class="stat-number">{{ ninos.length }}</span>
            <span class="stat-label">Total Matriculados</span>
          </div>
          <div class="stat-item alert-stat">
            <span class="stat-number">{{ totalConAlergias }}</span>
            <span class="stat-label">Con Alergias / Indicaciones</span>
          </div>
        </div>
      </div>

      <!-- Estado de carga -->
      <div *ngIf="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando lista de niños matriculados...</p>
      </div>

      <!-- Error al cargar -->
      <div *ngIf="errorCarga" class="error-state">
        <p>⚠️ {{ errorCarga }}</p>
        <button (click)="cargarNinos()" class="btn-secondary">Reintentar</button>
      </div>

      <!-- Sin resultados -->
      <div *ngIf="!cargando && !errorCarga && ninosFiltrados.length === 0" class="empty-state">
        <div class="empty-icon">📂</div>
        <h3>No se encontraron niños registrados</h3>
        <p *ngIf="searchTerm">No hay coincidencias para el término "{{ searchTerm }}".</p>
        <p *ngIf="!searchTerm">Aún no se ha realizado ninguna matrícula en el sistema.</p>
      </div>

      <!-- Listado de niños -->
      <div *ngIf="!cargando && ninosFiltrados.length > 0" class="children-grid">
        <div *ngFor="let nino of ninosFiltrados" class="child-card">
          <div class="card-header">
            <div class="avatar-circle">
              {{ nino.nombres.charAt(0) }}{{ nino.apellidos.charAt(0) }}
            </div>
            <div class="child-info">
              <h3>{{ nino.nombreCompleto }}</h3>
              <div class="dni-pill">DNI: {{ nino.documentoIdentidad }}</div>
            </div>
            <span class="aula-badge">{{ nino.aulaNombre }}</span>
          </div>

          <div class="card-body">
            <div class="detail-row">
              <span class="detail-label">Fecha Nac.:</span>
              <span class="detail-value">{{ nino.fechaNacimiento }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Contactos de Recojo:</span>
              <span class="detail-value">👥 {{ nino.totalContactos }} autorizado(s)</span>
            </div>

            <!-- Resaltado de Alergias e Indicaciones Médicas -->
            <div *ngIf="nino.alergias" class="medical-badge allergy-badge">
              <span class="badge-icon">⚠️</span>
              <div>
                <strong>Alergias:</strong> {{ nino.alergias }}
              </div>
            </div>

            <div *ngIf="nino.indicacionesMedicas" class="medical-badge medical-note">
              <span class="badge-icon">🩺</span>
              <div>
                <strong>Indicaciones:</strong> {{ nino.indicacionesMedicas }}
              </div>
            </div>

            <div *ngIf="!nino.alergias && !nino.indicacionesMedicas" class="no-medical-badge">
              <span>✓ Sin alergias registradas</span>
            </div>
          </div>

          <div class="card-footer">
            <a [routerLink]="['/directora/ninos/editar', nino.id]" class="btn-edit">
              ✏️ Modificar Datos
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1100px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }
    .header-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.75rem 2rem;
      border: 1px solid #e2e8f0;
      border-top: 5px solid #7c3aed;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .badge-tag {
      display: inline-block;
      background: #ede9fe;
      color: #6d28d9;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h2 {
      font-size: 1.5rem;
      color: #1e293b;
      margin: 0 0 0.35rem 0;
    }
    .subtitle {
      color: #64748b;
      font-size: 0.9rem;
      margin: 0;
    }
    .header-actions {
      display: flex;
      gap: 0.75rem;
    }
    .btn-primary {
      background: #7c3aed;
      color: #ffffff;
      padding: 0.65rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn-primary:hover {
      background: #6d28d9;
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
      transition: all 0.2s;
    }
    .btn-secondary:hover {
      background: #e2e8f0;
    }

    .filter-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1rem 1.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .search-box {
      display: flex;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 0.5rem 0.85rem;
      flex: 1;
      min-width: 280px;
    }
    .search-icon {
      margin-right: 0.5rem;
      font-size: 1rem;
    }
    .search-input {
      border: none;
      outline: none;
      background: transparent;
      width: 100%;
      font-size: 0.9rem;
      color: #1e293b;
    }
    .stats-summary {
      display: flex;
      gap: 1.25rem;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 0.4rem 0.85rem;
      border-radius: 6px;
    }
    .alert-stat {
      background: #fffbeb;
      border-color: #fde68a;
    }
    .stat-number {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
    }
    .alert-stat .stat-number {
      color: #b45309;
    }
    .stat-label {
      font-size: 0.75rem;
      color: #64748b;
    }

    .loading-state, .empty-state, .error-state {
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
      border: 4px solid #ede9fe;
      border-top-color: #7c3aed;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem auto;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .children-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }
    .child-card {
      background: #ffffff;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .child-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
    }
    .card-header {
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .avatar-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #ede9fe;
      color: #6d28d9;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
    }
    .child-info {
      flex: 1;
    }
    .child-info h3 {
      font-size: 1rem;
      color: #1e293b;
      margin: 0 0 0.2rem 0;
    }
    .dni-pill {
      font-size: 0.75rem;
      color: #64748b;
      font-family: monospace;
    }
    .aula-badge {
      background: #e0f2fe;
      color: #0369a1;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
    }
    .detail-label {
      color: #64748b;
    }
    .detail-value {
      color: #1e293b;
      font-weight: 500;
    }

    /* Resaltado médico */
    .medical-badge {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      line-height: 1.35;
    }
    .allergy-badge {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
    }
    .medical-note {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
    }
    .no-medical-badge {
      font-size: 0.75rem;
      color: #16a34a;
      background: #f0fdf4;
      padding: 0.35rem 0.65rem;
      border-radius: 4px;
      border: 1px solid #dcfce7;
    }

    .card-footer {
      padding: 1rem 1.25rem;
      background: #f8fafc;
      border-top: 1px solid #f1f5f9;
    }
    .btn-edit {
      display: block;
      text-align: center;
      background: #ffffff;
      color: #6d28d9;
      border: 1px solid #c4b5fd;
      padding: 0.55rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-edit:hover {
      background: #7c3aed;
      color: #ffffff;
      border-color: #7c3aed;
    }
  `]
})
export class MatriculaListaComponent implements OnInit {
  private readonly matriculaService = inject(MatriculaService);

  public ninos: MatriculaResponse[] = [];
  public searchTerm: string = '';
  public cargando: boolean = true;
  public errorCarga: string | null = null;

  ngOnInit(): void {
    this.cargarNinos();
  }

  public cargarNinos(): void {
    this.cargando = true;
    this.errorCarga = null;
    this.matriculaService.getMatriculados().subscribe({
      next: (data) => {
        this.ninos = data;
        this.cargando = false;
      },
      error: () => {
        this.errorCarga = 'No se pudo cargar la lista de niños matriculados.';
        this.cargando = false;
      }
    });
  }

  public get ninosFiltrados(): MatriculaResponse[] {
    if (!this.searchTerm.trim()) {
      return this.ninos;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.ninos.filter(n =>
      n.nombreCompleto.toLowerCase().includes(term) ||
      n.documentoIdentidad.includes(term) ||
      n.aulaNombre.toLowerCase().includes(term)
    );
  }

  public get totalConAlergias(): number {
    return this.ninos.filter(n => (n.alergias && n.alergias.trim().length > 0) || (n.indicacionesMedicas && n.indicacionesMedicas.trim().length > 0)).length;
  }
}
