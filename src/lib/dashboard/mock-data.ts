import type {
  DashboardProperty,
  UserInvestment,
  ProcessStage,
  ProcessMilestone,
} from "./types";
import { PROCESS_STAGE_ORDER } from "./types";

function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Genera el timeline hasta la etapa actual; el resto queda como "esperado". */
function buildTimeline(
  currentStage: ProcessStage,
  startDate: string,
  extendedFinal?: boolean
): ProcessMilestone[] {
  const idx = PROCESS_STAGE_ORDER.indexOf(currentStage);
  return PROCESS_STAGE_ORDER.map((stage, i) => {
    if (i < idx) {
      return { stage, reachedAt: addDays(startDate, i * 45), expectedAt: null };
    }
    if (i === idx) {
      return {
        stage,
        reachedAt: addDays(startDate, i * 45),
        expectedAt: null,
        note: extendedFinal ? "Plazo extendido respecto a la estimación inicial." : undefined,
      };
    }
    return { stage, reachedAt: null, expectedAt: addDays(startDate, i * 45) };
  });
}

export const dashboardProperties: DashboardProperty[] = [
  {
    id: 1,
    name: "Departamento en San Isidro",
    address: "Av. Javier Prado Este 1240, San Isidro",
    type: "Departamento",
    area: "112 m²",
    price: 285000,
    minInvestment: 500,
    roi: 22,
    deadline: "8 días",
    deadlineDays: 8,
    status: "Activo",
    district: "San Isidro",
    region: "Lima",
    description:
      "Moderno departamento de 3 dormitorios con vista al parque en zona prime de San Isidro. Ideal para inversión en remate judicial con proceso legal expedito y alta demanda en el mercado.",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
    ],
    badge: "23 inversionistas · 70% financiado",
    badgeStyle: "bg-warning/10 text-warning",
    investors: 23,
    raisedAmount: 198500,
    totalInvestment: 285000,
    currency: "PEN",
    liveInvestments: [
      { id: "l1", obfuscatedName: "M*** V.", amount: 5000, timeAgo: "hace 2 min" },
      { id: "l2", obfuscatedName: "C*** M.", amount: 2500, timeAgo: "hace 8 min" },
      { id: "l3", obfuscatedName: "A*** T.", amount: 3500, timeAgo: "hace 15 min" },
      { id: "l4", obfuscatedName: "L*** F.", amount: 1000, timeAgo: "hace 22 min" },
      { id: "l5", obfuscatedName: "D*** R.", amount: 7500, timeAgo: "hace 35 min" },
    ],
    judicial: {
      expediente: "01847-2025-0-1801-JR-CI-07",
      juzgado: "7° Juzgado Civil de Lima",
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
        { label: "Informe de tasación", url: "#" },
      ],
    },
    roiBasis: {
      assumptions: [
        { label: "Tasación pericial", value: "S/ 320,000" },
        { label: "Precio de salida en remate", value: "S/ 285,000" },
        { label: "Plazo estimado de liquidación", value: "12 meses" },
      ],
      costs: [
        { label: "Comisión Rematto", amount: 8550 },
        { label: "Gastos notariales y registrales", amount: 4200 },
      ],
      grossRoi: 22,
      netRoi: 19,
    },
  },
  {
    id: 2,
    name: "Casa en La Molina",
    address: "Jr. Las Casuarinas 350, La Molina",
    type: "Casa",
    area: "280 m²",
    price: 520000,
    minInvestment: 1000,
    roi: 18,
    deadline: "15 días",
    deadlineDays: 15,
    status: "Activo",
    district: "La Molina",
    region: "Lima",
    description:
      "Amplia casa con jardín y piscina en exclusivo condominio cerrado. Excelente plusvalía en zona residencial consolidada con acceso a colegios y centros comerciales.",
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
    ],
    badge: "Etapa: formalización",
    badgeStyle: "bg-info/10 text-info",
    investors: 14,
    raisedAmount: 312000,
    totalInvestment: 520000,
    currency: "PEN",
    liveInvestments: [
      { id: "l6", obfuscatedName: "M*** V.", amount: 15000, timeAgo: "hace 5 min" },
      { id: "l7", obfuscatedName: "R*** S.", amount: 3000, timeAgo: "hace 18 min" },
    ],
    judicial: {
      expediente: "02391-2024-0-1801-JR-CI-12",
      juzgado: "12° Juzgado Civil de Lima",
      etapa: "Actos notariales y registrales",
      lastReviewedAt: "2026-05-28",
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: "2026-05-28",
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
        { label: "Tasación pericial", value: "S/ 560,000" },
        { label: "Precio de adjudicación", value: "S/ 520,000" },
        { label: "Plazo estimado de liquidación", value: "14 meses" },
      ],
      costs: [
        { label: "Comisión Rematto", amount: 15600 },
        { label: "Gastos notariales y registrales", amount: 7800 },
      ],
      grossRoi: 18,
      netRoi: 15,
    },
  },
  {
    id: 3,
    name: "Penthouse en Miraflores",
    address: "Calle Berlín 847, Miraflores",
    type: "Penthouse",
    area: "195 m²",
    price: 280000,
    minInvestment: 500,
    roi: 22,
    deadline: "6 días",
    deadlineDays: 6,
    status: "Activo",
    district: "Miraflores",
    region: "Lima",
    description:
      "Penthouse de lujo con terraza panorámica y acabados premium. Propiedad exclusiva con alto potencial de retorno en el corazón de Miraflores.",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
    ],
    badge: "18 inversionistas · 67% financiado",
    badgeStyle: "bg-premium/10 text-premium",
    investors: 18,
    raisedAmount: 187600,
    totalInvestment: 280000,
    currency: "PEN",
    liveInvestments: [
      { id: "l8", obfuscatedName: "J*** P.", amount: 2000, timeAgo: "hace 1 h" },
    ],
    judicial: {
      expediente: "00512-2025-0-1801-JR-CI-03",
      juzgado: "3° Juzgado Civil de Lima",
      etapa: "Subasta convocada",
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
        { label: "Resolución de convocatoria a remate", url: "#" },
      ],
    },
    roiBasis: {
      assumptions: [
        { label: "Tasación pericial", value: "S/ 315,000" },
        { label: "Precio de salida en remate", value: "S/ 280,000" },
        { label: "Plazo estimado de liquidación", value: "12 meses" },
      ],
      costs: [
        { label: "Comisión Rematto", amount: 8400 },
        { label: "Gastos notariales y registrales", amount: 4100 },
      ],
      grossRoi: 22,
      netRoi: 19,
    },
  },
  {
    id: 4,
    name: "Oficina en San Borja",
    address: "Av. Angamos Oeste 600, San Borja",
    type: "Oficina",
    area: "85 m²",
    price: 190000,
    minInvestment: 500,
    roi: 18,
    deadline: "30 días",
    deadlineDays: 30,
    status: "Activo",
    district: "San Borja",
    region: "Lima",
    description:
      "Oficina corporativa en edificio AAA con estacionamiento incluido. Ideal para inversores que buscan activos comerciales con flujo estable.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=800&fit=crop",
    ],
    badge: "Comercial",
    badgeStyle: "bg-muted text-muted-foreground",
    investors: 19,
    raisedAmount: 171000,
    totalInvestment: 190000,
    currency: "USD",
    liveInvestments: [
      { id: "l9", obfuscatedName: "D*** R.", amount: 3000, timeAgo: "hace 12 min" },
      { id: "l10", obfuscatedName: "P*** G.", amount: 1500, timeAgo: "hace 45 min" },
    ],
    judicial: {
      expediente: "01120-2024-0-1801-JR-CI-09",
      juzgado: "9° Juzgado Civil de Lima",
      etapa: "En comercialización",
      lastReviewedAt: "2026-05-20",
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: "2026-05-20",
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
        { label: "Tasación pericial", value: "US$ 205,000" },
        { label: "Precio de adjudicación", value: "US$ 190,000" },
        { label: "Plazo estimado de liquidación", value: "16 meses" },
      ],
      costs: [
        { label: "Comisión Rematto", amount: 5700 },
        { label: "Gastos notariales y registrales", amount: 2800 },
      ],
      grossRoi: 18,
      netRoi: 15,
    },
  },
  {
    id: 5,
    name: "Departamento en Barranco",
    address: "Jr. Unión 245, Barranco",
    type: "Departamento",
    area: "78 m²",
    price: 165000,
    minInvestment: 500,
    roi: 24,
    deadline: "5 días",
    deadlineDays: 5,
    status: "Activo",
    district: "Barranco",
    region: "Lima",
    description:
      "Bohemio departamento cerca del malecón con alto potencial de plusvalía. Una de las mejores oportunidades de ROI en la plataforma.",
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
    ],
    badge: "Cierra en 5 días",
    badgeStyle: "bg-warning/10 text-warning",
    investors: 31,
    raisedAmount: 165000,
    totalInvestment: 165000,
    currency: "PEN",
    liveInvestments: [],
    judicial: {
      expediente: "00298-2025-0-1801-JR-CI-05",
      juzgado: "5° Juzgado Civil de Lima",
      etapa: "Subasta convocada",
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
        { label: "Resolución de convocatoria a remate", url: "#" },
      ],
    },
    roiBasis: {
      assumptions: [
        { label: "Tasación pericial", value: "S/ 188,000" },
        { label: "Precio de salida en remate", value: "S/ 165,000" },
        { label: "Plazo estimado de liquidación", value: "10 meses" },
      ],
      costs: [
        { label: "Comisión Rematto", amount: 4950 },
        { label: "Gastos notariales y registrales", amount: 2400 },
      ],
      grossRoi: 24,
      netRoi: 20,
    },
  },
  {
    id: 6,
    name: "Casa en Surco",
    address: "Calle Las Flores 180, Santiago de Surco",
    type: "Casa",
    area: "220 m²",
    price: 410000,
    minInvestment: 1000,
    roi: 19,
    deadline: "18 días",
    deadlineDays: 18,
    status: "Próximo",
    district: "Surco",
    region: "Lima",
    description:
      "Residencia familiar en zona residencial consolidada. Próxima apertura con lista de espera activa.",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
    ],
    badge: "Próximo",
    badgeStyle: "bg-success/10 text-success",
    investors: 6,
    raisedAmount: 45000,
    totalInvestment: 410000,
    currency: "PEN",
    liveInvestments: [
      { id: "l11", obfuscatedName: "S*** L.", amount: 1000, timeAgo: "hace 3 h" },
    ],
    judicial: {
      expediente: "01765-2025-0-1801-JR-CI-14",
      juzgado: "14° Juzgado Civil de Lima",
      etapa: "Pendiente de convocatoria",
      lastReviewedAt: "2026-05-30",
      sourceUrl: "https://cej.pj.gob.pe/",
    },
    verification: {
      verifiedAt: "2026-05-30",
      scope: [
        "Partida registral y titularidad libre de cargas adicionales",
        "Estado del expediente en el Poder Judicial",
        "Tasación pericial vigente",
      ],
      documents: [{ label: "Partida registral (SUNARP)", url: "#" }],
    },
    roiBasis: {
      assumptions: [
        { label: "Tasación pericial", value: "S/ 445,000" },
        { label: "Precio de salida estimado", value: "S/ 410,000" },
        { label: "Plazo estimado de liquidación", value: "14 meses" },
      ],
      costs: [
        { label: "Comisión Rematto", amount: 12300 },
        { label: "Gastos notariales y registrales", amount: 6100 },
      ],
      grossRoi: 19,
      netRoi: 16,
    },
  },
];

export const userInvestments: UserInvestment[] = [
  {
    id: "inv-001",
    certificateId: "REM-2026-001847",
    propertyId: 1,
    amount: 3500,
    currency: "PEN",
    roi: 22,
    datePaid: "2026-04-10",
    expectedRoiDate: "2027-04-10",
    daysUntilRoi: 323,
    status: "active",
    paymentMethod: "Tarjeta débito / crédito",
    outcome: { kind: "estimated", roi: 22 },
    stage: "subasta",
    timeline: buildTimeline("subasta", "2026-04-10"),
  },
  {
    id: "inv-002",
    certificateId: "REM-2026-001923",
    propertyId: 2,
    amount: 5000,
    currency: "PEN",
    roi: 18,
    datePaid: "2026-03-22",
    expectedRoiDate: "2027-03-22",
    daysUntilRoi: 304,
    status: "active",
    paymentMethod: "Transferencia bancaria",
    outcome: { kind: "revised", roi: 16, previousRoi: 18, revisedAt: "2026-05-15" },
    stage: "formalizacion",
    timeline: buildTimeline("formalizacion", "2026-03-22"),
  },
  {
    id: "inv-003",
    certificateId: "REM-2026-002104",
    propertyId: 5,
    amount: 2500,
    currency: "PEN",
    roi: 24,
    datePaid: "2026-02-15",
    expectedRoiDate: "2026-08-15",
    daysUntilRoi: 85,
    status: "active",
    paymentMethod: "Tarjeta débito / crédito",
    outcome: { kind: "estimated", roi: 24 },
    stage: "adjudicacion",
    timeline: buildTimeline("adjudicacion", "2026-02-15"),
  },
  {
    id: "inv-004",
    certificateId: "REM-2025-009812",
    propertyId: 4,
    amount: 1500,
    currency: "USD",
    roi: 18,
    datePaid: "2025-11-05",
    expectedRoiDate: "2026-05-05",
    daysUntilRoi: -17,
    status: "active",
    paymentMethod: "Transferencia bancaria",
    outcome: { kind: "extended", newExpectedAt: "2026-09-05" },
    stage: "venta",
    timeline: buildTimeline("venta", "2025-11-05", true),
  },
  {
    id: "inv-005",
    certificateId: "REM-2026-002301",
    propertyId: 3,
    amount: 2000,
    currency: "PEN",
    roi: 22,
    datePaid: "2026-05-18",
    expectedRoiDate: "2027-05-18",
    daysUntilRoi: 361,
    status: "pending",
    paymentMethod: "Transferencia bancaria",
    outcome: { kind: "estimated", roi: 22 },
    stage: "subasta",
    timeline: buildTimeline("subasta", "2026-05-18"),
  },
  {
    id: "inv-006",
    certificateId: "REM-2025-008456",
    propertyId: 1,
    amount: 1000,
    currency: "PEN",
    roi: 22,
    datePaid: "2025-09-20",
    expectedRoiDate: "2026-03-20",
    daysUntilRoi: -63,
    status: "completed",
    paymentMethod: "Tarjeta débito / crédito",
    outcome: { kind: "settled", roi: -3 },
    stage: "liquidacion",
    timeline: buildTimeline("liquidacion", "2025-09-20"),
  },
  {
    id: "inv-007",
    certificateId: "REM-2026-002518",
    propertyId: 4,
    amount: 4200,
    currency: "USD",
    roi: 18,
    datePaid: "2026-05-02",
    expectedRoiDate: "2027-05-02",
    daysUntilRoi: 345,
    status: "active",
    paymentMethod: "Yape / Plin",
    outcome: { kind: "estimated", roi: 18 },
    stage: "subasta",
    timeline: buildTimeline("subasta", "2026-05-02"),
  },
  {
    id: "inv-008",
    certificateId: "REM-2025-007203",
    propertyId: 2,
    amount: 800,
    currency: "PEN",
    roi: 18,
    datePaid: "2025-08-14",
    expectedRoiDate: "2026-02-14",
    daysUntilRoi: -97,
    status: "completed",
    paymentMethod: "Yape / Plin",
    outcome: { kind: "capital_returned" },
    stage: "liquidacion",
    timeline: buildTimeline("liquidacion", "2025-08-14"),
  },
  {
    id: "inv-009",
    certificateId: "REM-2026-002640",
    propertyId: 5,
    amount: 1500,
    currency: "PEN",
    roi: 24,
    datePaid: "2026-05-25",
    expectedRoiDate: "2026-11-25",
    daysUntilRoi: 186,
    status: "pending",
    paymentMethod: "Transferencia bancaria",
    outcome: { kind: "estimated", roi: 24 },
    stage: "subasta",
    timeline: buildTimeline("subasta", "2026-05-25"),
  },
  {
    id: "inv-010",
    certificateId: "REM-2025-006891",
    propertyId: 3,
    amount: 3000,
    currency: "PEN",
    roi: 20,
    datePaid: "2025-07-03",
    expectedRoiDate: "2026-01-03",
    daysUntilRoi: -139,
    status: "completed",
    paymentMethod: "Transferencia bancaria",
    outcome: { kind: "settled", roi: 20 },
    stage: "liquidacion",
    timeline: buildTimeline("liquidacion", "2025-07-03"),
  },
  {
    id: "inv-011",
    certificateId: "REM-2026-001102",
    propertyId: 1,
    amount: 750,
    currency: "PEN",
    roi: 22,
    datePaid: "2026-01-28",
    expectedRoiDate: "2027-01-28",
    daysUntilRoi: 251,
    status: "cancelled",
    paymentMethod: "Tarjeta débito / crédito",
    outcome: { kind: "capital_returned" },
    stage: "subasta",
    timeline: buildTimeline("subasta", "2026-01-28"),
  },
  {
    id: "inv-012",
    certificateId: "REM-2026-002789",
    propertyId: 4,
    amount: 6000,
    currency: "USD",
    roi: 18,
    datePaid: "2026-05-28",
    expectedRoiDate: "2027-05-28",
    daysUntilRoi: 371,
    status: "active",
    paymentMethod: "Transferencia bancaria",
    outcome: { kind: "estimated", roi: 18 },
    stage: "subasta",
    timeline: buildTimeline("subasta", "2026-05-28"),
  },
];

export function getPropertyById(id: number): DashboardProperty | undefined {
  return dashboardProperties.find((p) => p.id === id);
}

export function getInvestmentById(id: string): UserInvestment | undefined {
  return userInvestments.find((i) => i.id === id);
}

export interface ActiveInvestmentView extends UserInvestment {
  property: DashboardProperty;
}

/**
 * Une cada inversión con su propiedad. Es la única fuente de verdad para el
 * dashboard, `my-investments` y el detalle de inversión (WP-0.1): los tres
 * consumen exactamente este selector, así que el nombre, ROI, estado y
 * moneda de un activo no pueden divergir entre pantallas.
 */
export function getActiveInvestmentsForUser(): ActiveInvestmentView[] {
  return userInvestments
    .map((inv) => {
      const property = getPropertyById(inv.propertyId);
      return property ? { ...inv, property } : null;
    })
    .filter((v): v is ActiveInvestmentView => v !== null);
}

export { formatCurrency } from "@/lib/currency";

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
