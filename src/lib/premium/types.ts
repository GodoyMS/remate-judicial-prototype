import type { PropertyCurrency } from "@/lib/currency";
import type { UserTier } from "@/lib/admin/types";
import type { JudicialRecord, VerificationReport, RoiBasis } from "@/lib/dashboard/types";

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
  /** Cierre de la ventana Premium (ISO con offset de Lima). */
  premiumDeadline: string;
  /** Obsoleto: se deriva de `premiumDeadline`. Se conserva por compatibilidad con admin. */
  premiumDeadlineDays: number;
  /**
   * Estado editorial que fija admin. La disponibilidad real para un usuario
   * se deriva de la ventana y de las reservas (ver `availability.ts`).
   */
  status: PremiumPropertyStatus;
  caughtByUserId?: string;
  caughtByUserName?: string;
  caughtAt?: string;
  notifyPremiumUsers: boolean;
  createdAt: string;
  judicial: JudicialRecord;
  verification: VerificationReport;
  roiBasis: RoiBasis;
  /** Criterios reales que justifican la clasificación Premium (P-019). */
  premiumCriteria: string[];
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
