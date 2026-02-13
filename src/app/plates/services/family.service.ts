import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FamilyModel } from "../../_clients/models/FamilyModel";
import { SharedPlateModel } from "../../_clients/models/SharedPlateModel";
import { SharePlateDto } from "../../_clients/models/SharePlateDto";
import { CreateFamilyDto } from "../../_clients/models/CreateFamilyDto";
import { InviteFamilyMemberDto } from "../../_clients/models/InviteFamilyMemberDto";
import { FamilyClient } from "../../_clients/family.client";

@Injectable({ providedIn: 'root' })
export class FamilyService {
  constructor(private familyClient: FamilyClient) { }

  public createFamily(createFamilyDto: CreateFamilyDto): Observable<FamilyModel> {
    return this.familyClient.createFamily(createFamilyDto);
  }

  public getFamilyById(familyId: string): Observable<FamilyModel> {
    return this.familyClient.getFamilyById(familyId);
  }

  public getUserFamilies(): Observable<FamilyModel[]> {
    return this.familyClient.getUserFamilies();
  }

  public inviteToFamily(familyId: string, inviteFamilyMemberDto: InviteFamilyMemberDto): Observable<any> {
    return this.familyClient.inviteToFamily(familyId, inviteFamilyMemberDto);
  }

  public sharePlate(sharePlateDto: SharePlateDto): Observable<any> {
    return this.familyClient.sharePlate(sharePlateDto);
  }

  public getSharedPlatesWithUser(): Observable<SharedPlateModel[]> {
    return this.familyClient.getSharedPlatesWithUser();
  }

  public getSharedPlatesByUser(): Observable<SharedPlateModel[]> {
    return this.familyClient.getSharedPlatesByUser();
  }

  public removeMember(familyId: string, memberId: string): Observable<any> {
    return this.familyClient.removeMember(familyId, memberId);
  }

  public deleteFamily(familyId: string): Observable<any> {
    return this.familyClient.deleteFamily(familyId);
  }
}