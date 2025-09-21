import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { LoginRequest } from '../../services/auth/payload/request/login-request';
import { environment } from '../../../environments/environment';
import { MessagesContainer } from '../../components/messages-container/messages-container';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MessagesContainer],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private loginService = inject(LoginService);
  timeout = environment.msgTimeout;

  loginError: string = '';
  loginSuccess?: string;

  showPassword: boolean = false;

  loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern('^[a-z0-9_.]+$'),
        Validators.minLength(5),
        Validators.maxLength(15)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12)
      ]]
    });

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;
    if (state && state['successMsg']) {
      this.loginSuccess = state['successMsg'];
      setTimeout(() => this.loginSuccess = undefined, this.timeout);
    }
  }

  get username() {
    return this.loginForm.controls.username;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
        error: (errorData) => {
          let msg = '';
          if (typeof errorData === 'string') {
            msg = errorData.replace('Error: ', '');
          } else if (errorData && typeof errorData.message === 'string') {
            msg = errorData.message.replace('Error: ', '');
          } else {
            msg = 'Ha ocurrido un error inesperado.';
          }
          this.loginError = msg;
        },
        complete: () => {
          this.router.navigateByUrl('/inicio');
          this.loginForm.reset();
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.loginError = 'Credenciales no válidas.';
    }
  }

}
