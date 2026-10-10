import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DirectoraHomeComponent } from './features/directora/directora-home.component';
import { MatriculaRegistroComponent } from './features/directora/matricula-registro/matricula-registro.component';
import { MatriculaListaComponent } from './features/directora/matricula-lista/matricula-lista.component';
import { MatriculaEdicionComponent } from './features/directora/matricula-edicion/matricula-edicion.component';
import { DirectoraAsistenciaComponent } from './features/directora/asistencia/directora-asistencia.component';
import { ProfesoraHomeComponent } from './features/profesora/profesora-home.component';
import { ProfesoraFichasComponent } from './features/profesora/fichas/profesora-fichas.component';
import { ProfesoraAsistenciaComponent } from './features/profesora/asistencia/profesora-asistencia.component';
import { RecepcionHomeComponent } from './features/recepcion/recepcion-home.component';
import { RecepcionVerificacionComponent } from './features/recepcion/verificacion/recepcion-verificacion.component';
import { RecepcionMarcadoComponent } from './features/recepcion/marcado/recepcion-marcado.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'directora',
    component: DirectoraHomeComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'DIRECTORA' }
  },
  {
    path: 'directora/matricula',
    component: MatriculaRegistroComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'DIRECTORA' }
  },
  {
    path: 'directora/ninos',
    component: MatriculaListaComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'DIRECTORA' }
  },
  {
    path: 'directora/ninos/editar/:id',
    component: MatriculaEdicionComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'DIRECTORA' }
  },
  {
    path: 'directora/asistencia',
    component: DirectoraAsistenciaComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'DIRECTORA' }
  },
  {
    path: 'profesora',
    component: ProfesoraHomeComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'PROFESORA' }
  },
  {
    path: 'profesora/fichas',
    component: ProfesoraFichasComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'PROFESORA' }
  },
  {
    path: 'profesora/asistencia',
    component: ProfesoraAsistenciaComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'PROFESORA' }
  },
  {
    path: 'recepcion',
    component: RecepcionHomeComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'RECEPCION' }
  },
  {
    path: 'recepcion/verificacion',
    component: RecepcionVerificacionComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'RECEPCION' }
  },
  {
    path: 'recepcion/marcado',
    component: RecepcionMarcadoComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'RECEPCION' }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
