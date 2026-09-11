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
  "premium@rematto.com": {
    id: PREMIUM_USER_ID,
    name: "Valentina Ríos",
    email: "premium@rematto.com",
    tier: "premium",
    initials: "VR",
    verified: true,
    totalInvested: 1240000,
    premiumInvestments: 2,
  },
  "standard@rematto.com": {
    id: "standard-demo",
    name: "Carlos Mendoza",
    email: "standard@rematto.com",
    tier: "standard",
    initials: "CM",
    verified: true,
    totalInvested: 185000,
    premiumInvestments: 0,
  },
};

export const DEFAULT_USER = DEMO_USERS["standard@rematto.com"];

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
    judicial: {
      expediente: "00721-2025-0-1801-JR-CI-04",
      juzgado: "4° Juzgado Civil de Lima",
      etapa: "Subasta convocada",
      lastReviewedAt: "2026-06-04",
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: "2026-06-04",
      scope: [
        "Partida registral y titularidad libre de cargas adicionales",
        "Estado del expediente en el Poder Judicial",
        "Tasación pericial vigente",
        "Situación registral para operación de alto valor",
      ],
      documents: [
        { label: "Partida registral (SUNARP)", url: "#" },
        { label: "Informe de tasación", url: "#" },
        { label: "Resolución de convocatoria a remate", url: "#" },
      ],
    },
    roiBasis: {
      assumptions: [
        { label: "Tasación pericial", value: "US$ 980,000" },
        { label: "Precio de salida en remate", value: "US$ 890,000" },
        { label: "Plazo estimado de liquidación", value: "10 meses" },
      ],
      costs: [
        { label: "Comisión Rematto", amount: 4450 },
        { label: "Gastos notariales y registrales", amount: 8900 },
        { label: "Impuestos de transferencia", amount: 17800 },
      ],
      grossRoi: 48,
      netRoi: 41,
    },
    premiumCriteria: [
      "Capital requerido superior a US$ 500,000",
      "Ventana de exclusividad antes de apertura a inversión colectiva",
      "Expediente en etapa de subasta con fecha de remate confirmada",
    ],
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
    judicial: {
      expediente: "01893-2025-0-1801-JR-CI-06",
      juzgado: "6° Juzgado Civil de Lima",
      etapa: "Adjudicada, en formalización",
      lastReviewedAt: "2026-06-02",
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: "2026-06-02",
      scope: [
        "Partida registral y titularidad libre de cargas adicionales",
        "Estado del expediente en el Poder Judicial",
        "Tasación pericial vigente",
      ],
      documents: [
        { label: "Partida registral (SUNARP)", url: "#" },
        { label: "Acta de adjudicación", url: "#" },
      ],
    },
    roiBasis: {
      assumptions: [
        { label: "Tasación pericial", value: "US$ 1,580,000" },
        { label: "Precio de adjudicación", value: "US$ 1,450,000" },
        { label: "Plazo estimado de liquidación", value: "11 meses" },
      ],
      costs: [
        { label: "Comisión Rematto", amount: 7250 },
        { label: "Gastos notariales y registrales", amount: 14500 },
        { label: "Impuestos de transferencia", amount: 29000 },
      ],
      grossRoi: 52,
      netRoi: 44,
    },
    premiumCriteria: [
      "Capital requerido superior a US$ 500,000",
      "Ventana de exclusividad antes de apertura a inversión colectiva",
      "Expediente adjudicado, en etapa de formalización",
    ],
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
    judicial: {
      expediente: "00347-2025-0-1801-JR-CI-08",
      juzgado: "8° Juzgado Civil de Lima",
      etapa: "Adjudicada, en formalización",
      lastReviewedAt: "2026-06-03",
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: "2026-06-03",
      scope: [
        "Partida registral y titularidad libre de cargas adicionales",
        "Estado del expediente en el Poder Judicial",
        "Tasación pericial vigente",
      ],
      documents: [
        { label: "Partida registral (SUNARP)", url: "#" },
        { label: "Acta de adjudicación", url: "#" },
      ],
    },
    roiBasis: {
      assumptions: [
        { label: "Tasación pericial", value: "S/ 565,000" },
        { label: "Precio de adjudicación", value: "S/ 520,000" },
        { label: "Plazo estimado de liquidación", value: "9 meses" },
      ],
      costs: [
        { label: "Comisión Rematto", amount: 2600 },
        { label: "Gastos notariales y registrales", amount: 5200 },
        { label: "Impuestos de transferencia", amount: 10400 },
      ],
      grossRoi: 45,
      netRoi: 38,
    },
    premiumCriteria: [
      "Capital requerido superior a S/ 500,000",
      "Ventana de exclusividad antes de apertura a inversión colectiva",
      "Expediente adjudicado, en etapa de formalización",
    ],
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
    judicial: {
      expediente: "01204-2025-0-1801-JR-CI-11",
      juzgado: "11° Juzgado Civil de Lima",
      etapa: "Subasta convocada",
      lastReviewedAt: "2026-06-01",
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: "2026-06-01",
      scope: [
        "Partida registral y titularidad libre de cargas adicionales",
        "Estado del expediente en el Poder Judicial",
        "Tasación pericial vigente",
      ],
      documents: [
        { label: "Partida registral (SUNARP)", url: "#" },
        { label: "Resolución de convocatoria a remate", url: "#" },
      ],
    },
    roiBasis: {
      assumptions: [
        { label: "Tasación pericial", value: "S/ 410,000" },
        { label: "Precio de salida en remate", value: "S/ 380,000" },
        { label: "Plazo estimado de liquidación", value: "9 meses" },
      ],
      costs: [
        { label: "Comisión Rematto", amount: 1900 },
        { label: "Gastos notariales y registrales", amount: 3800 },
      ],
      grossRoi: 42,
      netRoi: 36,
    },
    premiumCriteria: [
      "Capital requerido superior a S/ 350,000",
      "Ventana de exclusividad antes de apertura a inversión colectiva",
      "Expediente en etapa de subasta con fecha de remate confirmada",
    ],
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
    judicial: {
      expediente: "00889-2024-0-1801-JR-CI-02",
      juzgado: "2° Juzgado Civil de Lima",
      etapa: "En comercialización",
      lastReviewedAt: "2026-05-29",
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: "2026-05-29",
      scope: [
        "Partida registral y titularidad libre de cargas adicionales",
        "Estado del expediente en el Poder Judicial",
        "Tasación pericial vigente",
      ],
      documents: [{ label: "Partida registral (SUNARP)", url: "#" }],
    },
    roiBasis: {
      assumptions: [
        { label: "Tasación pericial", value: "US$ 780,000" },
        { label: "Precio de adjudicación", value: "US$ 720,000" },
        { label: "Plazo estimado de liquidación", value: "12 meses" },
      ],
      costs: [
        { label: "Comisión Rematto", amount: 3600 },
        { label: "Gastos notariales y registrales", amount: 7200 },
      ],
      grossRoi: 21,
      netRoi: 18,
    },
    premiumCriteria: [
      "Ventana Premium ya finalizada — ahora en participación colectiva",
    ],
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
