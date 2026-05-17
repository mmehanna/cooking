import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SubscriptionClient {
  private apiUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  public getTier(): Observable<{ tier: string }> {
    return this.httpClient.get<{ tier: string }>(`${this.apiUrl}/subscription/tier`);
  }

  public upgradeTier(tier: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/subscription/upgrade`, { tier });
  }
}
