import type { PropertyCurrency } from "@/lib/currency";
import type { UserTier } from "@/lib/admin/types";

export type PremiumPropertyStatus =
  | "available"
  | "caught"
  | "expired"
  | "converted";

export interface PremiumProperty {
  id: string;
  name: string;
  address: string;
  type: string;
  area: string;
  district: string;
  region: string;
  description: string;
  img: string;
  images: string[];
  currency: PropertyCurrency;
  totalValue: number;
  premiumRoi: number;
  standardRoi: number;
  premiumDeadline: string;
  premiumDeadlineDays: number;
  status: PremiumPropertyStatus;
  caughtByUserId?: string;
  caughtByUserName?: string;
  caughtAt?: string;
  notifyPremiumUsers: boolean;
  createdAt: string;
}

export interface PremiumInvestment {
  id: string;
  certificateId: string;
  propertyId: string;
  userId: string;
  amount: number;
  currency: PropertyCurrency;
  premiumRoi: number;
  ownershipPercent: number;
  datePaid: string;
  expectedRoiDate: string;
  daysUntilRoi: number;
  status: "active" | "pending" | "completed";
  paymentMethod: string;
  estimatedReturn: number;
  isPremiumExclusive: true;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  tier: UserTier;
  initials: string;
  verified: boolean;
  totalInvested: number;
  premiumInvestments: number;
}

export type PremiumCountdown = {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
};
