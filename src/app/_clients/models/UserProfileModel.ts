export interface UserProfileModel {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  language: string;
  theme: string;
  notifications: boolean;
}