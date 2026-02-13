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

  // Simple JWT token decoder
  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token');
      }

      const payload = parts[1];
      // Add padding if needed
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));


      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Get user ID from token
  public getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = this.decodeToken(token);
        return decodedToken?.userId || null;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

}


