import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthClient} from "../../_clients/auth.client";


@Injectable({providedIn: 'root'})
export class AuthService {


  constructor(private authClient: AuthClient) {
  }

  public login(email: string, password: string): Observable<any> {
    return this.authClient.login(email, password);
  }

  public register(user: any): Observable<any> {
    return this.authClient.register(user);
  }

}


