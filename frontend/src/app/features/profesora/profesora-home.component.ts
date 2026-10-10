import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profesora-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="role-container" *ngIf="authService.currentUser$ | async as user">
      <div class="welcome-card">
        <div class="header-icon">👩‍🏫</div>
        <h2>Panel de Profesora</h2>
        <p class="greeting">Bienvenida, <strong>{{ user.nombreCompleto }}</strong> ({{ user.username }})</p>
        <span class="role-tag">Rol Oficial: PROFESORA</span>

        <hr class="divider">

        <h3>Funcionalidades Asignadas a su Rol</h3>
        <div class="feature-grid">
          <div class="feature-card clickable" routerLink="/profesora/asistencia">
            <span class="card-icon">📋</span>
            <h4>Registro de Asistencia de Aula</h4>
            <p>Registrar la asistencia diaria de los niños de su aula asignada con confirmación horaria.</p>
            <span class="card-action">→ Registrar Asistencia Diaria</span>
          </div>

          <div class="feature-card clickable" routerLink="/profesora/fichas">
            <span class="card-icon">🧒</span>
            <h4>Consulta de Fichas de Niños</h4>
            <p>Consultar alergias prioritarias, indicaciones médicas y contactos autorizados para recojo de su aula.</p>
            <span class="card-action">→ Ver Fichas y Alergias</span>
          </div>
        </div>

        <div class="status-box">
          <span>🔒 Sesión activa con permisos autorizados para Personal Docente.</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .role-container {
      max-width: 1000px;
      margin: 2.5rem auto;
      padding: 0 1.5rem;
    }
    .welcome-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 2.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      border-top: 5px solid #16a34a;
    }
    .header-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    h2 {
      font-size: 1.6rem;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }
    .greeting {
      font-size: 1rem;
      color: #475569;
      margin-bottom: 0.75rem;
    }
    .role-tag {
      display: inline-block;
      background-color: #dcfce7;
      color: #15803d;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .divider {
      border: 0;
      height: 1px;
      background: #e2e8f0;
      margin: 1.75rem 0;
    }
    h3 {
      font-size: 1.05rem;
      color: #334155;
      margin-bottom: 1.25rem;
    }
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.75rem;
    }
    .feature-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.25rem;
    }
    .feature-card.clickable {
      cursor: pointer;
      transition: all 0.2s ease;
      border-color: #bae6fd;
      background: #f0f9ff;
    }
    .feature-card.clickable:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(2, 132, 199, 0.1);
      border-color: #0284c7;
    }
    .card-action {
      display: inline-block;
      margin-top: 0.75rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: #0284c7;
    }
    .card-icon {
      font-size: 1.5rem;
      display: block;
      margin-bottom: 0.5rem;
    }
    .feature-card h4 {
      font-size: 0.95rem;
      color: #1e293b;
      margin-bottom: 0.35rem;
    }
    .feature-card p {
      font-size: 0.85rem;
      color: #64748b;
      line-height: 1.4;
    }
    .status-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 0.85rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 500;
    }
  `]
})
export class ProfesoraHomeComponent {
  public readonly authService = inject(AuthService);
}
