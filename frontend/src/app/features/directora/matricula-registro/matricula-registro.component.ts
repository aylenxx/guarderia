import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatriculaService } from '../../../core/services/matricula.service';
import { Aula } from '../../../core/models/matricula.models';

@Component({
  selector: 'app-matricula-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="matricula-container">
      <div class="top-nav">
        <a routerLink="/directora" class="btn-back">← Volver al Panel de Directora</a>
      </div>

      <div class="form-card">
        <div class="card-header">
          <div class="icon">📝</div>
          <div>
            <h2>Registro de Matrícula</h2>
            <p class="subtitle">Complete los datos personales, condiciones de salud y al menos un contacto autorizado.</p>
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
                <input id="doc" type="text" formControlName="documentoIdentidad" placeholder="Ej: 78945612"
                       [class.is-invalid]="isFieldInvalid('documentoIdentidad')" />
                <span *ngIf="isFieldInvalid('documentoIdentidad')" class="error-text">El documento es obligatorio</span>
              </div>

              <div class="form-group">
                <label for="fechaNac">Fecha de Nacimiento *</label>
                <input id="fechaNac" type="date" formControlName="fechaNacimiento"
                       [class.is-invalid]="isFieldInvalid('fechaNacimiento')" />
                <span *ngIf="isFieldInvalid('fechaNacimiento')" class="error-text">La fecha de nacimiento es obligatoria</span>
              </div>
            </div>

            <div class="form-group">
              <label for="aula">Asignación de Aula *</label>
              <select id="aula" formControlName="aulaId" [class.is-invalid]="isFieldInvalid('aulaId')">
                <option value="" disabled selected>Seleccione un aula...</option>
                <option *ngFor="let aula of aulas" [value]="aula.id">
                  {{ aula.nombre }} (Capacidad: {{ aula.capacidad }} niños)
                </option>
              </select>
              <span *ngIf="isFieldInvalid('aulaId')" class="error-text">Debe seleccionar un aula</span>
            </div>
          </fieldset>

          <!-- SECCIÓN 2: INFORMACIÓN MÉDICA Y ALERGIAS -->
          <fieldset class="form-section highlight-health">
            <legend>2. Alergias e Indicaciones Médicas (Información Prioritaria)</legend>

            <div class="form-group">
              <label for="alergias">Alergias Conocidas</label>
              <input id="alergias" type="text" formControlName="alergias"
                     placeholder="Ej: Penicilina, mariscos, maní, lácteos (o dejar en blanco si no tiene)" />
              <span class="help-text">Visible inmediatamente para la profesora del aula.</span>
            </div>

            <div class="form-group">
              <label for="indicaciones">Indicaciones Médicas Especiales</label>
              <textarea id="indicaciones" rows="2" formControlName="indicacionesMedicas"
                         placeholder="Ej: Uso de inhalador salbutamol en caso de fatiga, restricción de azúcar..."></textarea>
            </div>
          </fieldset>

          <!-- SECCIÓN 3: CONTACTOS AUTORIZADOS PARA RECOJO -->
          <fieldset class="form-section">
            <div class="section-header-flex">
              <legend>3. Personas Autorizadas para el Recojo (Mínimo 1 Obligatorio)</legend>
              <button type="button" class="btn-add-contact" (click)="agregarContacto()">
                + Agregar Otro Contacto
              </button>
            </div>

            <div formArrayName="contactos" class="contacts-list">
              <div *ngFor="let c of contactosFormArray.controls; let i = index" [formGroupName]="i" class="contact-card">
                <div class="contact-card-top">
                  <span class="contact-number">Contacto #{{ i + 1 }}</span>
                  <button *ngIf="contactosFormArray.length > 1" type="button" class="btn-remove-contact" (click)="eliminarContacto(i)">
                    ✕ Eliminar
                  </button>
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label>Nombres *</label>
                    <input type="text" formControlName="nombres" placeholder="Ej: Carmen" />
                  </div>
                  <div class="form-group">
                    <label>Apellidos *</label>
                    <input type="text" formControlName="apellidos" placeholder="Ej: Paredes Silva" />
                  </div>
                </div>

                <div class="grid-3">
                  <div class="form-group">
                    <label>Parentesco *</label>
                    <select formControlName="parentesco">
                      <option value="Madre">Madre</option>
                      <option value="Padre">Padre</option>
                      <option value="Abuela">Abuela</option>
                      <option value="Abuelo">Abuelo</option>
                      <option value="Tía/Tío">Tía / Tío</option>
                      <option value="Tutor Legal">Tutor Legal</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Teléfono de Contacto *</label>
                    <input type="tel" formControlName="telefono" placeholder="Ej: 987654321" />
                  </div>

                  <div class="form-group">
                    <label>Doc. Identidad (DNI) *</label>
                    <input type="text" formControlName="documentoIdentidad" placeholder="Ej: 09876543" />
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="contactosFormArray.length === 0" class="error-text">
              Es obligatorio registrar al menos un contacto autorizado.
            </div>
          </fieldset>

          <div class="form-actions">
            <button type="submit" class="btn-submit" [disabled]="isSubmitting">
              <span>{{ isSubmitting ? 'Registrando Matrícula...' : 'Formalizar Registro de Matrícula' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .matricula-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }
    .top-nav {
      margin-bottom: 1rem;
    }
    .btn-back {
      color: #4b5563;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
    }
    .btn-back:hover {
      color: #1f2937;
    }
    .form-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 2.25rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #f3f4f6;
      padding-bottom: 1rem;
    }
    .icon {
      font-size: 2.25rem;
    }
    h2 {
      font-size: 1.35rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.2rem;
    }
    .subtitle {
      font-size: 0.85rem;
      color: #6b7280;
    }
    .form-section {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    legend {
      font-weight: 700;
      font-size: 0.95rem;
      color: #374151;
      padding: 0 0.5rem;
    }
    .highlight-health {
      background-color: #fffbeb;
      border-color: #fde68a;
    }
    .highlight-health legend {
      color: #92400e;
    }
    .section-header-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }
    .form-group {
      margin-bottom: 0.9rem;
    }
    label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.3rem;
    }
    input, select, textarea {
      width: 100%;
      padding: 0.55rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.88rem;
      color: #111827;
      background: #ffffff;
      outline: none;
      transition: border-color 0.15s;
    }
    input:focus, select:focus, textarea:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
    }
    input.is-invalid, select.is-invalid {
      border-color: #ef4444;
    }
    .error-text {
      color: #dc2626;
      font-size: 0.76rem;
      margin-top: 0.25rem;
      display: block;
    }
    .help-text {
      color: #78350f;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
    }
    .contact-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .contact-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .contact-number {
      font-size: 0.82rem;
      font-weight: 700;
      color: #4b5563;
      text-transform: uppercase;
    }
    .btn-add-contact {
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .btn-add-contact:hover {
      background: #dbeafe;
    }
    .btn-remove-contact {
      background: #fee2e2;
      color: #b91c1c;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .btn-remove-contact:hover {
      background: #fecaca;
    }
    .form-actions {
      margin-top: 1.5rem;
      display: flex;
      justify-content: flex-end;
    }
    .btn-submit {
      background-color: #2563eb;
      color: #ffffff;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 0.92rem;
      font-weight: 600;
    }
    .btn-submit:hover:not(:disabled) {
      background-color: #1d4ed8;
    }
    .btn-submit:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
    .alert-success {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 0.85rem 1rem;
      border-radius: 8px;
      font-size: 0.88rem;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .alert-error {
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 0.85rem 1rem;
      border-radius: 8px;
      font-size: 0.88rem;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class MatriculaRegistroComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly matriculaService = inject(MatriculaService);
  private readonly router = inject(Router);

  public aulas: Aula[] = [];
  public isSubmitting = false;
  public successMessage = '';
  public errorMessage = '';

  public form: FormGroup = this.fb.group({
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    documentoIdentidad: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required]],
    aulaId: ['', [Validators.required]],
    alergias: [''],
    indicacionesMedicas: [''],
    contactos: this.fb.array([])
  });

  public get contactosFormArray(): FormArray {
    return this.form.get('contactos') as FormArray;
  }

  public ngOnInit(): void {
    // Inicializar con 1 contacto obligatorio
    this.agregarContacto();

    this.matriculaService.getAulas().subscribe({
      next: (data) => this.aulas = data,
      error: () => this.errorMessage = 'No se pudieron cargar las aulas desde el servidor backend'
    });
  }

  public agregarContacto(): void {
    const contactoGroup = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      parentesco: ['Madre', [Validators.required]],
      telefono: ['', [Validators.required]],
      documentoIdentidad: ['', [Validators.required]]
    });
    this.contactosFormArray.push(contactoGroup);
  }

  public eliminarContacto(index: number): void {
    if (this.contactosFormArray.length > 1) {
      this.contactosFormArray.removeAt(index);
    }
  }

  public isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid || this.contactosFormArray.length === 0) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Por favor complete todos los campos obligatorios y al menos un contacto autorizado.';
      return;
    }

    this.isSubmitting = true;
    const requestData = {
      ...this.form.value,
      aulaId: Number(this.form.value.aulaId)
    };

    this.matriculaService.registrarMatricula(requestData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = `¡Matrícula de ${res.nombreCompleto} registrada exitosamente en ${res.aulaNombre}!`;
        this.form.reset();
        this.contactosFormArray.clear();
        this.agregarContacto();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.mensaje || 'Ocurrió un error al registrar la matrícula.';
      }
    });
  }
}
