export interface FamilyMemberWeekPlateModel {
  id: string;
  label: string;
  mealType: string;
}

export interface FamilyMemberDateModel {
  date: string;
  plates: FamilyMemberWeekPlateModel[];
}

export interface FamilyMemberWeekModel {
  userId: string;
  name: string;
  dates: FamilyMemberDateModel[];
}

export interface FamilyWeekPlatesModel {
  familyId: string;
  weekStartDate: string;
  members: FamilyMemberWeekModel[];
}
