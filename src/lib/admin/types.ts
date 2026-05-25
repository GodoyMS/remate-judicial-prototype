export type PropertyStatus = "published" | "draft" | "closed";
export type UserTier = "premium" | "standard";
export type LoginProvider = "google" | "email" | "apple";
export type UserStatus = "active" | "blocked";

export interface AdminProperty {
  id: string;
  title: string;
  description: string;
  roi: number;
  publishDate: string;
  totalInvestment: number;
  raisedAmount: number;
  address: string;
  region: string;
  province: string;
  district: string;
  lat: number;
  lng: number;
  published: boolean;
  featured: boolean;
  notifyUsers: boolean;
  image: string;
  investorsCount: number;
  createdAt: string;
  status: PropertyStatus;
}

export interface PropertyInvestment {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier: UserTier;
  provider: LoginProvider;
  totalInvested: number;
  totalGains: number;
  status: UserStatus;
  joinedAt: string;
  phone: string;
  dni: string;
  verified: boolean;
  lastActive: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: "investment" | "login" | "verification" | "withdrawal";
  message: string;
  date: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
  avatar?: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
}
