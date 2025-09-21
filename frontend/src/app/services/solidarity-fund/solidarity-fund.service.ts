import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginService } from '../auth/login.service';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageResponse } from '../../payload/response/message-response';
import { ErrorHandler } from '../../util/error-handler';

@Injectable({
  providedIn: 'root'
})
export class SolidarityFundService {

  private http = inject(HttpClient);
  private loginService = inject(LoginService);
  private errorHandler = new ErrorHandler();

  getSolidarityFund(): Observable<MessageResponse> {
    const token = this.loginService.userToken;
    return this.http.get<MessageResponse>(environment.apiUrl + 'solidarity-fund', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al obtener Fondo Solidario.'))
    );
  }

}
