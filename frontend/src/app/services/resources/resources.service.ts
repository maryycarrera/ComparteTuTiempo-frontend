import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginService } from '../auth/login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  private http = inject(HttpClient);
  private loginService = inject(LoginService);

  getProfilePicture(picUrl: string): Observable<Blob> {
    const token = this.loginService.userToken;
    return this.http.get(picUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'blob'
    });
  }

}
