/**
 * Single source of truth for brand identity and contact channels.
 *
 * Audit finding RM-008: the product shipped two spellings of the brand
 * ("Rematto" in the logotype and page title, "Rematto" in body copy), which
 * reads as a legitimacy problem on a platform that asks for money. Every
 * user-facing string must now read the name from here.
 */

/** Commercial brand name, as drawn in the logotype. */
export const BRAND_NAME = "Rematto";

/** Registered company name used in legal notices and receipts. */
export const BRAND_LEGAL_NAME = "Rematto S.A.C.";

export const BRAND_RUC = "20601234567";

/**
 * Contact channels surfaced before registration (RM-002, RM-025, RM-031).
 * A prospective investor must be able to reach a human without creating an
 * account first.
 */
export const CONTACT = {
  /** Commercial / investor enquiries. */
  salesEmail: "inversiones@rematto.pe",
  /** Post-sale support. */
  supportEmail: "soporte@rematto.pe",
  privacyEmail: "privacidad@rematto.pe",
  /** Digits only — used to build the wa.me deep link. */
  whatsappNumber: "51987654321",
  whatsappDisplay: "+51 987 654 321",
  phone: "+51 1 700 8000",
  phoneHref: "+5117008000",
  address: "Av. Javier Prado Este 476, San Isidro, Lima, Perú",
  hours: "Lunes a viernes, 9:00 a 18:00 h (GMT-5)",
  hoursShort: "Lun–Vie 9:00–18:00",
} as const;

/** Prefilled WhatsApp deep link for the commercial channel. */
export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
  `Hola, quiero información sobre cómo invertir en ${BRAND_NAME}.`
)}`;

export const MAILTO_SALES = `mailto:${CONTACT.salesEmail}`;
export const MAILTO_SUPPORT = `mailto:${CONTACT.supportEmail}`;
