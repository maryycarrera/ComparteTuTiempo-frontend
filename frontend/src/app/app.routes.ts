import { Routes, Router, CanActivateFn } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Login } from './auth/login/login';
import { inject } from '@angular/core';
import { LoginService } from './services/auth/login.service';
import { Home } from './shared/pages/home/home';
import { Profile } from './shared/pages/profile/profile';
import { Signup } from './auth/signup/signup';
import { AdminList } from './admin/admin-list/admin-list';
import { CreateAdmin } from './admin/create-admin/create-admin';
import { SolidarityFund } from './shared/pages/solidarity-fund/solidarity-fund';
import { MemberList } from './shared/pages/member-list/member-list';
import { MemberInfo } from './shared/pages/member-info/member-info';
import { of } from 'rxjs';
import { AdminInfo } from './admin/admin-info/admin-info';

// START Generado con GitHub Copilot Chat Extension
const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const isLoggedIn = loginService.currentIsUserLoggedIn.getValue();
  if (isLoggedIn) {
      return true;
  } else {
      return router.parseUrl('/iniciar-sesion');
  }
};

const adminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const isLoggedIn = loginService.currentIsUserLoggedIn.getValue();
  if (isLoggedIn) {
      return loginService.userIsAdmin.pipe(
          map((isAdmin: boolean) => isAdmin ? true : router.parseUrl('/inicio'))
      );
  } else {
      return router.parseUrl('/iniciar-sesion');
  }
};

const guestGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const isLoggedIn = loginService.currentIsUserLoggedIn.getValue();
  if (isLoggedIn) {
      return router.parseUrl('/inicio');
  } else {
      return true;
  }
};

const memberInfoGuard: CanActivateFn = (route, state) => {
  const result = authGuard(route, state);
  if (result !== true) {
      return result;
  }

  const loginService = inject(LoginService);
  const router = inject(Router);
  const memberIdParam = route.paramMap.get('id');

  return loginService.userIsAdmin.pipe(
    switchMap((isAdmin: boolean) => {
      if (isAdmin) {
        return of(true);
      }
      if (memberIdParam) {
        return loginService.isCurrentUserPersonId(memberIdParam).pipe(
          map((response) => {
            if (response.object === true) {
              return router.parseUrl('/perfil');
            } else {
              return true;
            }
          })
        );
      }
      return of(true);
    })
  );
};

const adminInfoGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const adminIdParam = route.paramMap.get('id');

  return loginService.userIsAdmin.pipe(
    map(isAdmin => {
      if (!isAdmin) {
        return router.parseUrl('/inicio');
      }
      return true;
    }),
    switchMap(result => {
      if (result !== true) {
        return of(result);
      }
      if (adminIdParam) {
        return loginService.isCurrentUserPersonId(adminIdParam).pipe(
          map((response) => {
            if (response.object === true) {
              return router.parseUrl('/perfil');
            } else {
              return true;
            }
          })
        );
      }
      return of(true);
    })
  );
};
// END Generado con GitHub Copilot Chat Extension


export const routes: Routes = [
    { path: 'inicio', component: Home, canActivate: [authGuard] },
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: 'iniciar-sesion', component: Login, canActivate: [guestGuard] },
    { path: 'registro', component: Signup, canActivate: [guestGuard] },
    { path: 'perfil', component: Profile, canActivate: [authGuard] },
    { path: 'administradores', component: AdminList, canActivate: [adminGuard] },
    { path: 'administradores/crear', component: CreateAdmin, canActivate: [adminGuard] },
    { path: 'administradores/:id', component: AdminInfo, canActivate: [adminInfoGuard] },
    { path: 'fondo-solidario', component: SolidarityFund, canActivate: [authGuard] },
    { path: 'miembros', component: MemberList, canActivate: [authGuard] },
    { path: 'miembros/:id', component: MemberInfo, canActivate: [memberInfoGuard] },
    { path: '**', redirectTo: '/inicio' }
];
