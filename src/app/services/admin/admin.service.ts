import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AdminDTO } from './dto/admin-dto';
import { environment } from '../../../environments/environment';
import { LoginService } from '../auth/login.service';
import { SignupRequest } from '../../payload/request/signup-request';
import { MessageResponse } from '../../payload/response/message-response';
import { UserCreationService } from '../user-creation-service';
import { ListMessageResponse } from '../../payload/response/list-message-response';
import { AdminForListDTO } from './dto/admin-for-list-dto';
import { ErrorHandler } from '../../util/error-handler';
import { AdminEditDTO } from './dto/admin-edit-dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService implements UserCreationService {

  private http = inject(HttpClient);
  private loginService = inject(LoginService);
  private errorHandler = new ErrorHandler();
  private adminUrl = environment.apiUrl + 'admins';

  getProfile(): Observable<AdminDTO> {
    const token = this.loginService.userToken;
    return this.http.get<AdminDTO>(environment.apiUrl + 'auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al obtener perfil de usuario.'))
    );
  }

  getAdminById(id: string): Observable<MessageResponse<AdminDTO>> {
    const token = this.loginService.userToken;
    return this.http.get<MessageResponse<AdminDTO>>(this.adminUrl + `/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al obtener administrador por ID.'))
    );
  }

  create(data: SignupRequest): Observable<MessageResponse> {
    const token = this.loginService.userToken;
    return this.http.post<MessageResponse>(this.adminUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al crear administrador.'))
    );
  }

  getAllAdmins(): Observable<ListMessageResponse<AdminForListDTO>> {
    const token = this.loginService.userToken;
    return this.http.get<ListMessageResponse<AdminForListDTO>>(this.adminUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al obtener lista de administradores.'))
    );
  }

  deleteAdmin(adminId: string): Observable<string> {
    const token = this.loginService.userToken;
    return this.http.delete<string>(`${this.adminUrl}/${adminId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'text' as 'json'
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al eliminar administrador.'))
    );
  }

  editProfile(data: AdminEditDTO): Observable<MessageResponse<AdminDTO>> {
    const token = this.loginService.userToken;
    return this.http.put<MessageResponse<AdminDTO>>(this.adminUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al editar perfil de administrador.'))
    );
  }

  editProfilePicture(color: string): Observable<MessageResponse<AdminDTO>> {
    const token = this.loginService.userToken;
    return this.http.put<MessageResponse<AdminDTO>>(this.adminUrl + '/profile-picture', null, {
      params: { color },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al editar imagen de perfil de administrador.'))
    );
  }

}
