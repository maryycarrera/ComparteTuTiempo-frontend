import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin/admin.service';
import { SignupRequest } from '../../payload/request/signup-request';
import { SignupService } from '../../services/auth/signup.service';
import { UserCreationService } from '../../services/user-creation-service';
import { MessagesContainer } from '../messages-container/messages-container';

@Component({
  selector: 'app-base-user-form',
  imports: [ReactiveFormsModule, MessagesContainer],
  templateUrl: './base-user-form.html',
  styleUrl: './base-user-form.css'
})
export class BaseUserForm implements OnInit {

  @Input() isSignup: boolean = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private adminService = inject(AdminService);
  private signupService = inject(SignupService);

  successMsg: string = '';
  errorMsg: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  service: UserCreationService | null = null;
  navigateTo: string = '';
  buttonText: string = '';

  ngOnInit() {
    this.service = this.isSignup ? this.signupService : this.adminService;
    this.navigateTo = this.isSignup ? '/iniciar-sesion' : '/administradores';
    this.buttonText = this.isSignup ? 'Registrarse' : 'Guardar';
    this.successMsg = this.isSignup ? 'Cuenta creada ' : 'Administrador creado ';
  }

  form = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]],
    lastName: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]],
    username: ['', [
      Validators.required,
      Validators.pattern('^[a-z0-9_.]+$'),
      Validators.minLength(5),
      Validators.maxLength(15)
    ]],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(255)
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(12),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d])(?!.*\\s).+$')
    ]],
    confirmPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(12),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d])(?!.*\\s).+$')
    ]]
  }, { validators: this.passwordsMatchValidator });

  private passwordsMatchValidator(formGroup: any) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get name() { return this.form.controls.name; }
  get lastName() { return this.form.controls.lastName; }
  get username() { return this.form.controls.username; }
  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }
  get confirmPassword() { return this.form.controls.confirmPassword; }

  create() {
    if (this.form.valid) {
      const signupRequest: SignupRequest = {
        name: this.name.value!,
        lastName: this.lastName.value!,
        username: this.username.value!,
        email: this.email.value!,
        password: this.password.value!
      };

      if (this.service) {
        this.service.create(signupRequest).subscribe({
          next: (createdUser: any) => {
            this.successMsg = this.successMsg + ' correctamente.' + (this.isSignup ? ' Inicia sesión para comenzar a utilizar el Banco de Tiempo.' : '');
            if (!this.isSignup) {
              const id = createdUser && createdUser.id ? createdUser.id : null;
              if (id) {
                this.navigateTo = `/administradores/${id}`;
              }
            }
            this.router.navigateByUrl(this.navigateTo, { state: { successMsg: this.successMsg } });
            this.form.reset();
          },
          error: (error: any) => {
            let msg = '';
            if (typeof error === 'string') {
              msg = error.replace('Error: ', '');
            } else if (error && typeof error.message === 'string') {
              msg = error.message.replace('Error: ', '');
            } else {
              msg = 'Error al crear la cuenta. Por favor, inténtalo de nuevo.';
            }
            this.errorMsg = msg;
          }
        });
      } else {
        this.errorMsg = 'No se pudo crear la cuenta. Servicio no disponible.';
      }
    } else {
      this.form.markAllAsTouched();
      this.errorMsg = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
    }
  }
}
