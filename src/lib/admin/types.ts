import type { PropertyCurrency } from "@/lib/currency";

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
  images: string[];
  investorsCount: number;
  createdAt: string;
  status: PropertyStatus;
  currency: PropertyCurrency;
}

export type PaymentMethodId = "card" | "yape" | "transfer" | "deposit";

export type InvestmentStatus = "confirmed" | "pending" | "rejected";

export interface PropertyInvestment {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: PropertyCurrency;
  submittedAt: string;
  confirmedAt?: string;
  status: InvestmentStatus;
  paymentMethod: PaymentMethodId;
  transferNumber?: string;
  originAccountNumber?: string;
  voucherNumber?: string;
  voucherDate?: string;
  operationNumber?: string;
  receiptUrl?: string;
  yapePhone?: string;
  yapeApprovalCode?: string;
  cardLastFour?: string;
  rejectionReason?: string;
  rejectedBy?: string;
  rejectedAt?: string;
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

export type DocumentType = "dni" | "passport" | "ce";

export type VerificationQueueStatus = "pending" | "resolicitado" | "rejected";

export type VerificationActivityType =
  | "submitted"
  | "review_started"
  | "accepted"
  | "rejected"
  | "resolicitado"
  | "resubmitted";

export interface VerificationActivity {
  id: string;
  verificationId: string;
  type: VerificationActivityType;
  message: string;
  date: string;
  adminNote?: string;
}

export interface IdentityVerification {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  gender: string;
  provider: LoginProvider;
  submittedAt: string;
  status: VerificationQueueStatus;
  frontImageUrl: string;
  backImageUrl: string;
  rejectionReason?: string;
  resolicitReason?: string;
  activityLog: VerificationActivity[];
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

export interface AdminTestimonial {
  id: string;
  name: string;
  role: string;
  review: string;
  stars: number;
  amount?: string;
  avatar: string;
  avatarImageUrl?: string;
  videoUrl?: string;
  videoPosterUrl?: string;
  published: boolean;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
}

export type ComplaintType =
  | "reclamo"
  | "queja"
  | "sugerencia"
  | "consulta";

export type ComplaintStatus = "pending" | "in_review" | "resolved";

export interface ComplaintResponse {
  message: string;
  respondedBy: string;
  respondedAt: string;
}

export interface Complaint {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  documentType: DocumentType;
  documentNumber: string;
  type: ComplaintType;
  subject: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  response?: ComplaintResponse;
}
