import { Component, inject } from '@angular/core';
import { LogoutService } from '../../services/auth/logout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.css'
})
export class Logout {

  private logoutService = inject(LogoutService);
  private router = inject(Router);

  logout() {
    this.logoutService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        console.error('Error al cerrar sesión', err);
        this.router.navigateByUrl('/');
      }
    });
  }
}
