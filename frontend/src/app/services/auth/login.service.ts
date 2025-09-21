import { inject, Injectable } from '@angular/core';
import { LoginRequest } from './payload/request/login-request';
import { JwtResponse } from './payload/response/jwt-response';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError, BehaviorSubject, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageResponse } from '../../payload/response/message-response';
import { ErrorHandler } from '../../util/error-handler';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient);
  private errorHandler = new ErrorHandler();

  currentIsUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<JwtResponse | null> = new BehaviorSubject<JwtResponse | null>(null);

  constructor() {
    const userData = JSON.parse(sessionStorage.getItem('userData') || 'null');
    this.currentUserData = new BehaviorSubject<JwtResponse | null>(userData);
    this.currentIsUserLoggedIn = new BehaviorSubject<boolean>(!!userData && !!userData.token);
  }

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(environment.apiUrl + 'auth/login', credentials).pipe(
      tap((userData) => {
        sessionStorage.setItem('userData', JSON.stringify(userData));
        this.currentUserData.next(userData);
        this.currentIsUserLoggedIn.next(true);
      }),
      catchError(error => this.errorHandler.handleError(error, 'Error al iniciar sesión.'))
    );
  }

  fullname(): Observable<MessageResponse> {
    return this.http.get<MessageResponse>(environment.apiUrl + 'auth/fullname', {
      headers: {
        Authorization: `Bearer ${this.userToken}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al obtener nombre completo.'))
    );
  }

  isCurrentUserPersonId(personId: string): Observable<MessageResponse<Boolean>> {
    return this.http.get<MessageResponse<Boolean>>(environment.apiUrl + 'auth/person-id-is-me/' + personId, {
      headers: {
        Authorization: `Bearer ${this.userToken}`
      }
    }).pipe(
      catchError(error => this.errorHandler.handleError(error, 'Error al verificar ID de persona.'))
    );
  }

  get userData(): Observable<JwtResponse | null> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentIsUserLoggedIn.asObservable();
  }

  get userToken(): String {
    const userData = JSON.parse(sessionStorage.getItem('userData') || 'null');
    return this.currentUserData.getValue()?.token || userData?.token || '';
  }

  get userAuthorities(): string[] {
    return this.currentUserData.getValue()?.authorities || [];
  }

  get userIsAdmin(): Observable<boolean> {
    return this.currentUserData.asObservable().pipe(
      map(userData => Array.isArray(userData?.authorities) && userData.authorities.includes('ADMIN'))
    );
  }

}
