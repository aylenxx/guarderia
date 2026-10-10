import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecepcionService } from '../../../core/services/recepcion.service';
import { MarcadoEntradaSalidaRequest, MarcadoEntradaSalidaResponse, TipoMovimiento, VerificacionRecojo } from '../../../core/models/recepcion.models';
import { ContactoAutorizado } from '../../../core/models/matricula.models';

@Component({
  selector: 'app-recepcion-marcado',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="header-card">
        <div>
          <div class="badge-tag">Control de Puerta</div>
          <h2>Registro de Entrada y Salida en Puerta</h2>
          <p class="subtitle">Registro automático con fecha y hora del sistema para la entrega y retiro del menor.</p>
        </div>
        <div class="actions-group">
          <a routerLink="/recepcion" class="btn-secondary">← Volver al Panel</a>
          <a routerLink="/recepcion/verificacion" class="btn-verify">🔍 Verificar Autorizados</a>
        </div>
      </div>

      <!-- Alerta de éxito con hora del servidor -->
      <div *ngIf="lastResponse" class="alert-success" role="alert">
        <span class="alert-icon">✅</span>
        <div>
          <strong>{{ lastResponse.mensaje }}</strong>
          <div class="meta-row">
            <span>Niño: <strong>{{ lastResponse.nombreNino }}</strong></span>
            <span>• Movimiento: <strong>{{ lastResponse.tipo }}</strong></span>
            <span>• Hora Servidor: <strong>{{ lastResponse.horaServidor }}</strong></span>
            <span>• Persona: <strong>{{ lastResponse.personaEntregaRecoge }}</strong></span>
          </div>
        </div>
      </div>

      <div *ngIf="errorMessage" class="alert-error" role="alert">
        <span>⚠️ {{ errorMessage }}</span>
      </div>

      <div class="main-layout">
        <!-- FORMULARIO DE MARCADO RÁPIDO -->
        <div class="form-card">
          <div class="form-header">
            <h3>Marcar Nuevo Ingreso / Salida</h3>
          </div>

          <form (ngSubmit)="onSubmit()" class="form-body">
            <!-- TIPO DE MOVIMIENTO -->
            <div class="form-group">
              <label>Tipo de Evento *</label>
              <div class="type-selector">
                <button
                  type="button"
                  (click)="tipoSeleccionado = 'ENTRADA'"
                  class="btn-type btn-entrada"
                  [class.active]="tipoSeleccionado === 'ENTRADA'"
                >
                  🟢 ENTRADA
                </button>
                <button
                  type="button"
                  (click)="tipoSeleccionado = 'SALIDA'"
                  class="btn-type btn-salida"
                  [class.active]="tipoSeleccionado === 'SALIDA'"
                >
                  🔴 SALIDA
                </button>
              </div>
            </div>

            <!-- SELECCIÓN DE NIÑO -->
            <div class="form-group">
              <label for="ninoSelect">Niño a Registrar *</label>
              <select
                id="ninoSelect"
                [(ngModel)]="ninoSeleccionadoId"
                (change)="onNinoChange()"
                name="ninoSelect"
                class="form-control"
              >
                <option [ngValue]="null">-- Seleccione al niño --</option>
                <option *ngFor="let n of ninos" [ngValue]="n.ninoId">
                  {{ n.nombreCompleto }} (DNI: {{ n.documentoIdentidad }}) - {{ n.aulaNombre }}
                </option>
              </select>
            </div>

            <!-- CONTACTOS AUTORIZADOS PARA SELECCIÓN RÁPIDA -->
            <div *ngIf="ninoSeleccionado" class="authorized-quick-select">
              <label class="section-sub">Seleccionar Persona Autorizada de la Ficha:</label>
              <div class="contacts-chips">
                <button
                  *ngFor="let c of ninoSeleccionado.personasAutorizadas"
                  type="button"
                  (click)="seleccionarContacto(c)"
                  class="btn-chip"
                >
                  👤 {{ c.nombres }} {{ c.apellidos }} ({{ c.parentesco }})
                </button>
              </div>
            </div>

            <!-- PERSONA RESPONSABLE (ENTREGA / RECOGE) -->
            <div class="form-group">
              <label for="persona">Nombre de Persona Responsable *</label>
              <input
                id="persona"
                type="text"
                [(ngModel)]="personaEntregaRecoge"
                name="persona"
                placeholder="Ej: Lucía Luna (Madre)"
                class="form-control"
                required
              />
            </div>

            <div class="form-group">
              <label for="dniPersona">DNI de la Persona Responsable (Opcional)</label>
              <input
                id="dniPersona"
                type="text"
                [(ngModel)]="dniPersona"
                name="dniPersona"
                placeholder="8 dígitos"
                maxlength="8"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="obs">Observaciones (Opcional)</label>
              <input
                id="obs"
                type="text"
                [(ngModel)]="observaciones"
                name="obs"
                placeholder="Ej: Retiro anticipado por cita médica..."
                class="form-control"
              />
            </div>

            <button
              type="submit"
              [disabled]="guardando || !ninoSeleccionadoId || !personaEntregaRecoge.trim()"
              class="btn-submit"
            >
              <span *ngIf="!guardando">⚡ Registrar {{ tipoSeleccionado }} con Hora Oficial</span>
              <span *ngIf="guardando">Registrando en servidor...</span>
            </button>
          </form>
        </div>

        <!-- HISTORIAL DE MOVIMIENTOS DE HOY -->
        <div class="history-card">
          <div class="history-header">
            <h3>Movimientos Registrados Hoy</h3>
            <span class="badge-count">{{ marcadosHoy.length }} registros</span>
          </div>

          <div *ngIf="marcadosHoy.length === 0" class="empty-history">
            <span>Aún no hay entradas ni salidas registradas hoy en puerta.</span>
          </div>

          <div *ngIf="marcadosHoy.length > 0" class="history-list">
            <div *ngFor="let m of marcadosHoy" class="history-item" [class.item-entrada]="m.tipo === 'ENTRADA'" [class.item-salida]="m.tipo === 'SALIDA'">
              <div class="item-type-badge">
                {{ m.tipo === 'ENTRADA' ? '🟢 ENTRADA' : '🔴 SALIDA' }}
              </div>
              <div class="item-details">
                <strong>{{ m.nombreNino }}</strong>
                <div class="item-sub">
                  <span>Resp: {{ m.personaEntregaRecoge }}</span>
                  <span *ngIf="m.dniPersona">• DNI: {{ m.dniPersona }}</span>
                </div>
                <div *ngIf="m.observaciones" class="item-obs">Obs: {{ m.observaciones }}</div>
              </div>
              <div class="item-time">
                <span>🕒 {{ m.horaServidor }}</span>
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
    .btn-verify {
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
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
    .alert-icon { font-size: 1.3rem; }
    .meta-row {
      font-size: 0.85rem;
      margin-top: 0.35rem;
      color: #15803d;
      display: flex;
      gap: 0.85rem;
      flex-wrap: wrap;
    }
    .alert-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 0.85rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .main-layout {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 840px) {
      .main-layout { grid-template-columns: 1fr; }
    }

    .form-card, .history-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
    }
    .form-header, .history-header {
      padding: 1.25rem 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .form-header h3, .history-header h3 {
      font-size: 1.05rem;
      color: #1e293b;
      margin: 0;
    }
    .badge-count {
      background: #e2e8f0;
      color: #475569;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
    }

    .form-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
    }
    .form-control {
      padding: 0.65rem 0.85rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #1e293b;
      background: #ffffff;
    }
    .form-control:focus {
      outline: none;
      border-color: #d97706;
    }

    .type-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .btn-type {
      padding: 0.75rem;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 700;
      border: 2px solid #cbd5e1;
      background: #f8fafc;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-entrada.active {
      background: #dcfce7;
      border-color: #16a34a;
      color: #15803d;
    }
    .btn-salida.active {
      background: #fee2e2;
      border-color: #dc2626;
      color: #b91c1c;
    }

    .authorized-quick-select {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 6px;
      padding: 0.85rem;
    }
    .section-sub {
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
      display: block;
      margin-bottom: 0.4rem;
      text-transform: uppercase;
    }
    .contacts-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .btn-chip {
      background: #ffffff;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 0.35rem 0.65rem;
      border-radius: 4px;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-chip:hover {
      background: #dcfce7;
    }

    .btn-submit {
      background: #d97706;
      color: #ffffff;
      border: none;
      padding: 0.85rem;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: background 0.2s;
    }
    .btn-submit:hover:not(:disabled) {
      background: #b45309;
    }
    .btn-submit:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }

    .empty-history {
      padding: 2.5rem 1.5rem;
      text-align: center;
      color: #64748b;
      font-size: 0.9rem;
    }
    .history-list {
      display: flex;
      flex-direction: column;
      max-height: 480px;
      overflow-y: auto;
    }
    .history-item {
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .item-entrada { border-left: 4px solid #16a34a; }
    .item-salida { border-left: 4px solid #dc2626; }
    .item-type-badge {
      font-size: 0.75rem;
      font-weight: 700;
      width: 80px;
    }
    .item-details {
      flex: 1;
    }
    .item-details strong {
      font-size: 0.9rem;
      color: #1e293b;
    }
    .item-sub {
      font-size: 0.75rem;
      color: #64748b;
    }
    .item-obs {
      font-size: 0.75rem;
      color: #92400e;
      font-style: italic;
    }
    .item-time {
      font-size: 0.8rem;
      font-weight: 700;
      color: #1e293b;
      font-family: monospace;
    }
  `]
})
export class RecepcionMarcadoComponent implements OnInit {
  private readonly recepcionService = inject(RecepcionService);
  private readonly route = inject(ActivatedRoute);

  public ninos: VerificacionRecojo[] = [];
  public ninoSeleccionadoId: number | null = null;
  public ninoSeleccionado: VerificacionRecojo | null = null;
  public tipoSeleccionado: TipoMovimiento = 'ENTRADA';
  public personaEntregaRecoge: string = '';
  public dniPersona: string = '';
  public observaciones: string = '';

  public marcadosHoy: MarcadoEntradaSalidaResponse[] = [];
  public guardando: boolean = false;
  public lastResponse: MarcadoEntradaSalidaResponse | null = null;
  public errorMessage: string | null = null;

  ngOnInit(): void {
    this.cargarNinos();
    this.cargarMarcadosHoy();

    const paramNinoId = this.route.snapshot.queryParamMap.get('ninoId');
    const paramTipo = this.route.snapshot.queryParamMap.get('tipo');
    if (paramNinoId && !isNaN(Number(paramNinoId))) {
      this.ninoSeleccionadoId = Number(paramNinoId);
    }
    if (paramTipo === 'ENTRADA' || paramTipo === 'SALIDA') {
      this.tipoSeleccionado = paramTipo;
    }
  }

  public cargarNinos(): void {
    this.recepcionService.consultarAutorizados().subscribe({
      next: (data) => {
        this.ninos = data;
        if (this.ninoSeleccionadoId) {
          this.onNinoChange();
        }
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar la lista de niños.';
      }
    });
  }

  public cargarMarcadosHoy(): void {
    this.recepcionService.listarMarcadosHoy().subscribe({
      next: (data) => {
        this.marcadosHoy = data;
      }
    });
  }

  public onNinoChange(): void {
    this.ninoSeleccionado = this.ninos.find(n => n.ninoId === this.ninoSeleccionadoId) || null;
  }

  public seleccionarContacto(contacto: ContactoAutorizado): void {
    this.personaEntregaRecoge = `${contacto.nombres} ${contacto.apellidos} (${contacto.parentesco})`;
    this.dniPersona = contacto.documentoIdentidad;
  }

  public onSubmit(): void {
    if (!this.ninoSeleccionadoId || !this.personaEntregaRecoge.trim()) {
      return;
    }

    this.guardando = true;
    this.errorMessage = null;
    this.lastResponse = null;

    const request: MarcadoEntradaSalidaRequest = {
      ninoId: this.ninoSeleccionadoId,
      tipo: this.tipoSeleccionado,
      personaEntregaRecoge: this.personaEntregaRecoge.trim(),
      dniPersona: this.dniPersona.trim(),
      observaciones: this.observaciones.trim()
    };

    this.recepcionService.registrarMarcado(request).subscribe({
      next: (res) => {
        this.guardando = false;
        this.lastResponse = res;
        this.personaEntregaRecoge = '';
        this.dniPersona = '';
        this.observaciones = '';
        this.cargarMarcadosHoy();
      },
      error: (err) => {
        this.guardando = false;
        this.errorMessage = err?.error?.mensaje || 'Error al registrar el marcado.';
      }
    });
  }
}
