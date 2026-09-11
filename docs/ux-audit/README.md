# Plan de ejecución — Auditoría UX/UI y de negocio

> **Qué es este documento.** La guía de ejecución para cerrar los 124 hallazgos de la
> auditoría externa en las hojas **Login Usuario**, **Usuario Estándar** y **Usuario
> Premium**. Está escrito para que un agente de IA (o una persona) pueda tomar un
> paquete de trabajo, entenderlo sin contexto previo, ejecutarlo y verificarlo.
>
> **Este documento es planificación.** No contiene código aplicado. Cada paquete
> describe el cambio, los archivos, el criterio de aceptación y cómo comprobarlo.

- **Ledger completo de hallazgos:** [`findings-ledger.md`](./findings-ledger.md)
- **Fuente:** hoja de cálculo de auditoría (hojas `Login Usuario`, `Usuario Estandar`, `Usuario Premium`)

---

## 1. Cómo usar este plan

1. Lee esta sección y la **§3 (causas raíz)**. Casi ningún hallazgo es independiente:
   93 de los 124 se agrupan en 8 causas raíz. Arreglar el síntoma pantalla por
   pantalla reintroduce el problema en la siguiente pantalla.
2. Respeta el **orden de §8**. Los paquetes `WP-0.x` son bloqueantes: modifican el
   modelo de datos del que dependen casi todos los demás.
3. Toma **un paquete completo por rama/PR**. Los paquetes están dimensionados para
   ser revisables (entre 1 y 5 archivos de dominio + sus consumidores).
4. Antes de cerrar, ejecuta la **checklist de §9** y marca los IDs en el ledger.

### Convenciones para el agente ejecutor

- **Lee `AGENTS.md` primero.** Este proyecto usa una versión de Next.js cuyas APIs y
  convenciones pueden diferir de tu entrenamiento. Consulta
  `node_modules/next/dist/docs/` antes de escribir código de framework.
- **No migres el stack.** Next.js 16 + React 19 + Tailwind v4 + shadcn/Radix +
  `lucide-react` + `framer-motion` se quedan. Los hallazgos son de producto y
  diseño, no de infraestructura.
- **No inventes colores.** `src/app/globals.css` ya define un sistema de tokens
  semánticos derivados de `--brand` en oklch (`primary`, `secondary`, `muted`,
  `success`, `warning`, `info`, `destructive`, `premium`, `sidebar-*`). Todo color
  nuevo se expresa con esos tokens. Nunca hex crudo en componentes.
- **No inventes datos.** Todo importe, ROI, plazo o estado que aparezca en pantalla
  debe salir de `src/lib/**`. Si un dato no existe en el modelo, el paquete
  correspondiente indica qué campo añadir.
- **Texto en español de Perú**, tono llano. Sin superlativos comerciales
  (`Elevate`, `Seamless`, `Next-Gen`, `revolucionario`). Sentence case.
- **El dinero nunca se trunca.** Prohibido `truncate` sobre un importe.

---

## 2. Alcance y método de verificación

Cada hallazgo fue contrastado contra el código actual del repositorio antes de
asignarle un paquete. El ledger marca cuatro estados:

| Estado | Significado | Nº |
|---|---|---|
| `ABIERTO` | Verificado en código: el problema existe tal como lo describe la auditoría | 93 |
| `PARCIAL` | Una ronda previa lo atacó, pero queda trabajo descrito en el paquete | 18 |
| `YA RESUELTO` | El código actual ya cumple. **Solo requiere verificación, no cambios** | 9 |
| `NO ROMPER` | La auditoría lo marcó como acierto. Es una guarda de regresión | 4 |

> ### Limitación conocida: la columna *Evidencia*
>
> La columna **Evidencia** de la hoja contiene capturas de pantalla en varias filas.
> **No fue posible recuperar esas imágenes**: la exportación de texto de Google Sheets
> no incluye imágenes incrustadas, y la exportación a `.xlsx` falla por tamaño del
> archivo. Este plan se construyó sobre las columnas *Hallazgo*, *Observación* e
> *Impacto*, que describen el problema con suficiente precisión, **más la
> verificación directa contra el código**, que en la práctica sustituye a la captura.
>
> **Acción recomendada para quien ejecute:** antes de empezar `WP-2.2`, `WP-6.1` y
> `WP-7.x` (los paquetes más visuales), abrir la hoja y mirar las capturas de los IDs
> listados en cada paquete. Si alguna captura contradice lo aquí descrito, la captura
> manda y hay que corregir el paquete.

---

## 3. Causas raíz

Esta es la sección que más ahorra trabajo. Los 124 hallazgos no son 124 tareas.

| # | Causa raíz | Hallazgos que cierra | Paquete |
|---|---|---|---|
| **A** | El dashboard mantiene su **propia copia hardcodeada** de las inversiones, en vez de derivarlas del modelo | E-040, E-041, E-045 (+ nombres divergentes) | WP-0.1 |
| **B** | El modelo **no tiene ciclo de vida**: `status` mezcla "estado de mi pago" con "etapa del proceso judicial", y no admite resultados no positivos | E-003, E-005, E-011, E-034, E-038, E-041, E-046, P-025 | WP-0.2, WP-4.3 |
| **C** | **No existe modelo de evidencia**: ni expediente, ni juzgado, ni etapa procesal, ni fecha de revisión, ni supuestos del ROI, ni costos | E-032, E-033, E-035, E-036, E-037, P-017, P-019, P-020 | WP-0.2, WP-3.x |
| **D** | **No existe modelo de capacidad de pago**: ningún método declara límite, para operaciones de cientos de miles | P-024, P-026, P-027, P-028, P-030, E-042 | WP-0.2, WP-6.4 |
| **E** | **Conflación de capital y ganancia**: "Retornos" suma devoluciones de capital, reembolsos y ganancias en un solo número | E-007, E-010, E-020, E-043, P-017 | WP-4.1 |
| **F** | **Redundancia de navegación**: tres rutas para la misma intención, y el oro Premium repetido cinco veces | E-001, E-012, E-016, E-017, P-005, P-007, P-032 | WP-2.1, WP-6.1 |
| **G** | **Narrativa comercial monotemática**: el producto se define casi solo por rendimiento, en todas las superficies | E-025 a E-031, P-010 a P-016, L-013 a L-024 | WP-8, WP-6.2, WP-1.x |
| **H** | **La autenticación es una maqueta**: sin validación real, sin estados de error, sin paridad de proveedores | L-030, L-033, L-034, L-035, L-036, L-038 | WP-1.4 |

### Evidencia concreta de la causa A

`src/app/dashboard/page.tsx` declara un array literal `activeInvestments` con nombres,
ROI y montos escritos a mano. `src/lib/dashboard/mock-data.ts` declara los mismos
activos con otros valores:

| Activo | Dashboard (hardcodeado) | Catálogo (`mock-data.ts`) |
|---|---|---|
| San Isidro | `"Dept. San Isidro 3B"` · `+21%` | `"Departamento en San Isidro"` · `roi: 22` |
| La Molina | `"Casa Los Olivos"` · `+17%` · `"En revisión legal"` | `"Casa en La Molina"` · `roi: 18` · `status: "Activo"` |
| Miraflores | `"Penthouse Miraflores"` · `+20%` · `S/ 2,500` | `roi: 22`; la inversión `inv-005` sobre esa propiedad es `USD 2000` |
| San Borja | `"Oficina San Borja"` · `S/ 1,500` | `currency: "USD"` |

El mismo inmueble tiene **dos nombres, dos ROI, dos estados y dos monedas** según la
pantalla. No es un problema de copy: es que existen dos fuentes de verdad.

---

## 4. Dirección de diseño

Se consultaron las dos skills indicadas. Ambas aportan, pero con un matiz importante
que conviene declarar antes de aplicarlas:

- **`ui-ux-pro-max`** aporta una tabla de prioridades (accesibilidad → interacción →
  rendimiento → estilo → layout → tipografía/color → animación → formularios →
  navegación → datos) que encaja bien con este producto. **Se adopta como criterio
  de prioridad transversal.**
- **`taste-skill`** aporta disciplina anti-genérico muy útil para tipografía, jerarquía
  y estados. Pero **declara explícitamente que su alcance excluye dashboards, tablas
  de datos y formularios multi-paso** — es decir, la mayor parte de este producto. Se
  aplica su *protocolo de rediseño* (escanear → diagnosticar → arreglar dentro del
  stack, cambios pequeños y revisables) y sus reglas de tipografía, estados y copy.
  **No se aplican** sus reglas de librería (pide evitar `lucide-react`) ni su veto al
  guion largo: el stack y la voz del repositorio ya están decididos, y la propia skill
  ordena trabajar dentro del stack existente.

### Principios para este producto concreto

1. **La cuenta no es una landing.** Una vez dentro, el usuario ya compró la promesa.
   El dashboard debe informar, no vender. Lo comercial va después del contenido personal.
2. **Toda cifra declara su naturaleza.** Estimado, acreditado, bruto o neto — nunca
   un número desnudo. Un porcentaje sin metodología consultable es una afirmación, no un dato.
3. **La confianza se demuestra, no se afirma.** "Verificada" sin decir qué se verificó
   es ruido. Cada oportunidad debe poder trazarse a un expediente real.
4. **El escenario adverso es parte del producto**, no una nota legal al pie.
5. **Una intención, una ruta.** Si dos botones llevan al mismo sitio, sobra uno.
6. **El oro es señal, no decoración.** Reservado para contenido exclusivo Premium.

### Escala tipográfica (a definir en `WP-0.3`)

El proyecto tiene tokens de color sólidos pero **ninguna escala tipográfica**, lo que
produce E-019 (tamaños y espaciados inconsistentes entre tarjetas). Definir en
`globals.css` y usar en todo el dashboard:

| Rol | Uso | Tamaño / peso |
|---|---|---|
| `display` | Cifra dominante de una tarjeta (`S/ 12,500`) | 2rem / 700 / `tabular-nums` |
| `title` | H1 de página | 1.5rem / 700 |
| `heading` | Título de sección | 1rem / 600 |
| `body` | Texto corrido | 0.875rem / 400 |
| `caption` | Etiqueta, metadato, variación | 0.75rem / 500 |
| `overline` | Etiqueta superior en mayúsculas | 0.625rem / 600 / tracking ancho |

Regla: **una sola cifra dominante por tarjeta.** Cualquier cifra secundaria baja a
`caption` dentro de una cápsula. Todos los números financieros con `tabular-nums`.

---

## 5. Paquetes de trabajo

Cada paquete lista los IDs que cierra. El detalle textual de cada hallazgo (hallazgo,
observación y recomendación del auditor, literal) está en
[`findings-ledger.md`](./findings-ledger.md), agrupado por paquete.

---

### WP-0 · Fundaciones (bloqueante)

#### WP-0.1 — Una sola fuente de verdad para el dashboard
**Cierra:** E-040, E-041 · **Desbloquea:** WP-2.2, WP-2.3, WP-4.2

**Problema.** Ver §3, causa A.

**Cambio.**
1. Eliminar el array literal `activeInvestments` de `src/app/dashboard/page.tsx`.
2. Derivar la lista desde `userInvestments` + `getPropertyById()` de
   `src/lib/dashboard/mock-data.ts`.
3. Añadir en `src/lib/dashboard/` un selector `getActiveInvestmentsForUser(userId)`
   que devuelva la inversión unida a su propiedad, para que dashboard,
   `my-investments` y el detalle consuman exactamente lo mismo.
4. Eliminar igualmente los literales `summaryCards` y `activityFeed`: los totales se
   calculan desde las inversiones; la actividad sale de
   `src/lib/dashboard/notifications.ts`.

**Aceptación.**
- `grep -rn "Casa Los Olivos\|San Isidro 3B" src/` no devuelve nada.
- El ROI, el nombre, el estado y la moneda de un activo son idénticos en
  `/dashboard`, `/dashboard/properties`, `/dashboard/properties/[id]` y
  `/dashboard/my-investments`.
- Ningún componente de `src/app/dashboard/**` declara importes literales.

---

#### WP-0.2 — Extender el modelo de dominio
**Cierra (parcialmente, habilita el resto):** E-003, E-005, E-032, E-033, E-034, E-036, E-038, E-046, P-020, P-025 · **Desbloquea:** WP-3.x, WP-4.3, WP-5.x, WP-6.3, WP-6.4

Cuatro extensiones en `src/lib/dashboard/types.ts` y `src/lib/premium/types.ts`. Son
cambios de tipos y datos mock; ningún backend real está implicado todavía.

**(a) Ciclo de vida separado del estado de pago.**

Hoy `UserInvestment.status` es `"active" | "completed" | "pending" | "cancelled"`, que
responde "¿se pagó?" pero no "¿dónde está el proceso?". La pantalla inventa la
respuesta con strings sueltos (`"Subasta activa"`, `"En revisión legal"`, `"Adjudicado"`).

```ts
/** Dónde está el proceso judicial. Independiente del estado del pago. */
export type ProcessStage =
  | "subasta"        // convocada o en curso
  | "adjudicacion"   // adjudicada, pendiente de formalizar
  | "formalizacion"  // actos notariales / registrales
  | "venta"          // en comercialización
  | "liquidacion";   // retorno en distribución

export interface ProcessMilestone {
  stage: ProcessStage;
  reachedAt: string | null;   // null = todavía no alcanzado
  expectedAt: string | null;
  note?: string;
}
```

`UserInvestment` gana `stage: ProcessStage` y `timeline: ProcessMilestone[]`.
`DashboardProperty.status` (`Activo | Próximo | Cerrado`) **se mantiene separado**: describe
la disponibilidad comercial de la oportunidad, no la etapa procesal (esto es E-041).

**(b) Resultados no positivos.**

```ts
export type InvestmentOutcome =
  | { kind: "estimated"; roi: number }              // proyección vigente
  | { kind: "revised"; roi: number; previousRoi: number; revisedAt: string }
  | { kind: "settled"; roi: number }                // resultado final, puede ser 0 o negativo
  | { kind: "capital_returned" }                    // devuelto sin ganancia
  | { kind: "extended"; newExpectedAt: string };    // plazo extendido
```

`UserInvestment.estimatedReturn: number` se reemplaza por `outcome: InvestmentOutcome`.
El ROI deja de ser siempre positivo. Los datos mock deben incluir **al menos un caso de
cada variante** — si los datos solo contienen ganancias, la UI nunca se prueba contra
el escenario adverso (E-038).

**(c) Evidencia y procedencia.**

```ts
export interface JudicialRecord {
  expediente: string;          // p. ej. "01234-2025-0-1801-JR-CI-07"
  juzgado: string;
  etapa: string;
  lastReviewedAt: string;
  sourceUrl?: string;          // enlace público verificable si existe
}

export interface VerificationReport {
  verifiedAt: string;
  scope: string[];             // qué se revisó, en lenguaje llano
  documents: { label: string; url: string }[];
}

export interface RoiBasis {
  assumptions: { label: string; value: string }[];  // tasación, precio de salida, plazo…
  costs: { label: string; amount: number }[];       // comisión, notarial, registral, impuestos
  grossRoi: number;
  netRoi: number;
}
```

`DashboardProperty` y `PremiumProperty` ganan `judicial: JudicialRecord`,
`verification: VerificationReport` y `roiBasis: RoiBasis`.

**(d) Capacidad de pago por método.**

```ts
export interface PaymentMethodLimits {
  id: PaymentMethodId;
  maxPerTransaction: Partial<Record<PropertyCurrency, number>>;
  allowsPartial: boolean;
  note: string;   // por qué existe el límite, en lenguaje de usuario
}
```

Declarado en `src/lib/invest/payment-limits.ts`. Yape y tarjeta tienen techo; la
transferencia bancaria es el canal de alto valor.

**Aceptación.** El proyecto compila (`npm run build`); los datos mock cubren todas las
variantes de `InvestmentOutcome` y todas las etapas de `ProcessStage`; toda propiedad
tiene `judicial`, `verification` y `roiBasis` poblados.

---

#### WP-0.3 — Escala tipográfica y consistencia de marca
**Cierra:** E-019, E-018, L-025

1. Añadir los tokens tipográficos de §4 a `src/app/globals.css` y aplicarlos en las
   tarjetas del dashboard. Una sola cifra dominante por tarjeta.
2. **Marca.** `BRAND_NAME` ya es `"Rematto"` y los textos visibles están alineados,
   pero sobreviven rastros de `remata` en identificadores que el usuario sí ve:
   - correos demo `premium@remata.com` / `standard@remata.com`
     (`src/lib/premium/mock-data.ts`, `src/app/login/page.tsx`,
     `src/contexts/user-context.tsx`, `PremiumUpgradeBanner.tsx`)
   - clave de `localStorage` `remata-demo-user-v1`
   - `whatIsRemata` en `src/lib/chat/platform-context.ts`

   Renombrar todo a `rematto`. Migrar la clave de `localStorage` leyendo la antigua
   una vez y reescribiéndola, para no desloguear a quien ya tenga sesión.

**Aceptación.** `grep -rni "remata[^t]" src/` solo devuelve coincidencias dentro de la
palabra "remates"/"rematar".

---

### WP-1 · Autenticación y onboarding (hoja *Login Usuario*)

#### WP-1.1 — El login es una tarea, no un escaparate
**Cierra:** L-002, L-007, L-008, L-011, L-014, L-022, L-028 · **Verifica:** L-005, L-016, L-020, L-021, L-026, L-027, L-032

**Archivos:** `src/app/login/page.tsx`, `src/components/auth/AuthBrandingPanel.tsx`

Una ronda previa ya retiró el testimonio de `S/2,000 → S/420`, el "hasta 22% anual" y
"sin comisiones de apertura", y enlazó Términos y Privacidad por separado. **Esos siete
hallazgos solo requieren verificación de no regresión.** Queda:

1. **Cuentas demo (L-002).** Hoy ocupan el bloque superior, antes del formulario real.
   Moverlas debajo del formulario, plegadas tras un enlace discreto
   («Usar una cuenta de demostración»), y ocultarlas salvo que
   `NEXT_PUBLIC_ENABLE_DEMO_ACCOUNTS === "true"` — mismo patrón ya usado para el FAB de
   apariencia en `src/app/layout.tsx`.
2. **Jerarquía (L-007, L-008).** El formulario es el elemento dominante. El panel
   izquierdo es respaldo de marca: un mensaje, máximo dos señales de confianza.
3. **Usuario recurrente (L-014, L-022).** El panel de `/login` habla a quien no conoce
   Rematto. Debe hablar a quien vuelve: «Tus oportunidades, siempre a la mano», con
   beneficios de cuenta (seguimiento, documentos, estado), no de adquisición. Requiere
   separar el panel — ver WP-1.2.
4. **Legales (L-011).** Subir el bloque legal junto al formulario, con separación
   coherente y tamaño legible; hoy queda descolgado al final.
5. **Señales de seguridad (L-028).** Junto al formulario, una línea sobria y **veraz**
   sobre protección de la cuenta. No prometer mecanismos que no existan.

---

#### WP-1.2 — Un hilo conductor de onboarding
**Cierra:** L-006, L-018, L-019, L-023 · **Verifica:** L-013, L-017

**Problema.** `AuthSplitLayout` renderiza el mismo `AuthBrandingPanel` en `/login` y
`/register`. Dos momentos distintos del funnel, visualmente idénticos (L-006). Y el
usuario no ve dónde está dentro del recorrido (L-019).

**Cambio.**
1. `AuthBrandingPanel` recibe `variant: "login" | "register" | "verification"` y cambia
   titular y recurso gráfico. El sistema visual se mantiene; el mensaje se contextualiza.
2. Introducir el hilo conductor de la auditoría, visible en las tres pantallas, con la
   etapa actual destacada:
   `Crea tu cuenta → Verifica tu identidad → Explora oportunidades → Invierte cuando estés listo`
3. La lista de 3 pasos que hoy vive en `/register` pasa a ser ese componente compartido.
4. **Resolver la contradicción de plazo:** `/register` promete «hasta 24 h hábiles» y
   `/verification` promete «2–4 horas». Elegir un único rango real y usarlo en ambas
   (ver L-004 en WP-1.3).

---

#### WP-1.3 — La verificación debe contemplar el fracaso
**Cierra:** L-001, L-003, L-004, L-010, L-029, L-031 · **Avanza:** L-009, L-012, L-015, L-024

**Archivo:** `src/app/verification/page.tsx`

1. **Estado observado/rechazado (L-003).** Hoy la pantalla solo dibuja la secuencia
   feliz hasta «Cuenta activada». Añadir: «Si necesitamos información adicional, te
   avisaremos por correo y podrás actualizarla desde tu cuenta», y modelar el estado
   `observada` con su ruta de corrección.
2. **Banner de cuenta pendiente (L-029, L-031).** El CTA «Ir al dashboard» aparece
   mientras «Cuenta activada» sigue pendiente. Encima del botón:
   > Tu cuenta sigue en revisión. Puedes explorar propiedades mientras tanto; las
   > operaciones de inversión se habilitan cuando aprobemos tu verificación.
3. **Ayuda contextual (L-001, L-024).** Enlace discreto: «¿Problemas con tu
   verificación?» → soporte, y «Ver preguntas frecuentes».
4. **Un solo sistema de progreso (L-010).** Arriba hay un stepper de 3 pasos; dentro de
   la tarjeta, una línea de 4 estados. Unificar: el stepper marca la fase, la línea
   interna pasa a ser sub-estado visualmente subordinado (no un segundo stepper).
5. **Plazo realista (L-004).** Ver WP-1.2.4.
6. **Por qué pedimos el DNI (L-015).** Existe la nota de cifrado; falta el encabezado
   «¿Por qué necesitamos tu documento?» y el enlace «Cómo protegemos tus datos» **antes**
   de la zona de carga, que es el principal punto de abandono.
7. **Marca e iconografía (L-009, L-012).** La cabecera ya lleva el logotipo. Revisar que
   los iconos del stepper sigan una única lógica de color con los tokens del sistema.

---

#### WP-1.4 — Endurecer el flujo de autenticación
**Cierra:** L-030, L-033, L-034, L-035, L-036, L-038 · **Verifica:** L-037

Estado actual: `/login` escribe `localStorage` directamente y redirige; no hay validación
real. Estos seis hallazgos son funcionales y varios necesitan backend.

| ID | Cambio | Dónde |
|---|---|---|
| L-030 | Correo duplicado → «Ya existe una cuenta con este correo. Inicia sesión o recupera tu contraseña», con ambos enlaces | `/register` + backend |
| L-035 | **Paridad Google.** `/register` ofrece «Registrarse con Google»; `/login` no ofrece «Continuar con Google». Un usuario registrado por Google no puede volver a entrar | `src/app/login/page.tsx` |
| L-036 | **Tamaño de archivo.** `handleFile()` valida `file.type` pero **no** el tamaño. Validar antes de leer y mostrar «El archivo supera el máximo de X MB» | `src/app/verification/page.tsx` |
| L-038 | Validación de correo con mensaje propio («Ingresa un correo electrónico válido»), no solo la nativa del navegador | `/login`, `/register` |
| L-033 | Rate limiting / bloqueo progresivo tras intentos fallidos. **Requiere backend** | — |
| L-034 | Expiración de sesión → redirigir a `/login` con «Tu sesión venció…» conservando la ruta destino cuando sea seguro | middleware + `user-context` |

**Nota de arquitectura.** `/login` duplica la lógica de sesión que ya vive en
`src/contexts/user-context.tsx` (`login()`). Debe usar el contexto, no escribir
`localStorage` a mano; si no, L-034 no se puede implementar de forma consistente.

---

### WP-2 · Arquitectura de información del dashboard (hoja *Usuario Estándar*)

#### WP-2.1 — Navegación: una intención, una ruta
**Cierra:** E-001, E-012, E-016, E-017 · **Avanza:** E-023

**Problema.** Siete entradas planas con el mismo peso, más tres rutas para "encontrar
una oportunidad" (`Propiedades`, `Invertir`, y el CTA «Nueva inversión»), más
Notificaciones que solo existe como icono pese a tener ruta propia
(`/dashboard/notifications`).

**Cambio.**
1. Extraer la navegación a `src/lib/dashboard/nav-config.ts` — hoy está **duplicada**
   entre `Sidebar.tsx` y `Topbar.tsx`, que ya divergen. (Existe el precedente de
   `src/lib/admin/nav-config.ts`.)
2. Agrupar con separadores visuales:
   - **Principal:** Inicio · Propiedades · Mis inversiones · Retornos
   - **Cuenta:** Notificaciones · Mi cuenta
   - **Premium:** tratamiento secundario, separado
   - **Cerrar sesión** al fondo
3. Eliminar `Invertir` del menú (E-001). `/dashboard/invest` sigue existiendo como
   destino del CTA y de los enlaces «Invertir» de cada propiedad, pero deja de competir
   como ruta de descubrimiento. CTA unificado: **«Explorar oportunidades»**.
4. `Dashboard` → **`Inicio`** en el menú y en el título de `Topbar.getPageTitle()` (E-012).
5. **Notificaciones al menú** (E-016).
6. Estado activo (E-023): fondo de baja intensidad + icono en color primario +
   indicador lateral de 3–4 px. No depender solo del color del texto.

---

#### WP-2.2 — Reordenar la portada de la cuenta
**Cierra:** E-002, E-004, E-005, E-008, E-009, E-013, E-014, E-015, E-022

**Archivo:** `src/app/dashboard/page.tsx` (+ `PremiumUpgradeBanner.tsx`)

**Orden actual:** saludo + rendimiento + 2 CTAs → bloque Premium grande → métricas →
inversiones → actividad. El usuario que entra a ver su dinero atraviesa primero un
anuncio (E-008).

**Orden objetivo:**

```
1. Saludo + dato contextual + UN CTA sólido           (E-014: tres niveles, no cinco)
2. "Requiere tu atención"                              (E-004 — nuevo módulo)
3. Métricas del portafolio + "Información actualizada: …"   (E-009)
4. Tus inversiones                                     (WP-2.3)
5. Últimas actualizaciones de tu cuenta                (WP-8)
6. Premium — tarjeta horizontal compacta               (E-008, E-015, E-022)
```

**Detalles.**
- **E-004 · «Requiere tu atención».** Módulo nuevo, arriba de las inversiones. Deriva de
  notificaciones no leídas y del estado de verificación: «1 documento nuevo por revisar»,
  «Verificación en proceso», o el estado vacío explícito «No tienes acciones pendientes».
  Es la respuesta a *"¿tengo que hacer algo?"*, que en una inversión larga importa más
  que *"¿cuánto tengo?"*.
- **E-005 · «Inversiones activas» miente por agregación.** La tarjeta dice `4` mientras
  las fichas muestran tres etapas distintas. Sustituir por estados explícitos:
  «4 inversiones en curso: 2 en subasta · 1 en revisión · 1 adjudicada». Depende de
  `ProcessStage` (WP-0.2a).
- **E-002 · «Ver todas» invisible.** Hoy es `text-xs text-secondary`. Subirlo a `caption`
  con color primario y área táctil ≥ 44 px.
- **E-013 · Siguiente paso contextual.** El CTA se adapta: «Revisar documento nuevo» /
  «Ver inversión que cierra en 8 días» / «Explorar oportunidades» si no hay pendientes.
- **E-015, E-022 · Premium compacto.** De tarjeta de ~1 pantalla a una fila: título, una
  frase, **máximo 2 beneficios** (acceso anticipado, oportunidades exclusivas) y botón
  secundario «Ver beneficios». Los cuatro argumentos completos viven en `/dashboard/premium-properties`.

---

#### WP-2.3 — Las fichas de inversión deben responder "¿y ahora qué?"
**Cierra:** E-003, E-006, E-010, E-011, E-021, E-024

Rediseño de la ficha de inversión (extraer a `src/components/dashboard/InvestmentCard.tsx`;
hoy está embebida en `page.tsx`).

| ID | Cambio |
|---|---|
| E-003 | **Mini-línea de proceso** en cada ficha: `Subasta → Adjudicación → Venta → Retorno`, con la etapa actual resaltada. Consume `ProcessStage` (WP-0.2a) |
| E-006 | CTA explícito **«Ver seguimiento»**. Hoy las fichas ni siquiera son enlaces |
| E-010 | Traducir el ROI a dinero: junto a `+21%`, **«Retorno estimado: S/ 735»**, calculado sobre la participación real y etiquetado como estimado |
| E-011 | Desambiguar los días: `"8 días"` → **«Cierra en 8 días»** / **«En revisión desde hace 15 días»**, según corresponda |
| E-021 | Dos columnas internas alineadas: izquierda «Tu inversión» + importe; derecha «Retorno estimado» + % |
| E-024 | Reducir la foto a miniatura. La ficha es financiera: el estado, el importe y la etapa mandan sobre la imagen |

---

### WP-3 · Confianza y evidencia (hoja *Usuario Estándar*)

Verificado: `src/app/dashboard/properties/[id]/page.tsx` **no contiene** ningún bloque de
riesgos, expediente, verificación ni metodología. Las cuatro piezas son nuevas.

#### WP-3.1 — Bloque de evidencia de la oportunidad
**Cierra:** E-032, E-033

Componente `OpportunityEvidence`, en el detalle de propiedad (estándar y premium):

- **Verificación de la oportunidad** — Estado · Fecha de revisión · **Qué se revisó**
  (lista llana) · Documentos disponibles · Última actualización. Consume
  `VerificationReport` (WP-0.2c).
- **Proceso judicial** — N.º de expediente · Juzgado · Etapa actual · Fecha de última
  revisión · enlace verificable si existe. Consume `JudicialRecord`.

Sin esto, "propiedad verificada" es una afirmación que el usuario debe creer. En un
producto de remates judiciales, el expediente **es** el producto.

#### WP-3.2 — Riesgo y metodología en el punto de decisión
**Cierra:** E-035, E-036

- **«Antes de invertir»**, inmediatamente antes del CTA de inversión, con el mismo peso
  visual que los beneficios: retorno estimado no garantizado · plazo sujeto al proceso ·
  posibilidad de recuperación inferior · liquidez no inmediata. Más «Ver riesgos
  completos» → `/politica-de-riesgos`. **Texto a validar por Legal.**
- **«Ver cálculo»** junto al ROI → desglose desde `RoiBasis`: supuestos, costos y
  **retorno neto**.

#### WP-3.3 — Etiquetas honestas
**Cierra:** E-037

Los datos para sustituir las etiquetas vagas **ya existen** en `mock-data.ts`:

| Hoy | Sustituir por | Campo disponible |
|---|---|---|
| `🔥 Alta demanda` | `23 inversionistas · 70% financiado` | `investors`, `raisedAmount / totalInvestment` |
| `⚡ Cierra pronto` | `Cierra en 5 días` | `deadlineDays` |
| `⚖️ Proceso expedito` | Retirar o sustituir por la etapa procesal real | `judicial.etapa` (WP-0.2c) |

Además, subir el contraste de los CTA de las tarjetas de oportunidad.

---

### WP-4 · Semántica del dinero

#### WP-4.1 — Separar capital de ganancia
**Cierra:** E-007, E-020, E-043, E-010 (parcial)

**Problema.** `RetornoType` es `roi_return | refund | goal_not_reached`, y
`/dashboard/retornos` calcula `totalAmount` sumando **todos** los tipos —
devoluciones de capital incluidas, y además **mezclando monedas**. Si un usuario invirtió
S/ 1,000 y recibe S/ 1,200, el producto cuenta S/ 1,200 como retorno.

**Cambio.**
1. `Retorno` gana `principalAmount` y `gainAmount` (su suma es `amount`).
2. Tres categorías visibles: **Ganancia** · **Devolución de capital** · **Reembolso**.
3. **Solo `gainAmount` alimenta** el indicador «Retornos generados» del dashboard.
4. Los totales se agregan **por moneda** (`sumByCurrency` / `formatMixedCurrencyTotals`
   ya existen en `src/lib/currency.ts` y no se están usando aquí).
5. **E-007 · Etiquetar `+S/ 2,300`**: decir qué es («ganancias acreditadas este mes»,
   «valorización estimada», «nuevos aportes») y añadir tooltip «¿Cómo se calcula?».
6. **E-020 · Separar visualmente** `S/ 12,500` de `+S/ 2,300`: la primera como cifra
   dominante, la segunda en cápsula secundaria (`↑ S/ 2,300 este mes`), para que se lea
   como variación y no como un segundo saldo.

#### WP-4.2 — Integridad de moneda
**Cierra:** E-045

Verificado: la propiedad 4 («Oficina en San Borja») es `currency: "USD"` y el dashboard
la muestra como `S/ 1,500`; `inv-005` es `USD` sobre una propiedad marcada `PEN`.

- Cada inversión se guarda y se muestra **en su moneda original**.
- Un estimado en soles puede acompañar, **nunca sustituir**, con su tipo de cambio y fecha.
- Reconciliar los mocks: la moneda de la inversión no puede contradecir la de su propiedad.
- Nunca sumar PEN y USD en un mismo total.

#### WP-4.3 — El escenario adverso existe
**Cierra:** E-034, E-038, E-046

Consume `InvestmentOutcome` (WP-0.2b). La UI debe renderizar correctamente:
`Retorno estimado: 18%` · `Estimación actualizada: 11%` · `Sin retorno generado` ·
`Capital devuelto` · `Resultado final: −3%` · `Plazo extendido`.

- Bloque **«Estimado vs. resultado actual»** en el detalle de la inversión.
- **E-046:** cuando `daysUntilRoi < 0` y el proceso continúa, el estado pasa a
  **«Plazo extendido»** con nuevo hito y notificación — no «0 días» ni una fecha vencida
  congelada (hoy hay inversiones con `daysUntilRoi: -139`).
- Los colores dejan de asumir positivo: `success` solo para ganancia realizada,
  `destructive` para pérdida, `muted` para capital devuelto.

---

### WP-5 · Integridad del flujo de inversión

#### WP-5.1 — Elegibilidad
**Cierra:** E-039

Verificado: `src/app/dashboard/invest/page.tsx` línea ~49 hace
`dashboardProperties.map(...)` **sin filtrar por `status`**, y descarta el campo. La «Casa
en Surco» (`status: "Próximo"`) es seleccionable e invertible. El «Departamento en
Barranco» está financiado al 100% (`raisedAmount === totalInvestment`) y también.

- Filtrar a `status === "Activo"` **y** `raisedAmount < totalInvestment`.
- Mostrar el estado en cada tarjeta del paso «Selecciona una propiedad».
- Las oportunidades «Próximo» se muestran como tales, con «Avísame cuando abra», sin
  ruta de pago.
- Validar también el **máximo**: hoy solo se valida `min`, así que se puede aportar más
  de lo que queda por financiar.

#### WP-5.2 — Propagación tras invertir
**Cierra:** E-042

Confirmar una inversión debe actualizar, en una sola transacción: `Mis inversiones` ·
`Total invertido` · `raisedAmount` y progreso de la propiedad · `Actividad reciente` ·
`Notificaciones`. Y al cerrarse la subasta, la oportunidad debe dejar de estar disponible
en todos los módulos, para evitar aportes simultáneos sobre un activo ya cerrado.

#### WP-5.3 — Cobertura de notificaciones
**Cierra:** E-044 (parcial: el deep link ya existe)

`AppNotification` ya tiene `href` y `NotificationItem` ya envuelve en `Link` — esa mitad
está hecha. Falta la **cobertura de eventos**: hoy son casi todas de oportunidad y
ganancia. Añadir: cambio de ROI estimado · plazo extendido · subasta suspendida o
cancelada · devolución · reembolso · documento requerido · cambio de estado legal.

---

### WP-6 · Premium (hoja *Usuario Premium*)

#### WP-6.1 — Desduplicar accesos y disciplinar el oro
**Cierra:** P-001, P-002, P-004, P-005, P-006, P-007, P-008, P-009 · **Avanza:** P-003

1. **P-005 · Tres accesos a la misma pantalla**: botón dorado «Premium» en la cabecera,
   banner «Ver oportunidades» y entrada del menú lateral. Conservar **el menú lateral y
   el banner**; eliminar el botón dorado de la cabecera. El badge junto al nombre queda
   solo como indicador de tipo de cuenta, no como acceso.
2. **P-007 · El oro es señal, no decoración.** Hoy se repite en badge de usuario, botón,
   banner, indicador de menú y badge de perfil. Reservarlo para contenido exclusivo.
3. **P-008 · Banner a una fila:** `2 oportunidades disponibles · Ver oportunidades`.
4. **P-002 · «Ver oportunidades» debe abrir el filtro `Disponibles`**, no `Todas`
   (`/dashboard/premium-properties?filter=available`, con el estado inicial leído del
   query param).
5. **P-004 · Renombrar «Convertidas»** → «Pasaron a inversión colectiva». En la ficha:
   `Ventana Premium finalizada · Ahora disponible en Estándar`.
6. **P-009 · Máximo 2 badges** superiores (Premium + estado). La moneda baja al bloque
   financiero.
7. **P-006 · Jerarquía financiera.** Hoy `grid-cols-3 divide-x` da el mismo peso a
   capital requerido, ROI y ganancia estimada — la ganancia proyectada compite con el
   capital que hay que desembolsar. Orden: **capital requerido** como cifra principal,
   debajo retorno estimado, tercero ganancia estimada.
8. **P-001 · Badge `Estándar` / `Premium`** en cada inversión del dashboard.
9. **P-003 · Fecha absoluta de cierre de ventana.** `PremiumCountdown` muestra
   «Quedan 2d 5h 30m» pero nunca **cuándo** termina. Añadir
   `Ventana Premium hasta: 24 ago. 2026, 18:00` sobre la cuenta atrás.

#### WP-6.2 — Qué es realmente Premium
**Cierra:** P-010, P-011, P-012, P-014, P-016, P-017 · **Avanza:** P-015

Es el paquete de mayor riesgo legal y comercial del plan.

- **P-010 · «Captura propiedades al 100%»** no define qué derecho se adquiere. Un usuario
  puede comprometer cientos de miles creyendo que compra un inmueble. Sustituir por la
  figura jurídica real: «Financia individualmente el 100% del capital requerido y recibe
  [derecho contractual exacto]». **Bloqueante: requiere validación legal antes de escribir el copy.**
- **P-012 · Capacidad financiera, desde el inicio:** «Premium está diseñado para
  inversionistas que pueden financiar individualmente el capital total requerido de una
  oportunidad». Premium no es "un plan con más beneficios": cambia radicalmente el ticket.
- **P-014 · No devaluar Estándar.** Hoy `PremiumUpgradeBanner` y
  `/dashboard/premium-properties` dicen que si **nadie invierte**, la propiedad pasa al
  mercado estándar — lo que presenta a Estándar como el destino de los descartes.
  Reformular: «La oportunidad dispone inicialmente de una ventana de inversión
  individual. Finalizado ese periodo, puede habilitarse para participación colectiva».
- **P-011 · «Qué hace Rematto después de tu inversión»**: seguimiento, documentación,
  formalización, proceso judicial, gestión del activo y liquidación. La propuesta actual
  es fuerte en captación y muda en acompañamiento.
- **P-016 · Definir la exclusividad.** Un usuario Estándar ya ve nombre, dirección, valor,
  ROI y ganancia estimada; solo se bloquea el análisis ampliado. O se oculta de verdad lo
  exclusivo, o se deja de llamarlo «acceso exclusivo». Declarar: X horas de acceso
  anticipado + análisis completo + capacidad exclusiva de captura.
- **P-017 · Bruto vs. neto.** Se muestran ganancias de hasta `USD 754,000` sin los costos
  que las reducen. Añadir «Costos estimados de la operación» y cerrar siempre con
  **«Retorno neto estimado»**. Consume `RoiBasis` (WP-0.2c).

#### WP-6.3 — Evidencia proporcional y privacidad
**Cierra:** P-013, P-018, P-019, P-020, P-021, P-022, P-023

- **P-022 · Fuga de privacidad (prioritario).** `PremiumPropertyCard.tsx:148` y
  `premium-properties/[id]/page.tsx:201` renderizan
  **«Capturada por María Vargas»** a otros usuarios: expone la actividad financiera de
  alto valor de una persona identificada. Retirar el nombre. Idealmente retirar las
  propiedades capturadas de la vista de terceros (P-013), que además muestran
  oportunidades que ya no se pueden capturar.
- **P-019 · «¿Por qué esta oportunidad es Premium?»** con criterios reales y comprobables.
  Sin esto, la categoría parece una etiqueta creada para justificar exclusividad y ROI.
- **P-020 · Evidencia proporcional al ticket:** expediente · situación registral ·
  tasación · análisis legal · documentos · costos · riesgos · fecha de revisión.
- **P-018 · Escenarios:** «Retorno estimado base: 48% · Ver escenarios y cálculo».
- **P-021 · Destino de los fondos, antes de pagar:** titular de la cuenta, entidad,
  cuándo se consideran recibidos y qué ocurre si la operación no se formaliza.
  **Validar con Legal.**
- **P-023 · «Hablar con un asesor Premium»** en cada detalle. Para importes de seis
  cifras, el autoservicio puro aumenta la desconfianza.

#### WP-6.4 — Liquidación de alto valor
**Cierra:** P-024, P-025, P-026, P-027, P-028, P-030 · **Verifica:** P-029

**El cluster funcional más grave del plan.** Verificado: `src/lib/invest/payment-validation.ts`
valida formato (dígitos de tarjeta, 6 dígitos de Yape) pero **no impone ningún límite de
importe en ningún método**. `premium-invest/page.tsx` ofrece tarjeta y Yape para operaciones
de `USD 890,000`.

> Buena noticia: **P-029 ya está resuelto.** El flujo premium usa
> `STEPS = ["Propiedad", "Revisión", "Pago", "Confirmación"]` — sin paso «Monto» editable.
> Solo verificar que no se regrese.

1. **P-024, P-028 · Separar la liquidación Premium del checkout estándar.** Tras elegir la
   oportunidad: «Capital requerido: USD 890,000» y los mecanismos válidos para ese importe.
   Los límites se muestran **antes** del último paso, no al final.
2. **P-026 · Validar viabilidad antes de reservar.** Una oportunidad Premium es exclusiva
   de un inversionista; bloquearla para alguien que después no puede pagar la retira del
   mercado sin motivo. Preguntar «¿Cómo financiarás esta operación?» **antes** de crear la
   reserva firme, y si el método no cubre el monto, impedir avanzar con:
   «Para este monto debes utilizar transferencia bancaria».
3. **P-027, P-030 · Definir pagos fraccionados.** «100%» no implica "un solo pago".
   Decidir y comunicar: o «El capital total debe recibirse en una única operación», o un
   cronograma visible `Requerido USD 890,000 · Recibido USD 300,000 · Pendiente USD 590,000`.
   Yape y tarjeta declaran su techo real.
4. **P-025 · «Pago confirmado» ≠ «propiedad adquirida».** Sustituir la confirmación
   genérica por hitos:
   `Oportunidad reservada → Fondos pendientes → Fondos recibidos → Formalización en proceso → Operación formalizada`.
   «Adjudicada» solo cuando el hecho jurídico haya ocurrido de verdad.

---

### WP-7 · Responsive

#### WP-7.1 — Tablas financieras en móvil
**Cierra:** E-049, E-050, E-051 · **Verifica:** E-052

Verificado: `/dashboard/my-investments` usa una `<Table>` de 8 columnas dentro de
`overflow-x-auto`, sin alternativa móvil; y las tarjetas de resumen aplican `truncate`
sobre los importes (línea ~326).

- **E-049 · Quitar `truncate` de todo importe.** Un dashboard financiero no puede ocultar
  parte del monto. Prioridad de ancho al valor; que envuelva o reduzca escala, nunca elipsis.
- **E-050 · Bajo `lg`, sustituir la tabla por tarjetas.** Nombre del activo a ancho
  completo arriba; la fecha debajo, en secundario: `Oficina San Borja · 27 may. 2026`.
- **E-051 · Reducir el padding vertical** de las tarjetas móviles sin tocar la tipografía,
  manteniendo separación entre ellas.
- **E-052 · No romper:** las tres métricas ya se apilan bien a una columna.

#### WP-7.2 — Densidad y cabecera móvil
**Cierra:** E-048, L-039, P-031, P-032 · **Verifica:** E-047, L-040

- **E-048 · Bloque Premium en móvil** ocupa casi una pantalla completa. Reducir a título +
  una frase + máximo 2 beneficios + «Conocer Premium» (ya cubierto por WP-2.2).
- **P-031 · Saludo fragmentado:** agrupar nombre y emoji en un contenedor sin salto
  (`whitespace-nowrap`); el badge Premium debajo o al lado solo si cabe.
- **P-032 · Los dos cards superiores** consumen casi todo el ancho. Al eliminar el botón
  Premium redundante (WP-6.1), dejar «Nueva inversión» a ancho completo.
- **L-039 · Registro largo en móvil:** evaluar división por etapas o simplificación visual.
- **E-047 · Ya resuelto:** el FAB de apariencia está tras
  `NEXT_PUBLIC_ENABLE_APPEARANCE_FAB` y apagado en producción
  (`src/app/layout.tsx`). **Solo verificar que la variable no esté activa en producción.**

---

### WP-8 · Narrativa comercial dentro de la cuenta
**Cierra:** E-025, E-026, E-027, E-029, E-030, E-031 · **Avanza:** E-028

El hilo que recorre la hoja Estándar: el producto se define casi solo por rendimiento
(+22.7%, ROI de 17–24%, Premium hasta 52%), y la cuenta Estándar aparece como una versión
recortada de Premium.

| ID | Cambio |
|---|---|
| E-025 | Promesa recurrente del dashboard: **«Sigue cada etapa de tus inversiones desde un solo lugar»**, respaldada con accesos reales a estado, documentos, movimientos y actualizaciones. Ese es el valor de la cuenta *después* de invertir |
| E-026 | **«Tu cuenta Estándar»** con beneficios propios (oportunidades verificadas, seguimiento de inversiones y retornos). Premium se presenta después como modalidad adicional, no como corrección de una cuenta inferior |
| E-027 | **«Comparar Estándar vs. Premium»**: qué mantiene, qué añade, qué condiciones cambian. Hoy el usuario debe inferirlo |
| E-028 | Rebalancear el discurso hacia pilares permanentes: «Lo que Rematto gestiona por ti» · «Seguimiento» · «Actualizaciones de cada proceso». La rentabilidad sigue siendo un dato de cada inversión, no el mensaje de todas las secciones |
| E-029 | Renombrar «Actividad reciente» → **«Últimas actualizaciones de tu cuenta»**, priorizar eventos ligados a las inversiones del usuario y añadir la línea explicativa |
| E-030 | **«Oportunidades que podrían interesarte»** con el motivo explícito: «En soles · Desde S/ 500 · Distrito que ya has consultado» |
| E-031 | Si no hay tarifa periódica, **«Cuenta Estándar»** y **«Acceso Premium»**, no «Plan». El lenguaje de planes sugiere una suscripción que no existe |

---

## 6. Dependencias entre paquetes

```
WP-0.1 ─┬─> WP-2.2 ──> WP-2.3
        └─> WP-4.2
WP-0.2a ─> WP-2.3, WP-4.3, WP-5.2, WP-6.4(P-025)
WP-0.2b ─> WP-4.3
WP-0.2c ─> WP-3.1, WP-3.2, WP-3.3, WP-6.2(P-017), WP-6.3
WP-0.2d ─> WP-6.4
WP-0.3  ─> WP-2.2, WP-2.3, WP-7.1
WP-2.1  ─> WP-2.2 (el CTA unificado depende de la nueva IA)
WP-6.1  ─> WP-7.2 (P-032 depende de eliminar el botón redundante)
```

**Independientes, se pueden paralelizar desde el día 1:** WP-1.1, WP-1.2, WP-1.3, WP-1.4,
WP-7.1, WP-8.

---

## 7. Bloqueantes externos

Estos no se pueden cerrar solo con código. Conviene abrirlos ya:

| ID | Necesita | Por qué |
|---|---|---|
| P-010 | **Legal** | Definir el derecho económico/jurídico exacto que adquiere un inversionista Premium |
| P-021 | **Legal + Finanzas** | Custodia de fondos: quién recibe, concilia y devuelve |
| E-035 | **Legal** | Redacción del bloque de riesgos previo a invertir |
| L-004 | **Operaciones** | Plazo real de verificación (hoy el producto promete 2–4 h y 24 h a la vez) |
| L-033 | **Backend** | Rate limiting / bloqueo progresivo |
| P-027, P-030 | **Finanzas + proveedor de pagos** | Límites reales por método y política de pagos fraccionados |
| E-036, P-017 | **Finanzas** | Supuestos y costos reales que sustentan cada ROI publicado |

---

## 8. Orden de ejecución sugerido

| Fase | Paquetes | Por qué en este orden |
|---|---|---|
| **1 — Fundaciones** | WP-0.1, WP-0.2, WP-0.3 | Bloquean casi todo. Sin el modelo, el resto son parches |
| **2 — Integridad** | WP-4.1, WP-4.2, WP-5.1, **P-022** (privacidad) | Errores de datos, dinero y privacidad visibles hoy en producción |
| **3 — Arquitectura** | WP-2.1, WP-2.2, WP-2.3, WP-6.1 | La reorganización mayor, ya sobre datos fiables |
| **4 — Confianza** | WP-3.1, WP-3.2, WP-3.3, WP-4.3, WP-6.3 | Evidencia y escenarios adversos |
| **5 — Flujos** | WP-5.2, WP-5.3, WP-6.4, WP-1.4 | Funcionalidad y liquidación de alto valor |
| **6 — Narrativa** | WP-8, WP-6.2, WP-1.1, WP-1.2, WP-1.3 | Copy, sobre la estructura ya correcta |
| **7 — Responsive** | WP-7.1, WP-7.2 | Al final, pero verificando en móvil durante todas las fases |

**Nota sobre P-022.** Aunque pertenece a WP-6.3, la exposición del nombre de quien capturó
una operación de alto valor debería tratarse por separado y antes: es un cambio de dos
líneas y un problema de privacidad, no de diseño.

---

## 9. Checklist de cierre por paquete

Antes de dar un paquete por terminado:

**Funcional**
- [ ] `npm run build` y `npm run lint` pasan limpios
- [ ] Ningún dato en pantalla está hardcodeado en un componente
- [ ] Los IDs del paquete están marcados en `findings-ledger.md`
- [ ] Los hallazgos `NO ROMPER` del área siguen intactos

**Diseño (prioridad `ui-ux-pro-max`)**
- [ ] Contraste ≥ 4.5:1 en texto; ≥ 3:1 en bordes de control
- [ ] Áreas táctiles ≥ 44×44 px con ≥ 8 px de separación
- [ ] Foco de teclado visible en todo elemento interactivo
- [ ] Una sola cifra dominante por tarjeta; números con `tabular-nums`
- [ ] Sin scroll horizontal entre 320 px y 1920 px
- [ ] Estados de carga, vacío y error diseñados, no en blanco
- [ ] Solo tokens semánticos; ningún hex crudo en componentes
- [ ] Se respeta `prefers-reduced-motion`

**Producto**
- [ ] Toda cifra declara su naturaleza (estimado / acreditado / bruto / neto)
- [ ] Todo porcentaje tiene metodología consultable
- [ ] Todo escenario adverso tiene representación visual, no solo el favorable
- [ ] Ninguna afirmación de confianza sin evidencia consultable detrás
- [ ] Ningún dato personal de un usuario visible para otro

**Modo oscuro.** El proyecto tiene `.dark` en `globals.css` y un selector de tema.
Cada pantalla tocada debe revisarse en ambos modos.

---

## 10. Resumen

| | |
|---|---|
| Hallazgos totales | **124** |
| Verificados abiertos | 93 |
| Parcialmente resueltos | 18 |
| Ya resueltos (solo verificar) | 9 |
| Aciertos a preservar | 4 |
| Paquetes de trabajo | 25, en 8 grupos |
| Causas raíz | 8 |
| Bloqueantes externos | 7 |
