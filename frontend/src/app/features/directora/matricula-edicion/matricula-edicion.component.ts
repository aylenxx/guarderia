import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatriculaService } from '../../../core/services/matricula.service';
import { Aula, ContactoAutorizado, MatriculaDetalleResponse } from '../../../core/models/matricula.models';

@Component({
  selector: 'app-matricula-edicion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="matricula-container">
      <div class="top-nav">
        <a routerLink="/directora/ninos" class="btn-back">← Volver al Listado de Niños</a>
      </div>

      <div *ngIf="cargando" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando datos del niño matriculado...</p>
      </div>

      <div *ngIf="errorCarga" class="alert-error" role="alert">
        <span class="alert-icon">⚠️</span>
        <span>{{ errorCarga }}</span>
      </div>

      <div *ngIf="!cargando && !errorCarga" class="form-card">
        <div class="card-header">
          <div class="icon">✏️</div>
          <div>
            <div class="badge-tag">Rol Directora</div>
            <h2>Modificación de Matrícula</h2>
            <p class="subtitle">Actualice los datos del niño <strong>{{ ninoActual?.nombreCompleto }}</strong>, su aula o sus contactos de recojo.</p>
          </div>
        </div>

        <div *ngIf="successMessage" class="alert-success" role="alert">
          <span class="alert-icon">✅</span>
          <span>{{ successMessage }}</span>
        </div>

        <div *ngIf="errorMessage" class="alert-error" role="alert">
          <span class="alert-icon">⚠️</span>
          <span>{{ errorMessage }}</span>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <!-- SECCIÓN 1: DATOS PERSONALES DEL NIÑO -->
          <fieldset class="form-section">
            <legend>1. Datos Personales del Niño</legend>

            <div class="grid-2">
              <div class="form-group">
                <label for="nombres">Nombres *</label>
                <input id="nombres" type="text" formControlName="nombres" placeholder="Ej: Lucas Matías"
                       [class.is-invalid]="isFieldInvalid('nombres')" />
                <span *ngIf="isFieldInvalid('nombres')" class="error-text">El nombre es obligatorio</span>
              </div>

              <div class="form-group">
                <label for="apellidos">Apellidos *</label>
                <input id="apellidos" type="text" formControlName="apellidos" placeholder="Ej: Gómez Paredes"
                       [class.is-invalid]="isFieldInvalid('apellidos')" />
                <span *ngIf="isFieldInvalid('apellidos')" class="error-text">Los apellidos son obligatorios</span>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label for="doc">Documento de Identidad (DNI) *</label>
                <input id="doc" type="text" formControlName="documentoIdentidad" placeholder="8 dígitos numéricos" maxlength="8"
                       [class.is-invalid]="isFieldInvalid('documentoIdentidad')" />
                <span *ngIf="isFieldInvalid('documentoIdentidad')" class="error-text">DNI inválido (debe tener exactamente 8 dígitos)</span>
              </div>

              <div class="form-group">
                <label for="nac">Fecha de Nacimiento *</label>
                <input id="nac" type="date" formControlName="fechaNacimiento"
                       [class.is-invalid]="isFieldInvalid('fechaNacimiento')" />
                <span *ngIf="isFieldInvalid('fechaNacimiento')" class="error-text">Fecha de nacimiento obligatoria (edad permitida 1 a 5 años)</span>
              </div>
            </div>

            <div class="form-group">
              <label for="aula">Aula Asignada *</label>
              <select id="aula" formControlName="aulaId" [class.is-invalid]="isFieldInvalid('aulaId')">
                <option value="">-- Seleccione un Aula --</option>
                <option *ngFor="let aula of aulas" [value]="aula.id">
                  {{ aula.nombre }} (Capacidad: {{ aula.capacidad }} niños)
                </option>
              </select>
              <span *ngIf="isFieldInvalid('aulaId')" class="error-text">Debe seleccionar un aula</span>
            </div>
          </fieldset>

          <!-- SECCIÓN 2: INFORMACIÓN MÉDICA Y ALERGIAS -->
          <fieldset class="form-section highlight-section">
            <legend>2. Información Médica y Alergias</legend>

            <div class="info-banner">
              ℹ️ <strong>Importante:</strong> Esta información es crítica para las profesoras y personal de recepción. Mantenga actualizadas cualquier alergia o restricción médica.
            </div>

            <div class="form-group">
              <label for="alergias">Alergias Conocidas (Alimentos, medicamentos, picaduras, etc.)</label>
              <textarea id="alergias" formControlName="alergias" rows="2"
                        placeholder="Ej: Alérgico a la penicilina y frutos secos. Si no tiene, dejar vacío."></textarea>
            </div>

            <div class="form-group">
              <label for="indicaciones">Indicaciones Médicas y Restricciones</label>
              <textarea id="indicaciones" formControlName="indicacionesMedicas" rows="2"
                        placeholder="Ej: Uso de inhalador en caso de agitación, intolerancia a la lactosa, etc."></textarea>
            </div>
          </fieldset>

          <!-- SECCIÓN 3: PERSONAS AUTORIZADAS PARA EL RECOJO -->
          <fieldset class="form-section">
            <div class="section-header-flex">
              <legend>3. Personas Autorizadas para el Recojo (Mínimo 1 Obligatorio)</legend>
              <button type="button" (click)="agregarContacto()" class="btn-add-contact">
                + Agregar Otro Contacto
              </button>
            </div>

            <div formArrayName="contactos">
              <div *ngFor="let c of contactosArray.controls; let i = index" [formGroupName]="i" class="contacto-card">
                <div class="contacto-header">
                  <h4>Contacto Autorizado #{{ i + 1 }}</h4>
                  <button *ngIf="contactosArray.length > 1" type="button" (click)="eliminarContacto(i)" class="btn-remove" title="Eliminar contacto">
                    ✕ Eliminar
                  </button>
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label>Nombres *</label>
                    <input type="text" formControlName="nombres" placeholder="Nombres del familiar"
                           [class.is-invalid]="isContactoFieldInvalid(i, 'nombres')" />
                    <span *ngIf="isContactoFieldInvalid(i, 'nombres')" class="error-text">Nombre obligatorio</span>
                  </div>

                  <div class="form-group">
                    <label>Apellidos *</label>
                    <input type="text" formControlName="apellidos" placeholder="Apellidos del familiar"
                           [class.is-invalid]="isContactoFieldInvalid(i, 'apellidos')" />
                    <span *ngIf="isContactoFieldInvalid(i, 'apellidos')" class="error-text">Apellidos obligatorios</span>
                  </div>
                </div>

                <div class="grid-3">
                  <div class="form-group">
                    <label>Parentesco *</label>
                    <select formControlName="parentesco" [class.is-invalid]="isContactoFieldInvalid(i, 'parentesco')">
                      <option value="">-- Seleccione --</option>
                      <option value="Madre">Madre</option>
                      <option value="Padre">Padre</option>
                      <option value="Abuelo/a">Abuelo/a</option>
                      <option value="Tío/a">Tío/a</option>
                      <option value="Tutor Legal">Tutor Legal</option>
                      <option value="Otro Autorizado">Otro Autorizado</option>
                    </select>
                    <span *ngIf="isContactoFieldInvalid(i, 'parentesco')" class="error-text">Parentesco requerido</span>
                  </div>

                  <div class="form-group">
                    <label>Teléfono de Contacto *</label>
                    <input type="tel" formControlName="telefono" placeholder="9 dígitos" maxlength="9"
                           [class.is-invalid]="isContactoFieldInvalid(i, 'telefono')" />
                    <span *ngIf="isContactoFieldInvalid(i, 'telefono')" class="error-text">9 dígitos numéricos</span>
                  </div>

                  <div class="form-group">
                    <label>DNI del Autorizado *</label>
                    <input type="text" formControlName="documentoIdentidad" placeholder="8 dígitos" maxlength="8"
                           [class.is-invalid]="isContactoFieldInvalid(i, 'documentoIdentidad')" />
                    <span *ngIf="isContactoFieldInvalid(i, 'documentoIdentidad')" class="error-text">8 dígitos numéricos</span>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          <div class="form-actions">
            <a routerLink="/directora/ninos" class="btn-cancel">Cancelar</a>
            <button type="submit" [disabled]="submitting" class="btn-submit">
              <span *ngIf="!submitting">💾 Guardar Cambios de Matrícula</span>
              <span *ngIf="submitting">Guardando cambios...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .matricula-container {
      max-width: 880px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }
    .top-nav {
      margin-bottom: 1.25rem;
    }
    .btn-back {
      color: #6d28d9;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .btn-back:hover {
      text-decoration: underline;
    }
    .badge-tag {
      display: inline-block;
      background: #ede9fe;
      color: #6d28d9;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      margin-bottom: 0.35rem;
      text-transform: uppercase;
    }
    .form-card {
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      padding: 2.25rem;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.75rem;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 1.25rem;
    }
    .icon {
      font-size: 2.2rem;
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

    .alert-success {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 0.85rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
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
      font-size: 0.9rem;
    }

    .form-section {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.75rem;
      background: #ffffff;
    }
    .highlight-section {
      background: #fafaf9;
      border-color: #fbbf24;
    }
    legend {
      font-weight: 700;
      color: #1e293b;
      font-size: 1.05rem;
      padding: 0 0.5rem;
    }
    .section-header-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .info-banner {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 0.75rem 1rem;
      border-radius: 4px;
      color: #1e40af;
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
    }
    @media (max-width: 640px) {
      .grid-2, .grid-3 {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      margin-bottom: 1.1rem;
      display: flex;
      flex-direction: column;
    }
    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 0.35rem;
    }
    input, select, textarea {
      padding: 0.65rem 0.85rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #1e293b;
      background-color: #ffffff;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }
    input.is-invalid, select.is-invalid {
      border-color: #ef4444;
      background-color: #fff5f5;
    }
    .error-text {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      font-weight: 500;
    }

    .contacto-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 1.25rem;
      margin-bottom: 1rem;
    }
    .contacto-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.5rem;
    }
    .contacto-header h4 {
      margin: 0;
      font-size: 0.95rem;
      color: #475569;
    }
    .btn-remove {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
      border-radius: 4px;
      padding: 0.25rem 0.6rem;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-remove:hover {
      background: #fecaca;
    }
    .btn-add-contact {
      background: #ede9fe;
      color: #6d28d9;
      border: 1px solid #c4b5fd;
      padding: 0.4rem 0.85rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-add-contact:hover {
      background: #ddd6fe;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      border-top: 1px solid #e2e8f0;
      padding-top: 1.5rem;
    }
    .btn-cancel {
      padding: 0.75rem 1.5rem;
      background: #f1f5f9;
      color: #475569;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .btn-cancel:hover {
      background: #e2e8f0;
    }
    .btn-submit {
      padding: 0.75rem 1.75rem;
      background: #7c3aed;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .btn-submit:hover:not(:disabled) {
      background: #6d28d9;
    }
    .btn-submit:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      background: #ffffff;
      border-radius: 12px;
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
  `]
})
export class MatriculaEdicionComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly matriculaService = inject(MatriculaService);

  public form!: FormGroup;
  public aulas: Aula[] = [];
  public ninoId!: number;
  public ninoActual: MatriculaDetalleResponse | null = null;
  public cargando: boolean = true;
  public errorCarga: string | null = null;
  public submitting: boolean = false;
  public successMessage: string | null = null;
  public errorMessage: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(Number(idParam))) {
      this.errorCarga = 'Identificador de niño inválido.';
      this.cargando = false;
      return;
    }
    this.ninoId = Number(idParam);

    this.initForm();
    this.cargarDatos();
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      documentoIdentidad: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      fechaNacimiento: ['', [Validators.required]],
      aulaId: ['', [Validators.required]],
      alergias: [''],
      indicacionesMedicas: [''],
      contactos: this.fb.array([])
    });
  }

  public get contactosArray(): FormArray {
    return this.form.get('contactos') as FormArray;
  }

  private crearContactoGroup(contacto?: ContactoAutorizado): FormGroup {
    return this.fb.group({
      id: [contacto?.id || null],
      nombres: [contacto?.nombres || '', [Validators.required, Validators.minLength(2)]],
      apellidos: [contacto?.apellidos || '', [Validators.required, Validators.minLength(2)]],
      parentesco: [contacto?.parentesco || '', [Validators.required]],
      telefono: [contacto?.telefono || '', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      documentoIdentidad: [contacto?.documentoIdentidad || '', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]]
    });
  }

  public agregarContacto(): void {
    this.contactosArray.push(this.crearContactoGroup());
  }

  public eliminarContacto(index: number): void {
    if (this.contactosArray.length > 1) {
      this.contactosArray.removeAt(index);
    }
  }

  private cargarDatos(): void {
    this.cargando = true;
    this.matriculaService.getAulas().subscribe({
      next: (aulas) => {
        this.aulas = aulas;
        this.cargarNino();
      },
      error: () => {
        this.errorCarga = 'Error al cargar las aulas.';
        this.cargando = false;
      }
    });
  }

  private cargarNino(): void {
    this.matriculaService.getNinoPorId(this.ninoId).subscribe({
      next: (nino) => {
        this.ninoActual = nino;
        this.form.patchValue({
          nombres: nino.nombres,
          apellidos: nino.apellidos,
          documentoIdentidad: nino.documentoIdentidad,
          fechaNacimiento: nino.fechaNacimiento,
          aulaId: nino.aulaId,
          alergias: nino.alergias || '',
          indicacionesMedicas: nino.indicacionesMedicas || ''
        });

        this.contactosArray.clear();
        if (nino.contactos && nino.contactos.length > 0) {
          nino.contactos.forEach(c => this.contactosArray.push(this.crearContactoGroup(c)));
        } else {
          this.agregarContacto();
        }

        this.cargando = false;
      },
      error: (err) => {
        this.errorCarga = err?.error?.mensaje || 'No se pudo cargar la información del niño.';
        this.cargando = false;
      }
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  public isContactoFieldInvalid(index: number, fieldName: string): boolean {
    const contactGroup = this.contactosArray.at(index) as FormGroup;
    const field = contactGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  public onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Por favor revise los campos marcados en rojo antes de guardar.';
      return;
    }

    if (this.contactosArray.length === 0) {
      this.errorMessage = 'Debe registrar al menos un contacto autorizado para el recojo del niño.';
      return;
    }

    this.submitting = true;
    this.matriculaService.actualizarMatricula(this.ninoId, this.form.value).subscribe({
      next: (res) => {
        this.submitting = false;
        this.successMessage = `${res.mensaje || 'Matrícula actualizada exitosamente.'} Los datos de ${res.nombreCompleto} han sido guardados.`;
        setTimeout(() => {
          this.router.navigate(['/directora/ninos']);
        }, 1800);
      },
      error: (err) => {
        this.submitting = false;
        if (err.error && err.error.mensaje) {
          this.errorMessage = err.error.mensaje;
        } else {
          this.errorMessage = 'Ocurrió un error al actualizar la matrícula. Verifique los datos e intente nuevamente.';
        }
      }
    });
  }
}
