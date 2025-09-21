import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  private http = inject(HttpClient);
  private loginService = inject(LoginService);

  logout(): Observable<string> {
    const token = this.loginService.userToken;
    return this.http.post<string>(
      environment.apiUrl + 'auth/logout',
      { token: token },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).pipe(
      tap(() => {
        sessionStorage.removeItem('userData');
        this.loginService.currentUserData.next(null);
        this.loginService.currentIsUserLoggedIn.next(false);
      }),
      catchError((error) => {
        sessionStorage.removeItem('userData');
        this.loginService.currentUserData.next(null);
        this.loginService.currentIsUserLoggedIn.next(false);
        return throwError(() => error);
      })
    );
  }

}
