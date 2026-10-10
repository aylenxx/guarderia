import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <div class="header">
          <div class="logo">🏫</div>
          <h2>Guardería Pequeños Pasos</h2>
          <p class="subtitle">Sistema Web de Gestión - Iniciar Sesión</p>
        </div>

        <div *ngIf="errorMessage" class="alert-danger" role="alert">
          <span class="alert-icon">⚠️</span>
          <span>{{ errorMessage }}</span>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
          <div class="form-group">
            <label for="username">Usuario</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              placeholder="Ej: directora"
              [class.is-invalid]="isFieldInvalid('username')"
              autocomplete="username"
            />
            <div *ngIf="isFieldInvalid('username')" class="field-error">
              El nombre de usuario es obligatorio
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="••••••••"
              [class.is-invalid]="isFieldInvalid('password')"
              autocomplete="current-password"
            />
            <div *ngIf="isFieldInvalid('password')" class="field-error">
              La contraseña es obligatoria
            </div>
          </div>

          <button type="submit" class="btn-submit" [disabled]="isLoading">
            <span *ngIf="isLoading" class="spinner"></span>
            <span>{{ isLoading ? 'Iniciando sesión...' : 'Ingresar al Sistema' }}</span>
          </button>
        </form>

        <div class="demo-credentials-box">
          <h4>Credenciales de Prueba Disponibles:</h4>
          <ul>
            <li>
              <strong>Directora:</strong> <code>directora</code> / <code>Directora123*</code>
            </li>
            <li>
              <strong>Profesora:</strong> <code>profesora</code> / <code>Profesora123*</code>
            </li>
            <li>
              <strong>Recepción:</strong> <code>recepcion</code> / <code>Recepcion123*</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
      padding: 1.5rem;
    }
    .login-card {
      background: #ffffff;
      width: 100%;
      max-width: 440px;
      padding: 2.25rem 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      text-align: center;
      margin-bottom: 1.75rem;
    }
    .logo {
      font-size: 2.75rem;
      margin-bottom: 0.5rem;
    }
    .header h2 {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }
    .subtitle {
      font-size: 0.88rem;
      color: #64748b;
    }
    .alert-danger {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.88rem;
      margin-bottom: 1.25rem;
    }
    .alert-icon {
      font-size: 1.1rem;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    label {
      display: block;
      font-size: 0.88rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 0.35rem;
    }
    input {
      width: 100%;
      padding: 0.7rem 0.85rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.92rem;
      color: #0f172a;
      outline: none;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
    input.is-invalid {
      border-color: #ef4444;
    }
    input.is-invalid:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
    }
    .field-error {
      color: #dc2626;
      font-size: 0.78rem;
      margin-top: 0.3rem;
    }
    .btn-submit {
      width: 100%;
      padding: 0.8rem;
      background-color: #2563eb;
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .btn-submit:hover:not(:disabled) {
      background-color: #1d4ed8;
    }
    .btn-submit:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
    .spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .demo-credentials-box {
      margin-top: 1.75rem;
      padding: 0.9rem;
      background-color: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      font-size: 0.78rem;
      color: #475569;
    }
    .demo-credentials-box h4 {
      font-size: 0.82rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.4rem;
    }
    .demo-credentials-box ul {
      list-style: none;
      padding-left: 0;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .demo-credentials-box code {
      background: #e2e8f0;
      padding: 0.1rem 0.3rem;
      border-radius: 4px;
      color: #0f172a;
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  public errorMessage = '';
  public isLoading = false;

  public isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        const targetRoute = this.authService.getDefaultRouteForRole(response.rol);
        this.router.navigate([targetRoute]);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = err.error?.mensaje || 'Credenciales inválidas. Verifique su usuario y contraseña.';
        } else if (err.status === 400) {
          this.errorMessage = 'Por favor complete todos los campos requeridos.';
        } else {
          this.errorMessage = 'No se pudo conectar con el servidor backend. Verifique que esté en ejecución.';
        }
      }
    });
  }
}
