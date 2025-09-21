import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SignupRequest } from '../../payload/request/signup-request';
import { Observable, throwError } from 'rxjs';
import { MessageResponse } from '../../payload/response/message-response';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserCreationService } from '../user-creation-service';
import { ErrorHandler } from '../../util/error-handler';

@Injectable({
  providedIn: 'root'
})
export class SignupService implements UserCreationService {

  private http = inject(HttpClient);
  private errorHandler = new ErrorHandler();

  create(request: SignupRequest): Observable<MessageResponse> {
    return this.signup(request);
  }

  private signup(data: SignupRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(environment.apiUrl + 'auth/signup', data).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al registrar usuario.'))
    );
  }

}
