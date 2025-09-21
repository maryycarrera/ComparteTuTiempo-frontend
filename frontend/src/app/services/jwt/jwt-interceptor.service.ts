import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../auth/login.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  private loginService = inject(LoginService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: String = this.loginService.userToken;
    console.log('JWT Interceptor ejecutado. Token:', token);

    if (token && token !== '') {
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json;charset=UTF-8',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }

}
