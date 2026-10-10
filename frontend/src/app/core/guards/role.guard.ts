import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/auth.models';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRole = route.data['role'] as Role;
  const user = authService.currentUserValue;

  if (user && user.rol === expectedRole) {
    return true;
  }

  // Redirigir a la vista que le corresponde a su propio rol si intenta acceder a otra
  if (user) {
    const targetRoute = authService.getDefaultRouteForRole(user.rol);
    router.navigate([targetRoute]);
  } else {
    router.navigate(['/login']);
  }

  return false;
};
