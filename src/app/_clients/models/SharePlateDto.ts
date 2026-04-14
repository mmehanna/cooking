export interface SharePlateDto {
  plateId: string;
  sharedWithUserId: string;
  familyId?: string;
}

export interface BatchSharePlateDto {
  plateIds: string[];
  sharedWithUserId: string;
  familyId?: string;
}