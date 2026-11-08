import { expect, type Page, type TestInfo } from "@playwright/test";

export const USERS = {
  premium: {
    id: "premium-demo",
    name: "Valentina Ríos",
    email: "premium@rematto.com",
    tier: "premium",
    initials: "VR",
    verified: true,
    totalInvested: 1240000,
    premiumInvestments: 2,
  },
  standard: {
    id: "standard-demo",
    name: "Carlos Mendoza",
    email: "standard@rematto.com",
    tier: "standard",
    initials: "CM",
    verified: true,
    totalInvested: 185000,
    premiumInvestments: 0,
  },
} as const;

/** 1×1 px GIF: las fotos remotas no deben decidir si una prueba pasa. */
const PIXEL = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

/**
 * Sesión de demo + errores de consola como fallo. Se registra antes de la
 * primera navegación; la sesión vive solo en el localStorage del contexto.
 */
export async function setup(page: Page, who: keyof typeof USERS | null, opts: { admin?: boolean } = {}) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    // Recursos externos bloqueados en CI (mapas, fuentes) no son fallos de la app.
    if (/Failed to load resource|ERR_|net::/.test(text)) return;
    errors.push(`console: ${text}`);
  });
  await page.route(/images\.unsplash\.com|maps\.googleapis/, (r) =>
    r.fulfill({ status: 200, contentType: "image/gif", body: PIXEL })
  );
  await page.addInitScript(
    ({ user, admin }) => {
      if (sessionStorage.getItem("__e2e_seeded")) return;
      sessionStorage.setItem("__e2e_seeded", "1");
      if (user) {
        localStorage.setItem("rematto-demo-user-v1", JSON.stringify(user));
        localStorage.setItem("rematto-session-login-at-v1", String(Date.now()));
      }
      if (admin) {
        localStorage.setItem(
          "rematto-admin-session-v1",
          JSON.stringify({ accountId: "acc-superadmin", email: "superadmin@rematto.com", loggedInAt: new Date().toISOString() })
        );
      }
    },
    { user: who ? USERS[who] : null, admin: !!opts.admin }
  );
  return {
    /** Falla si hubo errores de React/hidratación o excepciones. */
    expectNoErrors: () => expect(errors, errors.join("\n")).toEqual([]),
  };
}

export function isMobile(testInfo: TestInfo) {
  return testInfo.project.name === "mobile";
}

/** Ningún contenido debe desbordar horizontalmente la página. */
export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, "la página desborda horizontalmente").toBeLessThanOrEqual(1);
}

/** Botón "Continuar" del asistente (barra fija en móvil, botón inline en escritorio). */
export function wizardNext(page: Page) {
  return page.locator('[data-testid^="wizard-next"]').filter({ visible: true }).first();
}

export function visible(page: Page, testId: string) {
  return page.getByTestId(testId).filter({ visible: true }).first();
}
