import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin/admin.service';
import { Subscription } from 'rxjs';
import { AdminForListDTO } from '../../services/admin/dto/admin-for-list-dto';
import { BaseIconButton } from '../../components/base-icon-button/base-icon-button';
import { LoginService } from '../../services/auth/login.service';
import { ErrorHandler } from '../../util/error-handler';
import { environment } from '../../../environments/environment';
import { MessagesContainer } from '../../components/messages-container/messages-container';

@Component({
  selector: 'app-admin-list',
  imports: [ReactiveFormsModule, BaseIconButton, MessagesContainer],
  templateUrl: './admin-list.html',
  styleUrl: './admin-list.css'
})
export class AdminList implements OnInit, OnDestroy {

  private router = inject(Router);
  private adminService = inject(AdminService);
  private loginService = inject(LoginService);
  private subscription: Subscription = new Subscription();
  private isCurrentUserMap: Map<string, boolean> = new Map();
  private errorHandler = new ErrorHandler();

  errorMessage?: string;
  successMessage?: string;
  admins?: AdminForListDTO[];
  timeout = environment.msgTimeout;

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;
    if (state && state['successMsg']) {
      this.successMessage = state['successMsg'];
      setTimeout(() => this.successMessage = undefined, this.timeout);
    }
    this.subscription.add(
      this.adminService.getAllAdmins().subscribe({
        next: (response) => {
          this.admins = response.objects;
          if (!this.admins || this.admins.length === 0) {
            this.errorMessage = response.message;
          }
          if (this.admins) {
            this.admins.forEach(admin => this.checkIfCurrentUser(admin.id));
          }
        },
        error: (error) => {
          this.setError(error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  create() {
    this.router.navigate(['/administradores/crear']);
  }

  viewAdminDetails(adminId: string) {
    this.router.navigate(['/administradores', adminId]);
  }

  deleteAdmin(adminId: string) {
    this.adminService.deleteAdmin(adminId).subscribe({
      next: (msg) => {
        this.admins = this.admins?.filter(a => a.id !== adminId);
        this.successMessage = typeof msg === 'string' ? msg : 'Administrador eliminado con éxito.';
        setTimeout(() => this.successMessage = undefined, this.timeout);
        this.isCurrentUserMap.delete(adminId); // limpiar cache
      },
      error: (error) => {
        this.setError(error);
      }
    });
  }

  // Llama a la API solo si no está cacheado
  private checkIfCurrentUser(adminId: string): void {
    if (this.isCurrentUserMap.has(adminId)) return;
    this.loginService.isCurrentUserPersonId(adminId).subscribe({
      next: (response) => {
        this.isCurrentUserMap.set(adminId, !!response.object);
      },
      error: (error) => {
        this.isCurrentUserMap.set(adminId, false);
        this.setError(error);
      }
    });
  }

  isCurrentUserThisAdminId(adminId: string): boolean {
    return this.isCurrentUserMap.get(adminId) || false;
  }

  private setError(err: any) {
    this.errorMessage = this.errorHandler.extractMessage(err);
  }

}
