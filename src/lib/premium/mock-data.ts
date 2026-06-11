import type { PremiumProperty, PremiumInvestment, DashboardUser } from "./types";
import {
  getCreatedPremiumProperties,
  getPremiumPropertyOverride,
  getPendingInvestmentsForProperty,
} from "@/lib/app-store";
import { adminPropertyToPremiumProperty } from "./convert";

export { getPremiumPropertyOverride } from "@/lib/app-store";

export function isPropertyEffectivelyAvailable(propertyId: string): boolean {
  // Check if overridden (admin set status)
  const override = getPremiumPropertyOverride(propertyId);
  if (override && override.premiumStatus !== "available") return false;
  // Check if a pending investment exists (locked while under review)
  const pending = getPendingInvestmentsForProperty(propertyId);
  if (pending.some((i) => i.status === "pending_verification")) return false;
  return true;
}

const PREMIUM_USER_ID = "premium-demo";
const OTHER_PREMIUM_USER_ID = "u2";

export const DEMO_USERS: Record<string, DashboardUser> = {
  "premium@remata.com": {
    id: PREMIUM_USER_ID,
    name: "Valentina Ríos",
    email: "premium@remata.com",
    tier: "premium",
    initials: "VR",
    verified: true,
    totalInvested: 1240000,
    premiumInvestments: 2,
  },
  "standard@remata.com": {
    id: "standard-demo",
    name: "Carlos Mendoza",
    email: "standard@remata.com",
    tier: "standard",
    initials: "CM",
    verified: true,
    totalInvested: 185000,
    premiumInvestments: 0,
  },
};

export const DEFAULT_USER = DEMO_USERS["standard@remata.com"];

export const premiumProperties: PremiumProperty[] = [
  {
    id: "pp-101",
    name: "Penthouse Vista al Mar — Chorrillos",
    address: "Malecón de la Marina 890, Chorrillos",
    type: "Penthouse",
    area: "240 m²",
    district: "Chorrillos",
    region: "Lima",
    description:
      "Exclusivo penthouse con terraza de 80 m² y vista panorámica al Pacífico. Oportunidad premium: invierte el 100% y obtén retornos excepcionales antes de que pase al mercado estándar.",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
    ],
    currency: "USD",
    totalValue: 890000,
    premiumRoi: 48,
    standardRoi: 22,
    premiumDeadline: "2026-06-11T23:59:59",
    premiumDeadlineDays: 3,
    status: "available",
    notifyPremiumUsers: true,
    createdAt: "2026-06-05",
  },
  {
    id: "pp-102",
    name: "Villa de Lujo — Asia",
    address: "Km 98 Panamericana Sur, Asia",
    type: "Villa",
    area: "420 m²",
    district: "Asia",
    region: "Lima",
    description:
      "Villa frente al mar con piscina infinita y 5 suites. Esta propiedad premium fue capturada por un inversor exclusivo con inversión del 100%.",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1605276374101-de4c0a5e9622?w=1200&h=800&fit=crop",
    ],
    currency: "USD",
    totalValue: 1450000,
    premiumRoi: 52,
    standardRoi: 24,
    premiumDeadline: "2026-06-01T23:59:59",
    premiumDeadlineDays: 0,
    status: "caught",
    caughtByUserId: OTHER_PREMIUM_USER_ID,
    caughtByUserName: "María Vargas",
    caughtAt: "2026-06-02T14:32:00",
    notifyPremiumUsers: true,
    createdAt: "2026-05-28",
  },
  {
    id: "pp-103",
    name: "Loft Industrial — Barranco",
    address: "Jr. Unión 412, Barranco",
    type: "Loft",
    area: "165 m²",
    district: "Barranco",
    region: "Lima",
    description:
      "Loft de diseño en zona bohemia con doble altura y acabados de autor. Capturado por ti con inversión exclusiva del 100%.",
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
    ],
    currency: "PEN",
    totalValue: 520000,
    premiumRoi: 45,
    standardRoi: 20,
    premiumDeadline: "2026-06-04T23:59:59",
    premiumDeadlineDays: 0,
    status: "caught",
    caughtByUserId: PREMIUM_USER_ID,
    caughtByUserName: "Valentina Ríos",
    caughtAt: "2026-06-03T09:15:00",
    notifyPremiumUsers: true,
    createdAt: "2026-05-25",
  },
  {
    id: "pp-104",
    name: "Departamento Skyline — San Borja",
    address: "Av. San Luis 2850, San Borja",
    type: "Departamento",
    area: "128 m²",
    district: "San Borja",
    region: "Lima",
    description:
      "Departamento en piso alto con vista a la ciudad. Ventana premium abierta: sé el único inversor con retorno del 42% antes de apertura estándar.",
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop",
    ],
    currency: "PEN",
    totalValue: 380000,
    premiumRoi: 42,
    standardRoi: 19,
    premiumDeadline: "2026-06-15T23:59:59",
    premiumDeadlineDays: 7,
    status: "available",
    notifyPremiumUsers: true,
    createdAt: "2026-06-01",
  },
  {
    id: "pp-105",
    name: "Casa de Playa — Punta Hermosa",
    address: "Calle Los Delfines 45, Punta Hermosa",
    type: "Casa",
    area: "310 m²",
    district: "Punta Hermosa",
    region: "Lima",
    description:
      "Casa de playa con acceso directo al mar. El periodo premium expiró sin inversor — ahora disponible como propiedad estándar con ROI del 21%.",
    img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=800&fit=crop",
    ],
    currency: "USD",
    totalValue: 720000,
    premiumRoi: 46,
    standardRoi: 21,
    premiumDeadline: "2026-05-30T23:59:59",
    premiumDeadlineDays: 0,
    status: "converted",
    notifyPremiumUsers: false,
    createdAt: "2026-05-10",
  },
];

export const premiumInvestments: PremiumInvestment[] = [
  {
    id: "pinv-001",
    certificateId: "PREM-2026-000412",
    propertyId: "pp-103",
    userId: PREMIUM_USER_ID,
    amount: 520000,
    currency: "PEN",
    premiumRoi: 45,
    ownershipPercent: 100,
    datePaid: "2026-06-03",
    expectedRoiDate: "2027-06-03",
    daysUntilRoi: 360,
    status: "active",
    paymentMethod: "Transferencia bancaria",
    estimatedReturn: 234000,
    isPremiumExclusive: true,
  },
  {
    id: "pinv-002",
    certificateId: "PREM-2026-000389",
    propertyId: "pp-101",
    userId: PREMIUM_USER_ID,
    amount: 890000,
    currency: "USD",
    premiumRoi: 48,
    ownershipPercent: 100,
    datePaid: "2026-06-06",
    expectedRoiDate: "2027-06-06",
    daysUntilRoi: 363,
    status: "pending",
    paymentMethod: "Tarjeta débito / crédito",
    estimatedReturn: 427200,
    isPremiumExclusive: true,
  },
];

export function getAllPremiumProperties(): PremiumProperty[] {
  if (typeof window === "undefined") {
    return premiumProperties;
  }
  const created = getCreatedPremiumProperties().map(adminPropertyToPremiumProperty);
  const createdIds = new Set(created.map((p) => p.id));
  const staticOnly = premiumProperties.filter((p) => !createdIds.has(p.id));
  return [...created, ...staticOnly];
}

export function getPremiumPropertyById(id: string): PremiumProperty | undefined {
  return getAllPremiumProperties().find((p) => p.id === id);
}

export function getPremiumInvestmentsForUser(userId: string): PremiumInvestment[] {
  return premiumInvestments.filter((i) => i.userId === userId);
}

export function isCaughtByUser(property: PremiumProperty, userId: string): boolean {
  return property.status === "caught" && property.caughtByUserId === userId;
}

export function isCaughtByOther(property: PremiumProperty, userId: string): boolean {
  return property.status === "caught" && property.caughtByUserId !== userId;
}

export function getPremiumCountdown(deadline: string): {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
} {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, expired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes, expired: false };
}
