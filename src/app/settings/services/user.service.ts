import { BehaviorSubject, Observable, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { UserClient } from "../../_clients/user.client";
import { UserProfileModel } from "../../_clients/models/UserProfileModel";
import { UpdateProfileDto } from "../../_clients/models/UpdateProfileDto";
import { UpdatePreferencesDto } from "../../_clients/models/UpdatePreferencesDto";
import { ChangePasswordDto } from "../../_clients/models/ChangePasswordDto";

@Injectable({ providedIn: 'root' })
export class UserService {
  private profileSubject = new BehaviorSubject<UserProfileModel | null>(null);
  public profile$ = this.profileSubject.asObservable();

  constructor(private userClient: UserClient) {}

  public loadProfile(): Observable<UserProfileModel> {
    return this.userClient.getProfile().pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }

  public updateProfile(dto: UpdateProfileDto): Observable<UserProfileModel> {
    return this.userClient.updateProfile(dto).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }

  public updatePreferences(dto: UpdatePreferencesDto): Observable<UserProfileModel> {
    return this.userClient.updatePreferences(dto).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }

  public changePassword(dto: ChangePasswordDto): Observable<any> {
    return this.userClient.changePassword(dto);
  }

  public deleteAccount(): Observable<any> {
    return this.userClient.deleteAccount();
  }
}