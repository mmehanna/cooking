export interface FamilyModel {
  id: string;
  name: string;
  ownerUserId: string;
  owner?: {
    id: string;
    email: string;
    name: string;
  };
  users?: Array<{
    user: {
      id: string;
      email: string;
      name: string;
    };
  }>;
  createdAt?: string;
  updatedAt?: string;
}