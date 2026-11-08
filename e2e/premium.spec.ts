import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, isMobile, setup, visible, wizardNext } from "./helpers";

/* ─────────────────────────────────────────────────────────────────────────
   Experiencia Premium de punta a punta.
   Cada prueba corre en escritorio (1440), tablet (834) y móvil (390).
   ───────────────────────────────────────────────────────────────────────── */

const PREMIUM_ROUTES = [
  "/dashboard",
  "/dashboard/premium-properties",
  "/dashboard/premium-properties/pp-101",
  "/dashboard/premium-invest?property=pp-104",
  "/dashboard/my-investments?tab=premium",
  "/dashboard/my-investments/premium/res-0436",
  "/dashboard/my-investments/premium/res-0412",
  "/dashboard/my-investments/premium/res-0301",
  "/dashboard/notifications",
  "/dashboard/documents",
  "/dashboard/retornos",
  "/dashboard/account?section=premium",
];

test.describe("Calidad base de cada pantalla Premium", () => {
  for (const route of PREMIUM_ROUTES) {
    test(`${route} — sin errores ni desborde horizontal`, async ({ page }) => {
      const { expectNoErrors } = await setup(page, "premium");
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await page.waitForLoadState("networkidle");
      await expectNoHorizontalOverflow(page);
      // Vocabulario prohibido por la auditoría: la reserva no es una "captura"
      // ni se promete una comisión aún no validada por Legal.
      const text = await page.locator("main").innerText();
      expect(text).not.toMatch(/captur/i);
      expect(text).not.toMatch(/0\.5\s?%/);
      expect(text).not.toMatch(/vs\.? est[aá]ndar/i);
      expectNoErrors();
    });
  }
});

test.describe("Listado de oportunidades", () => {
  test("filtros con conteos, estados derivados y un solo CTA por tarjeta", async ({ page }) => {
    const { expectNoErrors } = await setup(page, "premium");
    await page.goto("/dashboard/premium-properties");

    await expect(page.getByRole("tab", { name: /Disponibles\s*2/ })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Mis reservas\s*2/ })).toBeVisible();

    // Otro inversionista tiene una solicitud: "En reserva", sin nombres.
    const villa = page.getByTestId("premium-card-pp-102");
    await expect(villa).toContainText("En reserva");
    await expect(villa).not.toContainText("María");

    await page.getByRole("tab", { name: /Disponibles/ }).click();
    await expect(page).toHaveURL(/filter=available/);
    await expect(page.locator('[data-testid^="premium-card-"]')).toHaveCount(2);
    await expect(page.getByTestId("premium-card-pp-101").getByRole("link", { name: "Ver expediente", exact: true })).toBeVisible();

    await page.getByRole("tab", { name: /Mis reservas/ }).click();
    await expect(page.getByTestId("premium-card-pp-106")).toContainText("Reservada");
    await expect(page.getByTestId("premium-card-pp-106").getByRole("link", { name: /Ver seguimiento/ })).toBeVisible();
    expectNoErrors();
  });

  test("Estándar ve la vista bloqueada y 'Conocer Premium'", async ({ page }) => {
    const { expectNoErrors } = await setup(page, "standard");
    await page.goto("/dashboard/premium-properties");
    await expect(page.getByText("Estas oportunidades requieren acceso Premium")).toBeVisible();
    const card = page.getByTestId("premium-card-pp-101");
    await expect(card.getByRole("link", { name: "Conocer Premium" })).toBeVisible();
    await expect(card).not.toContainText("41%");

    await page.goto("/dashboard/premium-properties/pp-101");
    await expect(visible(page, "reservation-panel")).toContainText("disponibles con acceso Premium");
    await expect(page.getByRole("button", { name: /Escenarios y costos/ })).toHaveAttribute("aria-disabled", "true");

    await page.goto("/dashboard/premium-invest?property=pp-101");
    await expect(page.getByText("Las reservas Premium requieren acceso Premium")).toBeVisible();
    expectNoErrors();
  });
});

test.describe("Ficha de oportunidad", () => {
  test("jerarquía capital → retorno → ventana → acción, con escenario adverso", async ({ page }, testInfo) => {
    const { expectNoErrors } = await setup(page, "premium");
    await page.goto("/dashboard/premium-properties/pp-101");
    const panel = visible(page, "reservation-panel");
    await expect(panel).toContainText("USD 890,000");
    await expect(panel).toContainText("Retorno neto estimado");
    await expect(panel).toContainText("no garantizado");
    await expect(panel).toContainText("hora de Lima");
    await expect(panel.getByRole("link", { name: /Solicitar reserva/ })).toBeVisible();
    await expect(panel).toContainText("no genera ningún cobro");

    await panel.getByRole("button", { name: "Consultar escenarios y riesgos" }).click();
    const scenarios = page.locator("#escenarios");
    await expect(scenarios.getByText("Adverso", { exact: true })).toBeVisible();
    await expect(scenarios.getByText("Esperado", { exact: true })).toBeVisible();
    await expect(scenarios.getByText("Favorable", { exact: true })).toBeVisible();

    if (isMobile(testInfo)) {
      // En móvil las secciones empiezan plegadas y la barra fija aparece al bajar.
      await expect(page.getByRole("button", { name: /Expediente y documentos/ })).toHaveAttribute("aria-expanded", "false");
      await page.mouse.wheel(0, 2500);
      await expect(page.getByRole("link", { name: "Solicitar reserva", exact: true }).last()).toBeInViewport();
    }
    expectNoErrors();
  });

  test("asesora Premium: vía humana con canales concretos", async ({ page }) => {
    await setup(page, "premium");
    await page.goto("/dashboard/premium-properties/pp-104");
    await visible(page, "reservation-panel").getByRole("button", { name: "Hablar con un asesor" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Lucía Paredes");
    await expect(dialog.getByRole("link", { name: /WhatsApp/ })).toBeVisible();
    await dialog.getByRole("button", { name: "Pedir que me llamen" }).click();
    await expect(dialog.getByRole("button", { name: "Llamada solicitada" })).toBeDisabled();
  });
});

test.describe("Solicitud de reserva", () => {
  test("requiere declaraciones y verificación reforzada antes de enviar", async ({ page }) => {
    const { expectNoErrors } = await setup(page, "premium");
    await page.goto("/dashboard/premium-invest?property=pp-104");
    await expect(page.getByRole("main").getByRole("heading", { name: "Solicitar reserva" })).toBeVisible();

    // Paso 1: las tres declaraciones son obligatorias.
    await expect(wizardNext(page)).toBeDisabled();
    for (const label of [/Revisé el expediente/, /retorno es estimado/, /no equivale a adquirir/]) {
      await page.getByText(label).click();
    }
    await wizardNext(page).click();

    // Paso 2: origen de fondos vencido bloquea hasta declararlo.
    await expect(page.getByTestId("check-funds")).toContainText("Acción requerida");
    await expectNoHorizontalOverflow(page);
    await expect(wizardNext(page)).toBeDisabled();
    await page.locator("#sof-origin").selectOption({ label: "Actividad empresarial" });
    await page.setInputFiles("#sof-file", { name: "estado-de-cuenta.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF") });
    await page.getByText("Declaro que los fondos tienen origen lícito").click();
    await page.getByRole("button", { name: "Enviar declaración" }).click();
    await expect(page.getByTestId("check-funds")).toContainText("En revisión");
    await expectNoHorizontalOverflow(page);
    await wizardNext(page).click();

    // Paso 3: sin tarjeta ni Yape para seis cifras.
    await expect(page.getByText(/Tarjeta y Yape no están disponibles/)).toBeVisible();
    await expect(wizardNext(page)).toBeDisabled();
    await page.getByRole("radio", { name: /Un solo aporte/ }).click();
    await expectNoHorizontalOverflow(page);
    await wizardNext(page).click();

    // Paso 4: resumen y envío.
    await expect(page.getByText("Cobro al enviar")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await wizardNext(page).click();
    const success = page.getByTestId("reservation-success");
    await expect(success).toContainText("Solicitud enviada");
    await expect(success).toContainText("No se realizó ningún cobro");
    await success.getByRole("link", { name: /Ver seguimiento/ }).click();

    await expect(page.getByTestId("next-step")).toContainText("Estamos revisando tu solicitud");
    await page.goto("/dashboard/premium-properties?filter=mine");
    await expect(page.getByTestId("premium-card-pp-104")).toContainText("Solicitud en revisión");
    expectNoErrors();
  });

  test("concurrencia: si otro inversionista llega antes, no se duplica la reserva", async ({ page }) => {
    await setup(page, "premium");
    // Se libera la verificación para aislar la concurrencia.
    await page.goto("/dashboard");
    await page.evaluate(() => {
      localStorage.setItem(
        "rematto-premium-compliance-v1",
        JSON.stringify([
          {
            userId: "premium-demo",
            identity: { status: "complete" },
            sourceOfFunds: { status: "complete", origin: "business" },
            bankAccount: { status: "complete", bank: "BCP", holder: "Valentina Ríos", last4: "4821", currency: "PEN/USD" },
          },
        ])
      );
    });
    await page.goto("/dashboard/premium-invest?property=pp-101");
    for (const label of [/Revisé el expediente/, /retorno es estimado/, /no equivale a adquirir/]) await page.getByText(label).click();
    await wizardNext(page).click();
    await wizardNext(page).click();
    await page.getByRole("radio", { name: /Aportes parciales/ }).click();
    await wizardNext(page).click();

    // Mientras revisa, otra persona envía su solicitud (otra pestaña / otro usuario).
    await page.evaluate(() => {
      const key = "rematto-premium-reservations-v1";
      const all = JSON.parse(localStorage.getItem(key) ?? "[]");
      all.unshift({
        id: "res-race", code: "RES-2026-9999", propertyId: "pp-101", userId: "u9", userName: "Otro", userEmail: "o@x.pe",
        amount: 890000, currency: "USD", status: "requested", fundingPlan: "single", requestedAt: new Date().toISOString(),
        contributions: [], stageHistory: [], documents: [], events: [],
      });
      localStorage.setItem(key, JSON.stringify(all));
    });
    await wizardNext(page).click();
    await expect(page.getByRole("alert").filter({ hasText: "No pudimos enviar" })).toContainText("Otro inversionista envió una solicitud antes");
  });

  test("la oportunidad en reserva por otro no admite solicitudes", async ({ page }) => {
    await setup(page, "premium");
    await page.goto("/dashboard/premium-invest?property=pp-102");
    await expect(page.getByText("Esta oportunidad ya no admite solicitudes")).toBeVisible();
  });

  test("retirar una solicitud la libera", async ({ page }) => {
    await setup(page, "premium");
    await page.goto("/dashboard");
    await page.evaluate(() => {
      const key = "rematto-premium-reservations-v1";
      const all = JSON.parse(localStorage.getItem(key) ?? "[]");
      all.unshift({
        id: "res-mine", code: "RES-2026-7777", propertyId: "pp-104", userId: "premium-demo", userName: "Valentina Ríos",
        userEmail: "premium@rematto.com", amount: 380000, currency: "PEN", status: "requested", fundingPlan: "single",
        requestedAt: new Date().toISOString(), contributions: [], stageHistory: [], documents: [], events: [],
      });
      localStorage.setItem(key, JSON.stringify(all));
    });
    await page.goto("/dashboard/my-investments/premium/res-mine");
    await page.getByRole("button", { name: "Retirar solicitud" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Retirar solicitud" }).click();
    await expect(page.getByTestId("next-step")).toContainText("Retiraste esta solicitud");
    await page.goto("/dashboard/premium-properties/pp-104");
    await expect(visible(page, "reservation-panel")).toContainText("Disponible");
  });
});

test.describe("Seguimiento de la operación", () => {
  test("firmar anexo y registrar el saldo pendiente", async ({ page }) => {
    const { expectNoErrors } = await setup(page, "premium");
    await page.goto("/dashboard/my-investments/premium/res-0436");
    const next = page.getByTestId("next-step");
    await expect(next).toContainText("Transfiere USD 290,000");

    // Firma del anexo (OTP)
    await next.getByRole("button", { name: /Firmar anexo/ }).click();
    const sign = page.getByRole("dialog");
    await sign.getByText("Leí el documento y acepto").click();
    await sign.getByLabel("Código de firma").fill("123456");
    await sign.getByTestId("sign-confirm").click();
    await expect(next.getByRole("button", { name: /Firmar anexo/ })).toHaveCount(0);

    // Validación del monto
    await next.getByTestId("next-step-contribute").click();
    const form = page.getByRole("dialog");
    await expectNoHorizontalOverflow(page);
    await form.getByLabel("Monto transferido").fill("999999");
    await form.getByLabel("N.º de operación").fill("88812345");
    await form.getByTestId("contribution-submit").click();
    await expect(form.getByText(/No puede superar el saldo pendiente/)).toBeVisible();
    await form.getByLabel("Monto transferido").fill("290000");
    await form.getByTestId("contribution-submit").click();
    await expect(form).toBeHidden();

    await expect(next).toContainText("Conciliando tu aporte");
    await page.getByRole("tab", { name: /Aportes/ }).click();
    await expect(page.getByText("Op. 88812345")).toBeVisible();
    await expect(page).toHaveURL(/tab=aportes/);
    expectNoErrors();
  });

  test("operación en proceso muestra hitos y la liquidada separa capital de ganancia", async ({ page }) => {
    await setup(page, "premium");
    await page.goto("/dashboard/my-investments/premium/res-0412");
    await expect(page.getByTestId("next-step")).toContainText("Etapa actual: Adjudicación");
    await expect(page.getByText("· Etapa actual")).toBeVisible();

    await page.goto("/dashboard/my-investments/premium/res-0301");
    const next = page.getByTestId("next-step");
    await expect(next).toContainText("Capital devuelto");
    await expect(next).toContainText("S/ 410,000");
    await expect(next).toContainText("S/ 61,500");
  });
});

test.describe("De la solicitud a la custodia, con el panel admin", () => {
  test("usuario solicita → admin valida y aprueba → usuario firma y aporta → admin concilia e inicia", async ({ page }) => {
    test.slow();
    const { expectNoErrors } = await setup(page, "premium", { admin: true });

    // 1. Usuario: solicitud con declaración de fondos.
    await page.goto("/dashboard/premium-invest?property=pp-104");
    for (const label of [/Revisé el expediente/, /retorno es estimado/, /no equivale a adquirir/]) await page.getByText(label).click();
    await wizardNext(page).click();
    await page.locator("#sof-origin").selectOption({ label: "Venta de un inmueble" });
    await page.setInputFiles("#sof-file", { name: "minuta.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF") });
    await page.getByText("Declaro que los fondos tienen origen lícito").click();
    await page.getByRole("button", { name: "Enviar declaración" }).click();
    await wizardNext(page).click();
    await page.getByRole("radio", { name: /Un solo aporte/ }).click();
    await wizardNext(page).click();
    await wizardNext(page).click();
    await page.getByTestId("reservation-success").getByRole("link", { name: /Ver seguimiento/ }).click();
    await expect(page).toHaveURL(/my-investments\/premium\/res-/);
    const trackingUrl = page.url();

    // 2. Admin: no puede aprobar sin validar el origen de fondos.
    await page.goto("/admin/premium-properties/pp-104");
    const card = page.locator('[data-testid^="admin-res-"]').first();
    await expect(card.getByTestId("admin-approve-request")).toBeDisabled();
    await card.getByTestId("admin-approve-sof").click();
    await card.getByTestId("admin-approve-request").click();
    await expect(card).toContainText("Reservada");

    // 3. Usuario: firma el contrato y registra la transferencia completa.
    await page.goto(trackingUrl);
    const next = page.getByTestId("next-step");
    await next.getByTestId("next-step-sign").click();
    await page.getByRole("dialog").getByText("Leí el documento y acepto").click();
    await page.getByRole("dialog").getByLabel("Código de firma").fill("654321");
    await page.getByTestId("sign-confirm").click();
    await next.getByTestId("next-step-contribute").click();
    await page.getByRole("dialog").getByLabel("N.º de operación").fill("55501234");
    await page.getByTestId("contribution-submit").click();
    await expect(next).toContainText("Conciliando tu aporte");

    // 4. Admin: concilia → custodia → inicia el proceso.
    await page.goto("/admin/premium-properties/pp-104");
    await card.locator('[data-testid^="admin-confirm-"]').click();
    await expect(card).toContainText("Aporte en custodia");
    await card.getByTestId("admin-advance").click();
    await expect(card).toContainText("Etapa actual");

    // 5. Usuario: lo ve en su seguimiento y en Inicio.
    await page.goto(trackingUrl);
    await expect(page.getByTestId("next-step")).toContainText("Etapa actual: Subasta");
    await page.goto("/dashboard");
    await expect(page.locator('[data-testid^="home-op-"]').filter({ hasText: "Skyline" })).toContainText("En proceso");
    expectNoErrors();
  });
});

test.describe("Cuenta, notificaciones, documentos y retornos", () => {
  test("Inicio: sin ROI global, acciones Premium primero y expandibles", async ({ page }) => {
    await setup(page, "premium");
    await page.goto("/dashboard");
    await expect(page.getByText("Avance del portafolio")).toBeVisible();
    await expect(page.getByText("Rendimiento de tu portafolio")).toHaveCount(0);
    const actions = page.locator('section[aria-labelledby="home-actions"]');
    await expect(actions).toContainText("Completa tu verificación reforzada");
    await actions.getByRole("button", { name: /Ver todas/ }).click();
    await expect(actions.getByRole("button", { name: "Ver menos" })).toBeVisible();
    await expect(page.getByTestId("home-op-res-0436")).toContainText("Transfiere USD 290,000");
  });

  test("Notificaciones filtran por tipo y cada una abre su página", async ({ page }) => {
    await setup(page, "premium");
    await page.goto("/dashboard/notifications?type=actions");
    await expect(page.getByRole("tab", { name: /Acciones/ })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("Verificación reforzada pendiente")).toBeVisible();
    await expect(page.getByText("Informe legal actualizado")).toHaveCount(0);
    await page.getByRole("tab", { name: /Documentos/ }).click();
    await expect(page.getByText(/Informe legal actualizado/)).toBeVisible();
    await page.getByText(/Informe legal actualizado/).click();
    await expect(page).toHaveURL(/res-0412\?tab=documentos/);
  });

  test("Mis documentos muestra los de las operaciones con estado", async ({ page }) => {
    await setup(page, "premium");
    await page.goto("/dashboard/documents");
    const docs = page.getByTestId("operation-documents");
    await expect(docs).toContainText("Anexo: cronograma de aportes");
    await expect(docs.getByText("Para firmar").filter({ visible: true }).first()).toBeVisible();
  });

  test("Retornos separa realizado, capital devuelto y proyección", async ({ page }) => {
    await setup(page, "premium");
    await page.goto("/dashboard/retornos");
    await expect(page.getByText("Realizado", { exact: true })).toBeVisible();
    await expect(page.getByText("Capital devuelto", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("En seguimiento", { exact: true })).toBeVisible();
    await expect(page.getByText("Liquidaciones Premium")).toBeVisible();
    await expect(page.getByText("Casa de Campo — Cieneguilla")).toBeVisible();
  });

  test("Mi cuenta: Premium activo con acción requerida y comparación Estándar/Premium", async ({ page }) => {
    await setup(page, "premium");
    await page.goto("/dashboard/account?section=premium");
    const section = page.getByTestId("premium-access");
    await expect(section.getByText("Acción requerida").first()).toBeVisible();
    await expect(section.getByTestId("source-of-funds-form")).toBeVisible();
    await expect(section.getByText("Solicitar reserva")).toBeVisible();
  });
});
