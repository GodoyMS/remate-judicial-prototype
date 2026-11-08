import type { PremiumProperty, DashboardUser } from "./types";
import { getCreatedPremiumProperties } from "@/lib/app-store";
import { adminPropertyToPremiumProperty } from "./convert";
import { limaDateFromToday } from "./dates";

export { getPremiumPropertyOverride } from "@/lib/app-store";

const PREMIUM_USER_ID = "premium-demo";

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
    description: "Penthouse de 240 m² con terraza de 80 m² y vista al Pacífico, en remate judicial con fecha confirmada. Durante la ventana Premium, un solo inversionista puede solicitar reservar el 100% del capital requerido.",
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
    premiumDeadline: limaDateFromToday(2, 18),
    premiumDeadlineDays: 0,
    status: "available",
    notifyPremiumUsers: true,
    createdAt: limaDateFromToday(-5, 9),
    judicial: {
      expediente: "00721-2025-0-1801-JR-CI-04",
      juzgado: "4° Juzgado Civil de Lima",
      etapa: "Subasta convocada",
      lastReviewedAt: limaDateFromToday(-4, 9),
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: limaDateFromToday(-4, 9),
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
        { label: "Comisión Rematto (referencial)", amount: 4450 },
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
    description: "Villa frente al mar con piscina y 5 suites, adjudicada y en etapa de formalización. Requiere un único inversionista para el 100% del capital.",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1605276374101-de4c0a5e9622?w=1200&h=800&fit=crop",
    ],
    currency: "USD",
    totalValue: 1450000,
    premiumRoi: 52,
    standardRoi: 24,
    premiumDeadline: limaDateFromToday(4, 18),
    premiumDeadlineDays: 0,
    status: "available",
    notifyPremiumUsers: true,
    createdAt: limaDateFromToday(-3, 9),
    judicial: {
      expediente: "01893-2025-0-1801-JR-CI-06",
      juzgado: "6° Juzgado Civil de Lima",
      etapa: "Adjudicada, en formalización",
      lastReviewedAt: limaDateFromToday(-4, 9),
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: limaDateFromToday(-4, 9),
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
        { label: "Comisión Rematto (referencial)", amount: 7250 },
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
    description: "Loft de doble altura en zona bohemia, con expediente adjudicado y en formalización.",
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
    ],
    currency: "PEN",
    totalValue: 520000,
    premiumRoi: 45,
    standardRoi: 20,
    premiumDeadline: limaDateFromToday(-49, 18),
    premiumDeadlineDays: 0,
    status: "available",
    notifyPremiumUsers: true,
    createdAt: limaDateFromToday(-55, 9),
    judicial: {
      expediente: "00347-2025-0-1801-JR-CI-08",
      juzgado: "8° Juzgado Civil de Lima",
      etapa: "Adjudicada, en formalización",
      lastReviewedAt: limaDateFromToday(-4, 9),
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: limaDateFromToday(-4, 9),
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
        { label: "Comisión Rematto (referencial)", amount: 2600 },
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
    description: "Departamento en piso alto con vista a la ciudad, en remate judicial con fecha confirmada. Ventana Premium abierta para financiamiento individual del 100%.",
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop",
    ],
    currency: "PEN",
    totalValue: 380000,
    premiumRoi: 42,
    standardRoi: 19,
    premiumDeadline: limaDateFromToday(6, 18),
    premiumDeadlineDays: 0,
    status: "available",
    notifyPremiumUsers: true,
    createdAt: limaDateFromToday(-1, 9),
    judicial: {
      expediente: "01204-2025-0-1801-JR-CI-11",
      juzgado: "11° Juzgado Civil de Lima",
      etapa: "Subasta convocada",
      lastReviewedAt: limaDateFromToday(-4, 9),
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: limaDateFromToday(-4, 9),
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
        { label: "Comisión Rematto (referencial)", amount: 1900 },
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
    description: "Casa de playa con acceso directo al mar. La ventana Premium finalizó y la oportunidad pasó a participación colectiva desde S/ 500.",
    img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=800&fit=crop",
    ],
    currency: "USD",
    totalValue: 720000,
    premiumRoi: 46,
    standardRoi: 21,
    premiumDeadline: limaDateFromToday(-9, 18),
    premiumDeadlineDays: 0,
    status: "converted",
    notifyPremiumUsers: false,
    createdAt: limaDateFromToday(-20, 9),
    judicial: {
      expediente: "00889-2024-0-1801-JR-CI-02",
      juzgado: "2° Juzgado Civil de Lima",
      etapa: "En comercialización",
      lastReviewedAt: limaDateFromToday(-4, 9),
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: limaDateFromToday(-4, 9),
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
        { label: "Comisión Rematto (referencial)", amount: 3600 },
        { label: "Gastos notariales y registrales", amount: 7200 },
      ],
      grossRoi: 21,
      netRoi: 18,
    },
    premiumCriteria: [
      "Ventana Premium ya finalizada — ahora en participación colectiva",
    ],
  },
  {
    id: "pp-106",
    name: "Oficina Corporativa — San Isidro",
    address: "Av. Rivera Navarrete 765, piso 12, San Isidro",
    type: "Oficina",
    area: "310 m²",
    district: "San Isidro",
    region: "Lima",
    description:
      "Planta de oficinas de 310 m² con 6 estacionamientos en el centro financiero, en remate judicial con fecha confirmada.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop",
    ],
    currency: "USD",
    totalValue: 640000,
    premiumRoi: 38,
    standardRoi: 18,
    premiumDeadline: limaDateFromToday(-3, 18),
    premiumDeadlineDays: 0,
    status: "available",
    notifyPremiumUsers: true,
    createdAt: limaDateFromToday(-8, 9),
    judicial: {
      expediente: "01188-2025-0-1801-JR-CI-09",
      juzgado: "9° Juzgado Civil de Lima",
      etapa: "Subasta convocada",
      lastReviewedAt: limaDateFromToday(-4, 9),
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: limaDateFromToday(-4, 9),
      scope: [
        "Partida registral y titularidad libre de cargas adicionales",
        "Estado del expediente en el Poder Judicial",
        "Tasación pericial vigente",
        "Deudas de mantenimiento y arbitrios",
      ],
      documents: [
        { label: "Partida registral (SUNARP)", url: "#" },
        { label: "Informe de tasación", url: "#" },
      ],
    },
    roiBasis: {
      assumptions: [
        { label: "Tasación pericial", value: "US$ 720,000" },
        { label: "Precio de salida en remate", value: "US$ 640,000" },
        { label: "Plazo estimado de liquidación", value: "11 meses" },
      ],
      costs: [
        { label: "Comisión Rematto (referencial)", amount: 3200 },
        { label: "Gastos notariales y registrales", amount: 6400 },
        { label: "Impuestos de transferencia", amount: 12800 },
      ],
      grossRoi: 38,
      netRoi: 33,
    },
    premiumCriteria: [
      "Capital requerido superior a US$ 500,000",
      "Activo corporativo con demanda de alquiler comprobada en la zona",
      "Expediente en etapa de subasta con fecha de remate confirmada",
    ],
  },
];


/**
 * Oportunidades Premium ya cerradas. No aparecen en el listado, pero el
 * seguimiento de una operación liquidada necesita resolver su ficha.
 */
export const archivedPremiumProperties: PremiumProperty[] = [
  {
    id: "pp-107",
    name: "Casa de Campo — Cieneguilla",
    address: "Av. Nueva Toledo 1240, Cieneguilla",
    type: "Casa",
    area: "1,200 m²",
    district: "Cieneguilla",
    region: "Lima",
    description: "Casa de campo con terreno de 1,200 m². Operación Premium liquidada.",
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop"],
    currency: "PEN",
    totalValue: 410000,
    premiumRoi: 18,
    standardRoi: 12,
    premiumDeadline: limaDateFromToday(-421, 18),
    premiumDeadlineDays: 0,
    status: "converted",
    notifyPremiumUsers: false,
    createdAt: limaDateFromToday(-430, 9),
    judicial: {
      expediente: "00412-2024-0-1801-JR-CI-03",
      juzgado: "3° Juzgado Civil de Lima",
      etapa: "Concluido",
      lastReviewedAt: limaDateFromToday(-28, 9),
    },
    verification: { verifiedAt: limaDateFromToday(-425, 9), scope: [], documents: [] },
    roiBasis: { assumptions: [], costs: [], grossRoi: 18, netRoi: 15 },
    premiumCriteria: [],
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
  return (
    getAllPremiumProperties().find((p) => p.id === id) ??
    archivedPremiumProperties.find((p) => p.id === id)
  );
}
