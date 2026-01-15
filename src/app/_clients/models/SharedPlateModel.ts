export interface SharedPlateModel {
  id: string;
  plateId: string;
  sharedWithUserId: string;
  sharedByUserId: string;
  familyId?: string;
  createdAt: string;
  plate: {
    id: string;
    label: string;
    description: string;
    category: string;
  };
  sharedByUser?: {
    name: string;
    email: string;
  };
  sharedWithUser?: {
    name: string;
    email: string;
  };
  family?: {
    id: string;
    name: string;
  };
}