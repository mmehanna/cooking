import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface CreateCheckoutSessionDto {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
  status: string;
}

@Injectable({providedIn: 'root'})
export class StripeClient {
  private apiUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  public createCheckoutSession(dto: CreateCheckoutSessionDto): Observable<StripeCheckoutSession> {
    return this.httpClient.post<StripeCheckoutSession>(`${this.apiUrl}/stripe/create-checkout-session`, dto);
  }

  public getSubscriptionStatus(): Observable<{ status: string; planId: string | null }> {
    return this.httpClient.get<{ status: string; planId: string | null }>(`${this.apiUrl}/stripe/subscription-status`);
  }

  public cancelSubscription(): Observable<{ success: boolean; message: string }> {
    return this.httpClient.post<{ success: boolean; message: string }>(`${this.apiUrl}/stripe/cancel-subscription`, {});
  }
}
