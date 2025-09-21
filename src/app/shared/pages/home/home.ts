import { Component, inject } from '@angular/core';
import { LoginService } from '../../../services/auth/login.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  private loginService = inject(LoginService);

  fullname: string = '';

  constructor() {
    this.loginService.fullname().subscribe({
      next: (response) => {
        this.fullname = response.object;
      },
      error: (error) => {
        console.error('Error al obtener el nombre completo:', error);
      }
    });
  }

}
