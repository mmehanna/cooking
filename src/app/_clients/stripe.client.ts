import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { API_BASE_URL } from "./api-url";

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

export interface SubscriptionPlanResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  isPopular: boolean;
  trialDays: number;
}

@Injectable({providedIn: 'root'})
export class StripeClient {
  private apiUrl = API_BASE_URL;

  constructor(private httpClient: HttpClient) {}

  public getPlans(): Observable<SubscriptionPlanResponse[]> {
    return this.httpClient.get<SubscriptionPlanResponse[]>(`${this.apiUrl}/subscription/plans`);
  }

  public createCheckoutSession(dto: CreateCheckoutSessionDto): Observable<StripeCheckoutSession> {
    return this.httpClient.post<StripeCheckoutSession>(`${this.apiUrl}/subscription/create-checkout-session`, dto);
  }

  public getSubscriptionStatus(): Observable<{ status: string; planId: string | null }> {
    return this.httpClient.get<{ status: string; planId: string | null }>(`${this.apiUrl}/subscription/subscription-status`);
  }

  public cancelSubscription(): Observable<{ success: boolean; message: string }> {
    return this.httpClient.post<{ success: boolean; message: string }>(`${this.apiUrl}/subscription/cancel-subscription`, {});
  }
}
