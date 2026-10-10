import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecepcionService } from '../../../core/services/recepcion.service';
import { VerificacionRecojo } from '../../../core/models/recepcion.models';

@Component({
  selector: 'app-recepcion-verificacion',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="header-card">
        <div>
          <div class="badge-tag">Control de Acceso</div>
          <h2>Verificación de Personas Autorizadas para Recojo</h2>
          <p class="subtitle">Consulte al instante quiénes son los familiares o tutores autorizados para retirar al niño de manera segura.</p>
        </div>
        <div class="actions-group">
          <a routerLink="/recepcion" class="btn-secondary">← Volver al Panel</a>
          <a routerLink="/recepcion/marcado" class="btn-primary">+ Registrar Entrada/Salida</a>
        </div>
      </div>

      <!-- Buscador en Puerta de Acceso -->
      <div class="search-panel">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="terminoBusqueda"
            (input)="buscar()"
            placeholder="Ingrese DNI o nombre del niño para verificar autorizados..."
            class="search-input"
          />
        </div>
        <div class="quick-counter">
          <span>{{ listaNinos.length }} niño(s) listado(s)</span>
        </div>
      </div>

      <!-- Estados -->
      <div *ngIf="cargando" class="state-card">
        <div class="spinner"></div>
        <p>Buscando registros autorizados...</p>
      </div>

      <div *ngIf="errorMessage" class="alert-error" role="alert">
        <span>⚠️ {{ errorMessage }}</span>
      </div>

      <div *ngIf="!cargando && !errorMessage && listaNinos.length === 0" class="state-card">
        <div class="state-icon">🛡️</div>
        <h3>No se encontraron niños autorizados</h3>
        <p *ngIf="terminoBusqueda">No hay coincidencias para "{{ terminoBusqueda }}". Verifique el DNI con el tutor.</p>
        <p *ngIf="!terminoBusqueda">No hay niños matriculados activos en el sistema.</p>
      </div>

      <!-- Lista de Fichas de Recojo -->
      <div *ngIf="!cargando && listaNinos.length > 0" class="cards-grid">
        <div *ngFor="let nino of listaNinos" class="nino-card">
          <div class="nino-header">
            <div class="nino-avatar">{{ nino.nombreCompleto.charAt(0) }}</div>
            <div class="nino-title">
              <h3>{{ nino.nombreCompleto }}</h3>
              <span class="nino-dni">DNI Niño: <strong>{{ nino.documentoIdentidad }}</strong></span>
            </div>
            <span class="aula-badge">{{ nino.aulaNombre }}</span>
          </div>

          <!-- Alerta médica visible en puerta -->
          <div *ngIf="nino.alergias" class="medical-alert">
            <span class="alert-symbol">⚠️</span>
            <div><strong>Alergias Conocidas:</strong> {{ nino.alergias }}</div>
          </div>

          <!-- PERSONAS AUTORIZADAS PARA EL RECOJO -->
          <div class="authorized-section">
            <h4 class="section-title">
              <span>✅</span> Personas Autorizadas para Recojo ({{ nino.personasAutorizadas.length }})
            </h4>

            <div class="authorized-grid">
              <div *ngFor="let p of nino.personasAutorizadas" class="person-card">
                <div class="person-top">
                  <strong>{{ p.nombres }} {{ p.apellidos }}</strong>
                  <span class="relationship-tag">{{ p.parentesco }}</span>
                </div>
                <div class="person-data">
                  <div class="data-line">
                    <span class="label">DNI:</span>
                    <span class="value-highlight">{{ p.documentoIdentidad }}</span>
                  </div>
                  <div class="data-line">
                    <span class="label">Teléfono:</span>
                    <a [href]="'tel:' + p.telefono" class="phone-link">📞 {{ p.telefono }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <a [routerLink]="['/recepcion/marcado']" [queryParams]="{ ninoId: nino.ninoId, tipo: 'SALIDA' }" class="btn-action">
              🚪 Registrar Entrega / Salida de Niño
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1050px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }
    .header-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.75rem 2rem;
      border: 1px solid #e2e8f0;
      border-top: 5px solid #d97706;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .badge-tag {
      display: inline-block;
      background: #fef3c7;
      color: #b45309;
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
    .actions-group {
      display: flex;
      gap: 0.75rem;
    }
    .btn-primary {
      background: #d97706;
      color: #ffffff;
      padding: 0.65rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
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

    .search-panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1rem 1.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .search-box {
      display: flex;
      align-items: center;
      background: #f8fafc;
      border: 2px solid #fde68a;
      border-radius: 8px;
      padding: 0.6rem 1rem;
      flex: 1;
      min-width: 280px;
    }
    .search-icon {
      margin-right: 0.65rem;
      font-size: 1.1rem;
    }
    .search-input {
      border: none;
      background: transparent;
      outline: none;
      width: 100%;
      font-size: 0.95rem;
      color: #1e293b;
    }
    .quick-counter {
      font-size: 0.85rem;
      color: #64748b;
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
      border: 4px solid #fef3c7;
      border-top-color: #d97706;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .state-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .alert-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 0.85rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .cards-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .nino-card {
      background: #ffffff;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      border-left: 5px solid #10b981;
    }
    .nino-header {
      padding: 1.25rem 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .nino-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #fef3c7;
      color: #b45309;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }
    .nino-title {
      flex: 1;
    }
    .nino-title h3 {
      font-size: 1.1rem;
      color: #1e293b;
      margin: 0 0 0.2rem 0;
    }
    .nino-dni {
      font-size: 0.8rem;
      color: #64748b;
    }
    .aula-badge {
      background: #e0f2fe;
      color: #0369a1;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .medical-alert {
      margin: 1rem 1.5rem 0 1.5rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 0.6rem 0.85rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
    }

    .authorized-section {
      padding: 1.25rem 1.5rem;
    }
    .section-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #065f46;
      margin: 0 0 0.85rem 0;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .authorized-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    .person-card {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 1rem;
    }
    .person-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.65rem;
      border-bottom: 1px solid #dcfce7;
      padding-bottom: 0.4rem;
    }
    .relationship-tag {
      background: #dcfce7;
      color: #166534;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
    }
    .person-data {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-size: 0.85rem;
    }
    .data-line {
      display: flex;
      justify-content: space-between;
    }
    .label {
      color: #64748b;
    }
    .value-highlight {
      font-weight: 700;
      color: #1e293b;
      font-family: monospace;
    }
    .phone-link {
      color: #0284c7;
      text-decoration: none;
      font-weight: 600;
    }

    .card-footer {
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: flex-end;
    }
    .btn-action {
      background: #10b981;
      color: #ffffff;
      padding: 0.55rem 1.25rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn-action:hover {
      background: #059669;
    }
  `]
})
export class RecepcionVerificacionComponent implements OnInit {
  private readonly recepcionService = inject(RecepcionService);

  public terminoBusqueda: string = '';
  public listaNinos: VerificacionRecojo[] = [];
  public cargando: boolean = true;
  public errorMessage: string | null = null;

  ngOnInit(): void {
    this.buscar();
  }

  public buscar(): void {
    this.cargando = true;
    this.errorMessage = null;

    this.recepcionService.consultarAutorizados(this.terminoBusqueda).subscribe({
      next: (data) => {
        this.listaNinos = data;
        this.cargando = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.mensaje || 'Error al consultar personas autorizadas.';
        this.cargando = false;
      }
    });
  }
}
