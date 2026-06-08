import {
  FileSearch,
  UserCheck,
  Building2,
  AlertOctagon,
  Scale,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { LegalContentBlock } from "@/components/landing/legal/LegalContentBlock";
import { LegalCTA } from "@/components/landing/legal/LegalCTA";

export const metadata = {
  title: "Cumplimiento regulatorio AML & KYC | Remata",
  description:
    "Conoce cómo Remata cumple con las normativas de prevención de lavado de activos (AML) y verificación de identidad (KYC) en Perú.",
};

const compliancePillars = [
  {
    icon: Building2,
    title: "Supervisión SBS",
    desc: "Registrados y supervisados por la Superintendencia de Banca, Seguros y AFP del Perú.",
  },
  {
    icon: UserCheck,
    title: "KYC robusto",
    desc: "Verificación biométrica de identidad con validación contra RENIEC y listas de sanciones.",
  },
  {
    icon: FileSearch,
    title: "Monitoreo AML",
    desc: "Sistemas automatizados de detección de operaciones inusuales y reportes a la UIF-Perú.",
  },
  {
    icon: Scale,
    title: "Marco legal",
    desc: "Cumplimiento de la Ley N° 27693, Resoluciones SBS y estándares FATF/GAFI.",
  },
];

export default function CumplimientoRegulatorioPage() {
  return (
    <LegalPageLayout>
      <LegalPageHero
        badge="Regulación"
        badgeIcon="ShieldCheck"
        title="Cumplimiento regulatorio AML & KYC"
        description="Invertir en remates judiciales requiere confianza. Por eso operamos bajo el más estricto marco regulatorio peruano."
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Cumplimiento regulatorio" },
        ]}
      />

      <section className="border-b border-[#163300]/8 bg-white py-12">
        <div className="mx-auto max-w-7xl section-padding">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {compliancePillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className="group rounded-2xl border border-[#163300]/8 bg-[#F5F9F2]/50 p-5 transition-all hover:border-[#9FE870]/40 hover:shadow-md"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#9FE870]/25 transition-colors group-hover:bg-[#9FE870]/40">
                  <pillar.icon className="size-5 text-[#163300]" />
                </div>
                <h3 className="font-bold text-[#163300]">{pillar.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#163300]/60">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl section-padding space-y-6">
          <LegalContentBlock icon="UserCheck" title="Proceso KYC (Know Your Customer)" index={0}>
            <p>
              Antes de invertir, cada usuario debe completar nuestro proceso de verificación de
              identidad en tres pasos:
            </p>
            <ol>
              <li>
                <strong>Registro:</strong> datos personales básicos y correo electrónico verificado
              </li>
              <li>
                <strong>Documentación:</strong> carga de DNI, CE o pasaporte (anverso y reverso) con
                validación automática de autenticidad
              </li>
              <li>
                <strong>Verificación biométrica:</strong> selfie en vivo comparada con la foto del
                documento para confirmar identidad
              </li>
            </ol>
            <p>
              El proceso toma menos de 5 minutos y la mayoría de verificaciones se aprueban en
              menos de 24 horas hábiles.
            </p>
          </LegalContentBlock>

          <LegalContentBlock icon="AlertOctagon" title="Prevención AML (Anti-Money Laundering)" index={1}>
            <p>
              Remata implementa un programa integral de prevención de lavado de activos y
              financiamiento del terrorismo (PLAFT) que incluye:
            </p>
            <ul>
              <li>Evaluación de riesgo por cliente y por operación</li>
              <li>Monitoreo continuo de transacciones con umbrales configurables</li>
              <li>Screening contra listas PEP, OFAC, ONU y listas locales</li>
              <li>Reportes de Operaciones Sospechosas (ROS) a la UIF-Perú cuando corresponda</li>
              <li>Capacitación periódica del personal en materia de compliance</li>
            </ul>
          </LegalContentBlock>

          <LegalContentBlock icon="BadgeCheck" title="Due diligence en propiedades" index={2}>
            <p>
              Cada propiedad listada en Remata pasa por un proceso de due diligence legal que
              verifica:
            </p>
            <ul>
              <li>Estado procesal del remate judicial</li>
              <li>Cadena de titularidad y gravámenes</li>
              <li>Valoración independiente del inmueble</li>
              <li>Documentación notarial y registral al día</li>
            </ul>
          </LegalContentBlock>

          <LegalContentBlock icon="ShieldCheck" title="Oficial de cumplimiento" index={3}>
            <p>
              Contamos con un Oficial de Cumplimiento designado, responsable de supervisar la
              implementación del programa PLAFT y servir como punto de contacto con la SBS y la
              UIF-Perú.
            </p>
            <p>
              Para consultas de cumplimiento:{" "}
              <a href="mailto:compliance@remata.pe" className="font-medium text-[#163300] underline">
                compliance@remata.pe
              </a>
            </p>
            <p className="text-sm text-[#163300]/50">
              Última auditoría de cumplimiento: abril 2026 — Sin observaciones
            </p>
          </LegalContentBlock>
        </div>
      </section>

      <LegalCTA
        title="Invierte con respaldo regulatorio"
        description="Tu capital merece una plataforma que cumple con las normas más exigentes del sistema financiero peruano."
        secondaryLabel="Política de privacidad"
        secondaryHref="/politica-de-privacidad"
      />
    </LegalPageLayout>
  );
}
