/**
 * Remata — Platform knowledge base for the AI chatbot.
 * This file centralizes all factual context about the platform so it can be
 * injected into the system prompt. Update this file when product copy changes.
 */

import { dashboardProperties } from "@/lib/dashboard/mock-data";

export const HUMAN_SUPPORT_CONTACTS = [
  {
    label: "Asesor comercial",
    phone: "+51928934484",
    display: "+51 928 934 484",
    whatsappUrl: "https://wa.me/51928934484",
  },
  {
    label: "Soporte inversiones",
    phone: "+51996029022",
    display: "+51 996 029 022",
    whatsappUrl: "https://wa.me/51996029022",
  },
  {
    label: "Atención legal",
    phone: "+51967756176",
    display: "+51 967 756 176",
    whatsappUrl: "https://wa.me/51967756176",
  },
] as const;

export const SUGGESTED_QUESTIONS = [
  "¿Qué es Remata y cómo funciona?",
  "¿Es legítimo y está regulado?",
  "¿Cuál es la inversión mínima?",
  "¿Qué retornos puedo esperar?",
  "¿Cómo invierto en una propiedad?",
  "¿Qué documentos necesito para registrarme?",
] as const;

const propertySummaries = dashboardProperties.slice(0, 6).map((p) => ({
  name: p.name,
  type: p.type,
  district: p.district,
  region: p.region,
  price: p.price,
  currency: p.currency,
  minInvestment: p.minInvestment,
  roi: p.roi,
  status: p.status,
  deadline: p.deadline,
  description: p.description,
}));

export const platformContext = {
  brand: {
    name: "Remata",
    legalName: "Remata S.A.C.",
    tagline: "El mercado de propiedades en remate más transparente del Perú",
    country: "Perú",
    city: "Lima",
    language: "Español (Perú)",
    websitePurpose:
      "Plataforma fintech peruana de inversión fraccionada en remates judiciales inmobiliarios.",
  },

  whatIsRemata: {
    summary:
      "Remata es una plataforma digital que permite a personas naturales invertir en participaciones de inmuebles adjudicados o en proceso de remate judicial en Perú, sin necesidad de comprar una propiedad completa.",
    businessModel:
      "Remata democratiza el acceso a remates judiciales inmobiliarios mediante inversión fraccionada (crowdfunding inmobiliario regulado). Los usuarios registran una cuenta, completan verificación KYC, eligen propiedades auditadas y aportan capital en soles (PEN) o dólares (USD). Al adjudicarse la propiedad en el proceso judicial, los inversores reciben retornos proporcionales a su participación.",
    targetUsers:
      "Inversores retail en Perú que buscan diversificar con activos inmobiliarios, retornos superiores a instrumentos tradicionales y ciclos de inversión de mediano plazo.",
    differentiators: [
      "Transparencia total: expedientes judiciales, tasaciones y estado del proceso disponibles.",
      "Inversión desde S/ 500 — accesible sin comprar un inmueble entero.",
      "Propiedades verificadas legalmente por abogados especializados en remates.",
      "Tecnología fintech con encriptación bancaria y trazabilidad de cada operación.",
      "Soporte especializado legal y financiero.",
    ],
  },

  legitimacyAndRegulation: {
    isLegit:
      "Sí. Remata opera como plataforma de inversión inmobiliaria alineada con el marco legal peruano para remates judiciales y estándares del ecosistema financiero nacional. Cada propiedad listada pasa por auditoría documental y revisión legal antes de publicarse.",
    regulatoryEntities: [
      { name: "Poder Judicial (PJ)", role: "Origen y marco de las subastas judiciales" },
      { name: "SUNARP", role: "Registro de propiedades y titularidad" },
      { name: "SBS", role: "Supervisión y estándares del sector financiero" },
      { name: "SUNAT", role: "Cumplimiento tributario y comprobantes electrónicos" },
      { name: "INDECOPI", role: "Protección al consumidor" },
      { name: "Colegio Notarial (CNL)", role: "Escrituras y legalización" },
      { name: "UIF-Perú", role: "Prevención de lavado de activos y financiamiento del terrorismo (PLAFT)" },
    ],
    legalFramework: [
      "Código Civil peruano",
      "Ley de Ejecución de Garantías",
      "Normativa vigente de remates judiciales",
      "Estándares KYC/PLAFT conforme a UIF-Perú",
    ],
    securityMeasures: [
      "Encriptación AES-256 para datos sensibles",
      "Comunicaciones TLS en tránsito",
      "Verificación de identidad (KYC) obligatoria",
      "Trazabilidad completa de cada inversión",
      "Contratos con validez legal en Perú",
    ],
    guarantees: [
      "Contratos con validez legal en Perú",
      "Trazabilidad de cada inversión",
      "Reportes fiscales descargables",
      "Auditoría documental en tiempo real",
      "Red legal certificada con estudios jurídicos inmobiliarios",
    ],
    riskDisclaimer:
      "Las inversiones en remates judiciales conllevan riesgos, incluyendo demoras en el proceso judicial, variación del precio de adjudicación y liquidez limitada hasta la resolución del remate. Remata informa transparentemente sobre cada propiedad, pero no garantiza retornos fijos.",
  },

  investments: {
    minimumInvestment: "S/ 500 (puede variar por propiedad; algunas requieren S/ 1,000 o S/ 2,000)",
    currencies: ["PEN (soles)", "USD (dólares)"],
    expectedReturns: "Retornos estimados de 18% a 22% anual según la propiedad (no garantizados)",
    averageReturn: "22% anual promedio (dato de marketing de la plataforma)",
    investmentCycles: "La mayoría de procesos judiciales se resuelven en 3 a 8 meses",
    fees: [
      "Sin comisiones de apertura de cuenta",
      "Registro gratuito",
      "Consultar tarifas específicas por operación en la plataforma",
    ],
    paymentMethods: [
      "Transferencia bancaria",
      "Tarjeta de débito/crédito",
      "Yape",
      "Plin",
    ],
    howReturnsWork:
      "Una vez adjudicada la propiedad en el proceso judicial, Remata distribuye el retorno proporcional a cada inversor según su participación en la subasta, descontando costos legales y operativos aplicables. Los fondos se acreditan en la cuenta Remata del inversor.",
    fractionalInvestment:
      "No necesitas comprar el inmueble completo. Compras una participación (porcentaje) del monto total de la subasta. Puedes diversificar invirtiendo en múltiples propiedades simultáneamente.",
  },

  howItWorks: {
    steps: [
      {
        step: 1,
        title: "Crea tu cuenta y verifica tu identidad",
        description:
          "Regístrate en minutos con tu correo. Sube tu DNI y completa la verificación KYC para acceder a todas las subastas. Los documentos se cifran con AES-256.",
      },
      {
        step: 2,
        title: "Explora propiedades verificadas",
        description:
          "Navega el catálogo de inmuebles en remate judicial. Cada propiedad incluye expediente, tasación, ROI estimado, precio base y plazo de cierre.",
      },
      {
        step: 3,
        title: "Invierte desde S/ 500",
        description:
          "Elige el monto, paga por transferencia, tarjeta, Yape o Plin. Tu participación queda registrada en la subasta.",
      },
      {
        step: 4,
        title: "Recibe tus retornos",
        description:
          "Al adjudicarse la propiedad, recibes tu retorno proporcional en tu cuenta Remata.",
      },
    ],
    estimatedTime: "Menos de 10 minutos desde el registro hasta la primera inversión",
  },

  registrationAndKyc: {
    registration: "Gratuito en remata.pe — no requiere tarjeta de crédito para registrarse",
    requiredDocuments: [
      "DNI (documento nacional de identidad) vigente",
      "Selfie de verificación",
      "Datos personales básicos (nombre, correo, teléfono)",
    ],
    kycProcess:
      "Proceso de Conoce a tu Cliente (KYC) obligatorio antes de invertir. Verificación de identidad conforme a estándares UIF-Perú y PLAFT. Los documentos se eliminan automáticamente tras la verificación según política de privacidad.",
    accountTypes: "Cuenta de inversor (dashboard en /dashboard) y acceso administrativo separado",
  },

  properties: {
    description:
      "Catálogo de inmuebles en remate judicial en Lima y zonas metropolitanas. Tipos: departamentos, casas, penthouses, oficinas. Cada listado incluye precio base, ROI estimado, plazo, distrito, área, estado y documentación legal.",
    featuredListings: propertySummaries,
    propertyStatuses: ["Activo", "Próximo", "Cerrado", "Adjudicado"],
    documentationPerProperty: [
      "Número de expediente judicial",
      "Juzgado y distrito judicial",
      "Tasación comercial",
      "Estado del proceso legal",
      "Galería fotográfica del inmueble",
    ],
  },

  platformStats: {
    activeAuctions: "12+ subastas activas (dato de marketing)",
    totalAuctioned: "S/ 48M+ en propiedades subastadas",
    activeInvestors: "3,200+ inversores activos",
    successRate: "94% de éxito en procesos",
    googleRating: "4.9/5 en Google",
  },

  support: {
    chatbotScope:
      "Este asistente responde exclusivamente preguntas sobre Remata: la plataforma, inversiones, regulación, propiedades, registro, KYC, pagos y procesos legales.",
  },

  humanSupport: HUMAN_SUPPORT_CONTACTS,

  navigation: {
    register: "/register",
    login: "/login",
    howItWorks: "#como-funciona",
    properties: "#propiedades",
    trust: "#confianza",
    dashboard: "/dashboard",
  },
} as const;

/**
 * Serializes the platform context into a compact text block for the LLM system prompt.
 */
export function buildPlatformContextPrompt(): string {
  const ctx = platformContext;

  const propertyBlock = ctx.properties.featuredListings
    .map(
      (p) =>
        `- ${p.name} (${p.type}, ${p.district}): precio base ${p.currency === "USD" ? "$" : "S/"}${p.price.toLocaleString()}, ROI ~${p.roi}%, mín. S/ ${p.minInvestment}, estado: ${p.status}, cierra en ${p.deadline}. ${p.description}`
    )
    .join("\n");

  const humanSupportBlock = ctx.humanSupport
    .map((c) => `- ${c.label}: ${c.display} (WhatsApp: ${c.whatsappUrl})`)
    .join("\n");

  return `
# REMATA — Base de conocimiento oficial

## Identidad
- Marca: ${ctx.brand.name} (${ctx.brand.legalName})
- País: ${ctx.brand.country}, sede en ${ctx.brand.city}
- Propósito: ${ctx.brand.websitePurpose}
- Eslogan: "${ctx.brand.tagline}"

## ¿Qué es Remata?
${ctx.whatIsRemata.summary}

Modelo de negocio: ${ctx.whatIsRemata.businessModel}

Diferenciadores:
${ctx.whatIsRemata.differentiators.map((d) => `- ${d}`).join("\n")}

## Legitimidad y regulación
${ctx.legitimacyAndRegulation.isLegit}

Entidades regulatorias e institucionales:
${ctx.legitimacyAndRegulation.regulatoryEntities.map((e) => `- ${e.name}: ${e.role}`).join("\n")}

Marco legal: ${ctx.legitimacyAndRegulation.legalFramework.join("; ")}

Medidas de seguridad:
${ctx.legitimacyAndRegulation.securityMeasures.map((s) => `- ${s}`).join("\n")}

Garantías:
${ctx.legitimacyAndRegulation.guarantees.map((g) => `- ${g}`).join("\n")}

Aviso de riesgo: ${ctx.legitimacyAndRegulation.riskDisclaimer}

## Inversiones
- Inversión mínima: ${ctx.investments.minimumInvestment}
- Monedas: ${ctx.investments.currencies.join(", ")}
- Retornos esperados: ${ctx.investments.expectedReturns}
- Ciclo típico: ${ctx.investments.investmentCycles}
- Métodos de pago: ${ctx.investments.paymentMethods.join(", ")}
- Cómo funcionan los retornos: ${ctx.investments.howReturnsWork}
- Inversión fraccionada: ${ctx.investments.fractionalInvestment}
- Comisiones: ${ctx.investments.fees.join("; ")}

## Cómo funciona (pasos)
${ctx.howItWorks.steps.map((s) => `${s.step}. ${s.title}: ${s.description}`).join("\n")}
Tiempo estimado: ${ctx.howItWorks.estimatedTime}

## Registro y KYC
- Registro: ${ctx.registrationAndKyc.registration}
- Documentos: ${ctx.registrationAndKyc.requiredDocuments.join(", ")}
- KYC: ${ctx.registrationAndKyc.kycProcess}

## Propiedades disponibles (muestra del catálogo)
${propertyBlock}

Documentación por propiedad: ${ctx.properties.documentationPerProperty.join(", ")}

## Estadísticas de la plataforma
- Subastas activas: ${ctx.platformStats.activeAuctions}
- Volumen subastado: ${ctx.platformStats.totalAuctioned}
- Inversores: ${ctx.platformStats.activeInvestors}
- Tasa de éxito: ${ctx.platformStats.successRate}
- Calificación Google: ${ctx.platformStats.googleRating}

## Soporte humano (WhatsApp)
Si el usuario necesita atención humana, comparte estos contactos:
${humanSupportBlock}

## Enlaces útiles
- Registro: ${ctx.navigation.register}
- Iniciar sesión: ${ctx.navigation.login}
- Cómo funciona: ${ctx.navigation.howItWorks}
- Propiedades: ${ctx.navigation.properties}
`.trim();
}
