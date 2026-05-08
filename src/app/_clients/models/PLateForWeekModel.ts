export interface PlateForWeekEntry {
  id: string;
  label: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | string;
}

export interface PLateForWeekModel {
  date: string;
  plates: PlateForWeekEntry[];
}
