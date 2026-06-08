const TOPIC_KEYWORDS: Record<string, string[]> = {
  Inversiones: [
    "invertir",
    "inversión",
    "inversiones",
    "retorno",
    "roi",
    "ganancia",
    "rentabilidad",
    "monto",
    "soles",
    "dólar",
    "dolar",
  ],
  KYC: [
    "kyc",
    "verific",
    "identidad",
    "dni",
    "documento",
    "selfie",
    "registr",
    "cuenta",
  ],
  Regulación: [
    "legal",
    "regul",
    "sbs",
    "sunarp",
    "legítim",
    "legitim",
    "normativa",
    "ley",
  ],
  Pagos: [
    "pago",
    "transfer",
    "yape",
    "tarjeta",
    "depósito",
    "deposito",
    "voucher",
    "comprobante",
  ],
  Propiedades: [
    "propiedad",
    "departamento",
    "casa",
    "inmueble",
    "miraflores",
    "san isidro",
    "distrito",
    "ubicación",
    "ubicacion",
  ],
  Riesgos: [
    "riesgo",
    "seguro",
    "confianza",
    "estafa",
    "garantía",
    "garantia",
    "pérdida",
    "perdida",
  ],
  Proceso: [
    "proceso",
    "cómo funciona",
    "como funciona",
    "paso",
    "remate",
    "subasta",
    "judicial",
    "plazo",
  ],
  Soporte: [
    "soporte",
    "whatsapp",
    "contacto",
    "ayuda",
    "humano",
    "asesor",
  ],
};

export function inferTopicsFromMessages(
  messages: Array<{ role: string; content: string }>
): string[] {
  const userText = messages
    .filter((m) => m.role === "user" && !m.content.match(/@/))
    .map((m) => m.content.toLowerCase())
    .join(" ");

  if (!userText.trim()) return [];

  const topics: string[] = [];
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((kw) => userText.includes(kw))) {
      topics.push(topic);
    }
  }

  return topics.slice(0, 4);
}

export function getLastUserMessagePreview(
  messages: Array<{ role: string; content: string }>
): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return "Sin mensajes del usuario";
  const plain = lastUser.content.replace(/\*\*/g, "").replace(/\n/g, " ");
  return plain.length > 80 ? `${plain.slice(0, 80)}…` : plain;
}
