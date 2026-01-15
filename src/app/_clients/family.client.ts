import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FamilyModel } from "./models/FamilyModel";
import { SharedPlateModel } from "./models/SharedPlateModel";
import { SharePlateDto } from "./models/SharePlateDto";
import { CreateFamilyDto } from "./models/CreateFamilyDto";
import { InviteFamilyMemberDto } from "./models/InviteFamilyMemberDto";

@Injectable({ providedIn: 'root' })
export class FamilyClient {
  private apiUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  public createFamily(createFamilyDto: CreateFamilyDto): Observable<FamilyModel> {
    return this.httpClient.post<FamilyModel>(`${this.apiUrl}/family`, createFamilyDto);
  }

  public getFamilyById(familyId: string): Observable<FamilyModel> {
    return this.httpClient.get<FamilyModel>(`${this.apiUrl}/family/${familyId}`);
  }

  public getUserFamilies(): Observable<FamilyModel[]> {
    return this.httpClient.get<FamilyModel[]>(`${this.apiUrl}/family`);
  }

  public inviteToFamily(familyId: string, inviteFamilyMemberDto: InviteFamilyMemberDto): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/family/${familyId}/invite`, inviteFamilyMemberDto);
  }

  public sharePlate(sharePlateDto: SharePlateDto): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/family/share-plate`, sharePlateDto);
  }

  public getSharedPlatesWithUser(): Observable<SharedPlateModel[]> {
    return this.httpClient.get<SharedPlateModel[]>(`${this.apiUrl}/family/shared-with-me`);
  }

  public getSharedPlatesByUser(): Observable<SharedPlateModel[]> {
    return this.httpClient.get<SharedPlateModel[]>(`${this.apiUrl}/family/shared-by-me`);
  }

  public removeMember(familyId: string, memberId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/family/${familyId}/remove-member/${memberId}`);
  }
}