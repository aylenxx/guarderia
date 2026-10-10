import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from '../../../core/services/asistencia.service';
import { FichaNino } from '../../../core/models/asistencia.models';
import { Aula } from '../../../core/models/matricula.models';

@Component({
  selector: 'app-profesora-fichas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="header-card">
        <div>
          <div class="badge-tag">Rol Profesora</div>
          <h2>Consulta de Fichas de Niños</h2>
          <p class="subtitle">Visualización inmediata de información médica, alergias prioritarias y personas autorizadas de su aula.</p>
        </div>
        <div>
          <a routerLink="/profesora" class="btn-secondary">← Volver al Panel</a>
        </div>
      </div>

      <!-- Selector de Aula y Búsqueda -->
      <div class="controls-card">
        <div class="control-group">
          <label for="aulaSelect">Seleccionar Aula:</label>
          <select id="aulaSelect" [(ngModel)]="aulaSeleccionadaId" (change)="cargarFichas()" class="select-aula">
            <option *ngFor="let aula of aulas" [value]="aula.id">
              {{ aula.nombre }} (Capacidad: {{ aula.capacidad }})
            </option>
          </select>
        </div>

        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Buscar por nombre o DNI del niño..."
            class="search-input"
          />
        </div>

        <div class="alert-summary">
          <span class="alert-count">{{ totalConAlergias }}</span>
          <span class="alert-text">con Alergias / Indicaciones Médicas</span>
        </div>
      </div>

      <!-- Estados de carga y error -->
      <div *ngIf="cargando" class="state-card">
        <div class="spinner"></div>
        <p>Cargando fichas de niños del aula...</p>
      </div>

      <div *ngIf="errorMessage" class="alert-error" role="alert">
        <span>⚠️ {{ errorMessage }}</span>
      </div>

      <div *ngIf="!cargando && !errorMessage && fichasFiltradas.length === 0" class="state-card">
        <div class="state-icon">📋</div>
        <h3>No hay niños matriculados en esta aula</h3>
        <p *ngIf="searchTerm">No se encontraron coincidencias para "{{ searchTerm }}".</p>
        <p *ngIf="!searchTerm">Esta aula aún no cuenta con niños activos registrados.</p>
      </div>

      <!-- Grid de Fichas Médicas de Niños -->
      <div *ngIf="!cargando && fichasFiltradas.length > 0" class="fichas-grid">
        <div *ngFor="let f of fichasFiltradas" class="ficha-card" [class.has-allergy]="f.alergias || f.indicacionesMedicas">
          <div class="card-header">
            <div class="avatar">
              {{ f.nombres.charAt(0) }}{{ f.apellidos.charAt(0) }}
            </div>
            <div class="header-info">
              <h3>{{ f.nombreCompleto }}</h3>
              <div class="meta-info">
                <span>DNI: <strong>{{ f.documentoIdentidad }}</strong></span>
                <span>• Nac.: {{ f.fechaNacimiento }}</span>
              </div>
            </div>
            <span class="aula-pill">{{ f.aulaNombre }}</span>
          </div>

          <div class="card-body">
            <!-- SECCIÓN PRIORITARIA: CONDICIONES MÉDICAS Y ALERGIAS -->
            <div class="medical-section">
              <h4 class="section-title medical-title">
                <span>⚠️</span> Información Médica y Alergias (Prioritario)
              </h4>

              <div *ngIf="f.alergias" class="alert-box allergy-box">
                <span class="box-label">Alergias Conocidas:</span>
                <p class="box-content">{{ f.alergias }}</p>
              </div>

              <div *ngIf="f.indicacionesMedicas" class="alert-box medical-box">
                <span class="box-label">Indicaciones / Cuidados:</span>
                <p class="box-content">{{ f.indicacionesMedicas }}</p>
              </div>

              <div *ngIf="!f.alergias && !f.indicacionesMedicas" class="no-alert-box">
                <span>✓ No registra alergias ni restricciones médicas.</span>
              </div>
            </div>

            <!-- CONTACTOS AUTORIZADOS PARA EL RECOJO -->
            <div class="contacts-section">
              <h4 class="section-title">
                <span>👥</span> Contactos Autorizados para Recojo ({{ f.contactos.length }})
              </h4>

              <div class="contacts-list">
                <div *ngFor="let c of f.contactos" class="contact-item">
                  <div class="contact-main">
                    <strong>{{ c.nombres }} {{ c.apellidos }}</strong>
                    <span class="parentesco-tag">{{ c.parentesco }}</span>
                  </div>
                  <div class="contact-details">
                    <span>📞 Teléfono: <a [href]="'tel:' + c.telefono">{{ c.telefono }}</a></span>
                    <span>🪪 DNI: {{ c.documentoIdentidad }}</span>
                  </div>
                </div>
              </div>
            </div>
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

    .controls-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
    }
    .control-group {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .control-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
    }
    .select-aula {
      padding: 0.55rem 0.85rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #1e293b;
      background: #ffffff;
    }
    .search-box {
      display: flex;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 0.45rem 0.75rem;
      flex: 1;
      min-width: 250px;
    }
    .search-icon {
      margin-right: 0.5rem;
    }
    .search-input {
      border: none;
      background: transparent;
      outline: none;
      width: 100%;
      font-size: 0.9rem;
    }
    .alert-summary {
      background: #fffbeb;
      border: 1px solid #fde68a;
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .alert-count {
      background: #f59e0b;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8rem;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }
    .alert-text {
      font-size: 0.8rem;
      color: #92400e;
      font-weight: 600;
    }

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
    .alert-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 0.85rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .fichas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.25rem;
    }
    .ficha-card {
      background: #ffffff;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: transform 0.2s;
    }
    .ficha-card:hover {
      transform: translateY(-2px);
    }
    .ficha-card.has-allergy {
      border-left: 5px solid #ef4444;
    }
    .card-header {
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      border-bottom: 1px solid #f1f5f9;
      background: #f8fafc;
    }
    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #e0f2fe;
      color: #0369a1;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
    }
    .header-info {
      flex: 1;
    }
    .header-info h3 {
      font-size: 1.05rem;
      color: #1e293b;
      margin: 0 0 0.25rem 0;
    }
    .meta-info {
      font-size: 0.8rem;
      color: #64748b;
    }
    .aula-pill {
      background: #e0f2fe;
      color: #0369a1;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .section-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #334155;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .medical-title {
      color: #991b1b;
    }

    .alert-box {
      padding: 0.65rem 0.85rem;
      border-radius: 6px;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }
    .allergy-box {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
    }
    .medical-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
    }
    .box-label {
      font-weight: 700;
      display: block;
      margin-bottom: 0.2rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .box-content {
      margin: 0;
      line-height: 1.35;
    }
    .no-alert-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
    }

    .contacts-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .contact-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 0.6rem 0.75rem;
      font-size: 0.8rem;
    }
    .contact-main {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }
    .parentesco-tag {
      background: #f1f5f9;
      color: #475569;
      padding: 0.1rem 0.45rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.75rem;
    }
    .contact-details {
      display: flex;
      justify-content: space-between;
      color: #64748b;
    }
    .contact-details a {
      color: #0284c7;
      text-decoration: none;
      font-weight: 600;
    }
  `]
})
export class ProfesoraFichasComponent implements OnInit {
  private readonly asistenciaService = inject(AsistenciaService);

  public aulas: Aula[] = [];
  public aulaSeleccionadaId: number = 1;
  public fichas: FichaNino[] = [];
  public searchTerm: string = '';
  public cargando: boolean = true;
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
          this.cargarFichas();
        }
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las aulas.';
        this.cargando = false;
      }
    });
  }

  public cargarFichas(): void {
    this.cargando = true;
    this.errorMessage = null;
    this.asistenciaService.getFichasPorAula(this.aulaSeleccionadaId).subscribe({
      next: (fichas) => {
        this.fichas = fichas;
        this.cargando = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.mensaje || 'Error al obtener las fichas de los niños.';
        this.cargando = false;
      }
    });
  }

  public get fichasFiltradas(): FichaNino[] {
    if (!this.searchTerm.trim()) {
      return this.fichas;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.fichas.filter(f =>
      f.nombreCompleto.toLowerCase().includes(term) ||
      f.documentoIdentidad.includes(term)
    );
  }

  public get totalConAlergias(): number {
    return this.fichas.filter(f =>
      (f.alergias && f.alergias.trim().length > 0) ||
      (f.indicacionesMedicas && f.indicacionesMedicas.trim().length > 0)
    ).length;
  }
}
