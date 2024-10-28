import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class AuthClient {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private httpClient: HttpClient) {
  }


  public login(email: string, password: string): Observable<any> {
    return this.httpClient.post<{ accessToken: string }>(`${this.apiUrl}/login`, {email, password}).pipe(
      map(response => {
        localStorage.setItem('accessToken', response.accessToken);
        return response;
      })
    );
  }

  public register(user: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/register`, user);
  }
}
