const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validación propia además de la nativa del navegador (WP-1.4, cierra L-038). */
export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export const INVALID_EMAIL_MESSAGE = "Ingresa un correo electrónico válido.";
