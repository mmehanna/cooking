import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserProfileModel } from "./models/UserProfileModel";
import { UpdateProfileDto } from "./models/UpdateProfileDto";
import { UpdatePreferencesDto } from "./models/UpdatePreferencesDto";
import { ChangePasswordDto } from "./models/ChangePasswordDto";

@Injectable({ providedIn: 'root' })
export class UserClient {
  private apiUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  public getProfile(): Observable<UserProfileModel> {
    return this.httpClient.get<UserProfileModel>(`${this.apiUrl}/user/profile`);
  }

  public updateProfile(dto: UpdateProfileDto): Observable<UserProfileModel> {
    return this.httpClient.patch<UserProfileModel>(`${this.apiUrl}/user/profile`, dto);
  }

  public updatePreferences(dto: UpdatePreferencesDto): Observable<UserProfileModel> {
    return this.httpClient.patch<UserProfileModel>(`${this.apiUrl}/user/preferences`, dto);
  }

  public changePassword(dto: ChangePasswordDto): Observable<any> {
    return this.httpClient.patch(`${this.apiUrl}/user/password`, dto);
  }

  public deleteAccount(): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/user/account`);
  }
}