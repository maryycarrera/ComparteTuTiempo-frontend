import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginService } from '../auth/login.service';
import { MemberProfileDTO } from './dto/member-profile-dto';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListMessageResponse } from '../../payload/response/list-message-response';
import { MemberListDTO } from './dto/member-list-dto';
import { MemberListForAdminDTO } from './dto/member-list-for-admin-dto';
import { MemberDTO } from './dto/member-dto';
import { MessageResponse } from '../../payload/response/message-response';
import { MemberForMemberDTO } from './dto/member-for-member-dto';
import { ErrorHandler } from '../../util/error-handler';
import { MemberEditDTO } from './dto/member-edit-dto';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private http = inject(HttpClient);
  private loginService = inject(LoginService);
  private errorHandler = new ErrorHandler();
  private memberUrl = environment.apiUrl + 'members';

  getAllMembers(): Observable<ListMessageResponse<MemberListDTO|MemberListForAdminDTO>> {
    const token = this.loginService.userToken;
    return this.http.get<ListMessageResponse<MemberListDTO|MemberListForAdminDTO>>(this.memberUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al obtener lista de miembros.'))
    );
  }

  getMemberById(id: string): Observable<MessageResponse<MemberDTO|MemberForMemberDTO>> {
    const token = this.loginService.userToken;
    return this.http.get<MessageResponse<MemberDTO|MemberForMemberDTO>>(`${this.memberUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al obtener miembro por ID.'))
    );
  }

  getProfile(): Observable<MemberProfileDTO> {
    const token = this.loginService.userToken;
    return this.http.get<MemberProfileDTO>(environment.apiUrl + 'auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al obtener perfil de usuario.'))
    );
  }

  deleteMember(memberId: string): Observable<string> {
    const token = this.loginService.userToken;
    return this.http.delete<string>(`${this.memberUrl}/${memberId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'text' as 'json'
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al eliminar miembro.'))
    );
  }

  editProfile(data: MemberEditDTO): Observable<MessageResponse<MemberProfileDTO>> {
    const token = this.loginService.userToken;
    return this.http.put<MessageResponse<MemberProfileDTO>>(this.memberUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al editar perfil de miembro.'))
    );
  }

  editProfilePicture(color: string): Observable<MessageResponse<MemberProfileDTO>> {
    const token = this.loginService.userToken;
    return this.http.put<MessageResponse<MemberProfileDTO>>(this.memberUrl + '/profile-picture', null, {
      params: { color },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al editar imagen de perfil de miembro.'))
    );
  }

}
