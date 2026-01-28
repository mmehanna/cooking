import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthClient} from "../../_clients/auth.client";
import {Router} from "@angular/router";


@Injectable({providedIn: 'root'})
export class AuthService {


  constructor(private authClient: AuthClient,
              private router: Router) {
  }

  public getToken(): string | null {
    return localStorage.getItem('accessToken');
  }


  public login(email: string, password: string): Observable<any> {
    return this.authClient.login(email, password);
  }

  public register(user: any): Observable<any> {
    return this.authClient.register(user);
  }

  // Méthode de logout
  public logout() {
    // Supprimer le token du localStorage ou sessionStorage
    localStorage.removeItem('accessToken');

    // Rediriger vers la page de login ou d'accueil
    this.router.navigate(['/login']);
  }

  // Pour vérifier si l'utilisateur est authentifié
  public isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

}


