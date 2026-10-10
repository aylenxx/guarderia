import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="navbar" *ngIf="authService.currentUser$ | async as user">
      <div class="navbar-container">
        <div class="brand">
          <span class="brand-icon">🏫</span>
          <span class="brand-name">Guardería Pequeños Pasos</span>
        </div>

        <div class="user-section">
          <div class="user-info">
            <span class="user-name">{{ user.nombreCompleto }}</span>
            <span class="role-badge" [ngClass]="user.rol.toLowerCase()">
              {{ getRoleDisplayName(user.rol) }}
            </span>
          </div>
          <button class="btn-logout" (click)="onLogout()">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      background-color: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.85rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.15rem;
      font-weight: 700;
      color: #1e293b;
    }
    .brand-icon {
      font-size: 1.35rem;
    }
    .user-section {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .user-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: #334155;
    }
    .role-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.15rem 0.55rem;
      border-radius: 9999px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-top: 0.15rem;
    }
    .role-badge.directora {
      background-color: #ede9fe;
      color: #6d28d9;
    }
    .role-badge.profesora {
      background-color: #dcfce7;
      color: #15803d;
    }
    .role-badge.recepcion {
      background-color: #fef3c7;
      color: #b45309;
    }
    .btn-logout {
      background-color: #fee2e2;
      color: #b91c1c;
      padding: 0.45rem 0.9rem;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      border: 1px solid #fecaca;
    }
    .btn-logout:hover {
      background-color: #fecaca;
      color: #991b1b;
    }
  `]
})
export class NavbarComponent {
  public readonly authService = inject(AuthService);

  public onLogout(): void {
    this.authService.logout();
  }

  public getRoleDisplayName(role: string): string {
    switch (role) {
      case 'DIRECTORA':
        return 'Directora';
      case 'PROFESORA':
        return 'Profesora';
      case 'RECEPCION':
        return 'Recepción';
      default:
        return role;
    }
  }
}
