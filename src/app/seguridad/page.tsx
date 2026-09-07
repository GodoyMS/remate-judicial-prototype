import Link from "next/link";
import {
  Fingerprint,
  KeySquare,
  Landmark,
  Lock,
  ScrollText,
  ServerCog,
  type LucideIcon,
} from "lucide-react";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { LegalCTA } from "@/components/landing/legal/LegalCTA";
import { BRAND_NAME, CONTACT } from "@/lib/brand";

export const metadata = {
  title: `Seguridad | ${BRAND_NAME}`,
  description:
    "Qué controles de seguridad están implementados en la plataforma, con qué alcance, y qué no afirmamos.",
};

/**
 * Security — second review, finding 25.
 *
 * Very specific technical controls were published across the product ("AES-256",
 * "SSL 256-bit") with no scope and nothing a reader could check, which reads
 * as security theatre. This page states each control in terms of what it
 * protects and where it applies, and closes with an explicit list of what the
 * platform does *not* claim — certifications it does not hold. Saying what is
 * not certified is what makes the rest credible.
 */

type Control = {
  icon: LucideIcon;
  title: string;
  scope: string;
  what: string;
};

const CONTROLS: Control[] = [
  {
    icon: Lock,
    title: "Cifrado del tráfico y de los datos guardados",
    scope: "Toda la plataforma web y la base de datos",
    what: "La conexión entre tu dispositivo y la plataforma va cifrada con TLS. Los datos personales y los documentos de identidad se guardan cifrados en reposo, de modo que el archivo no es legible fuera de la aplicación.",
  },
  {
    icon: KeySquare,
    title: "Acceso mínimo necesario, con doble factor",
    scope: "Personal interno con acceso a datos de inversionistas",
    what: "Cada rol accede solo a lo que su función requiere y el acceso al panel administrativo exige un segundo factor de autenticación. El área comercial no ve documentos de identidad.",
  },
  {
    icon: ScrollText,
    title: "Registro de accesos a documentos sensibles",
    scope: "DNI, selfie y documentación de verificación",
    what: "Cada consulta a un documento de identidad queda registrada con usuario, fecha y motivo. Ese registro es revisable ante cualquier reclamo sobre el uso de tus datos.",
  },
  {
    icon: Fingerprint,
    title: "Verificación de identidad con revisión humana",
    scope: "Alta de cuenta y cambios de datos bancarios",
    what: "La verificación no es solo automática: un analista revisa la coincidencia entre documento y selfie antes de habilitar una cuenta, y cualquier cambio de cuenta bancaria de destino se vuelve a verificar.",
  },
  {
    icon: Landmark,
    title: "Separación de fondos",
    scope: "Aportes antes de aplicarse a una operación",
    what: "Los aportes se mantienen en cuentas de custodia identificadas como cuentas de terceros, separadas de las cuentas operativas de la empresa. No se usan para gastos corrientes.",
  },
  {
    icon: ServerCog,
    title: "Copias de seguridad y recuperación",
    scope: "Base de datos y documentos de operaciones",
    what: "Se realizan copias de seguridad cifradas con periodicidad diaria y se conservan según el plazo legal aplicable, con un procedimiento de restauración probado.",
  },
];

const NOT_CLAIMED = [
  "No contamos, a la fecha, con certificación ISO/IEC 27001 ni con un informe SOC 2. Si obtenemos alguna, lo publicaremos aquí con el certificado.",
  "Ninguna entidad del Estado supervisa, respalda ni garantiza la plataforma ni las inversiones ofrecidas.",
  "Ningún control técnico elimina el riesgo de la inversión: el capital sigue expuesto al resultado del proceso judicial y de la venta posterior.",
];

export default function SeguridadPage() {
  return (
    <LegalPageLayout>
      <LegalPageHero
        badge="Seguridad"
        badgeIcon="Lock"
        title="Cómo protegemos tu información y tu dinero"
        description="Los controles que están implementados hoy, con el alcance de cada uno — y lo que no afirmamos, para que puedas ponderarlo tú."
        breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "Seguridad" }]}
      />

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-4xl section-padding">
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {CONTROLS.map((control) => {
              const Icon = control.icon;
              return (
                <li
                  key={control.title}
                  className="flex flex-col rounded-2xl border border-border bg-card p-5 sm:p-6"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" strokeWidth={2.1} />
                  </span>
                  <h3 className="mt-4 text-base font-bold tracking-tight text-balance text-foreground">
                    {control.title}
                  </h3>
                  <p className="type-caption mt-2 rounded-lg bg-muted px-2.5 py-1.5 text-muted-foreground">
                    Alcance: {control.scope}
                  </p>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {control.what}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-4xl section-padding">
        <div className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 p-6">
            <h3 className="type-h3 text-foreground">
              ¿Encontraste una vulnerabilidad?
            </h3>
            <p className="mt-2 type-body text-muted-foreground">
              Escríbenos a{" "}
              <a
                href={`mailto:${CONTACT.securityEmail}`}
                className="font-semibold text-primary underline underline-offset-2"
              >
                {CONTACT.securityEmail}
              </a>{" "}
              con el detalle técnico. Respondemos en un máximo de 72 horas
              hábiles y no emprendemos acciones contra quien reporta de buena fe.
            </p>
            <p className="type-caption mt-4 text-muted-foreground">
              Para consultas sobre el tratamiento de tus datos personales,
              revisa la{" "}
              <Link
                href="/politica-de-privacidad"
                className="font-medium text-primary underline underline-offset-2"
              >
                política de privacidad
              </Link>
              .
            </p>
          </div>
        </div>
     
      </section>

     
      <LegalCTA
        title="¿Dudas sobre cómo tratamos tu información?"
        description="Puedes preguntarnos antes de crear una cuenta y de entregar cualquier documento."
        primaryLabel="Hablar con el equipo"
        primaryHref="/contacto"
        secondaryLabel="Ver política de privacidad"
        secondaryHref="/politica-de-privacidad"
      />
    </LegalPageLayout>
  );
}
