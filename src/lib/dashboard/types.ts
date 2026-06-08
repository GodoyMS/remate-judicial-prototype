import type { PropertyCurrency } from "@/lib/currency";

export type InvestmentStatus = "active" | "completed" | "pending" | "cancelled";
export type PropertyStatus = "Activo" | "Próximo" | "Cerrado";

export interface LiveInvestment {
  id: string;
  obfuscatedName: string;
  amount: number;
  timeAgo: string;
}

export interface DashboardProperty {
  id: number;
  name: string;
  address: string;
  type: string;
  area: string;
  price: number;
  minInvestment: number;
  roi: number;
  deadline: string;
  deadlineDays: number;
  status: PropertyStatus;
  district: string;
  region: string;
  description: string;
  img: string;
  images: string[];
  badge: string;
  badgeStyle: string;
  investors: number;
  raisedAmount: number;
  totalInvestment: number;
  currency: PropertyCurrency;
  liveInvestments: LiveInvestment[];
}

export interface UserInvestment {
  id: string;
  certificateId: string;
  propertyId: number;
  amount: number;
  currency: PropertyCurrency;
  roi: number;
  datePaid: string;
  expectedRoiDate: string;
  daysUntilRoi: number;
  status: InvestmentStatus;
  paymentMethod: string;
  estimatedReturn: number;
}
