"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Award,
  CheckCircle2,
  Lock,
  Scale,
  Building2,
  FileCheck,
  BadgeCheck,
  Landmark,
  Receipt,
  Fingerprint,
  Gavel,
} from "lucide-react";
import { cn } from "@/lib/utils";

const entities = [
  {
    abbr: "PJ",
    name: "Poder Judicial",
    role: "Subastas judiciales",
    category: "Judicial",
  },
  {
    abbr: "SUNARP",
    name: "SUNARP",
    role: "Registro de propiedades",
    category: "Registral",
  },
  {
    abbr: "SBS",
    name: "SBS",
    role: "Supervisión financiera",
    category: "Financiero",
  },
  {
    abbr: "SUNAT",
    name: "SUNAT",
    role: "Cumplimiento tributario",
    category: "Fiscal",
  },
  {
    abbr: "INDECOPI",
    name: "INDECOPI",
    role: "Protección al consumidor",
    category: "Regulatorio",
  },
  {
    abbr: "CNL",
    name: "Colegio Notarial",
    role: "Escrituras y legalización",
    category: "Legal",
  },
  {
    abbr: "UIF",
    name: "UIF-Perú",
    role: "Prevención LA/FT",
    category: "Cumplimiento",
  },
];

const compliancePillars = [
  {
    icon: Gavel,
    title: "Marco legal peruano",
    desc: "Operamos bajo el Código Civil, la Ley de Ejecución de Garantías y normativa de remates judiciales vigente.",
    tag: "Ley peruana",
  },
  {
    icon: Receipt,
    title: "Tributación en regla",
    desc: "Retenciones, declaraciones y reportes alineados con SUNAT. Recibes comprobantes electrónicos por cada operación.",
    tag: "SUNAT",
  },
  {
    icon: Fingerprint,
    title: "KYC & PLAFT",
    desc: "Verificación de identidad y monitoreo antilavado conforme a la UIF y estándares del sector financiero.",
    tag: "UIF-Perú",
  },
  {
    icon: Landmark,
    title: "Supervisión financiera",
    desc: "Procesos de inversión y custodia de fondos bajo estándares exigidos por la SBS y mejores prácticas fintech.",
    tag: "SBS",
  },
];

const trustSignals = [
  {
    icon: Shield,
    title: "Plataforma regulada",
    desc: "Supervisión y estándares del ecosistema financiero peruano",
  },
  {
    icon: Lock,
    title: "Encriptación bancaria",
    desc: "AES-256 y comunicaciones TLS en toda tu información",
  },
  {
    icon: FileCheck,
    title: "Expedientes auditados",
    desc: "Cada propiedad revisada por abogados especializados en remates",
  },
  {
    icon: Award,
    title: "Red legal certificada",
    desc: "Aliados con estudios jurídicos líderes en derecho inmobiliario",
  },
];

const guarantees = [
  "Contratos con validez legal en Perú",
  "Trazabilidad de cada inversión",
  "Reportes fiscales descargables",
  "Auditoría documental en tiempo real",
];

function EntityCard({
  entity,
  className,
}: {
  entity: (typeof entities)[number];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-lg bg-[#9FE870]/15 ring-1 ring-[#9FE870]/25">
        <span className="text-[10px] font-bold tracking-tight text-[#9FE870]">
          {entity.abbr}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{entity.name}</p>
        <p className="text-xs text-white/50">{entity.role}</p>
      </div>
      <span className="ml-1 hidden rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-medium text-white/60 sm:inline">
        {entity.category}
      </span>
    </div>
  );
}

function Marquee() {
  const track = [...entities, ...entities];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#163300] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#163300] to-transparent sm:w-24" />
      <motion.div
        className="flex w-max gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {track.map((entity, i) => (
          <EntityCard key={`${entity.abbr}-${i}`} entity={entity} />
        ))}
      </motion.div>
    </div>
  );
}

export function TrustSection() {
  return (
    <section
      id="confianza"
      className="relative overflow-hidden bg-[#163300] py-24 text-white"
    >
      {/* Background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(159,232,112,0.12) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 right-0 size-[480px] rounded-full bg-[#9FE870]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-0 size-[360px] rounded-full bg-[#9FE870]/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 flex max-w-3xl flex-col items-center text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#9FE870]/30 bg-[#9FE870]/10 px-4 py-1.5">
            <BadgeCheck className="size-3.5 text-[#9FE870]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9FE870]">
              Regulación & cumplimiento · Perú
            </span>
          </div>
          <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Invierte con la tranquilidad de una{" "}
            <span className="text-[#9FE870]">plataforma 100% legal</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/65">
            Cada operación en Remata está alineada con entidades del Estado
            peruano, la legislación vigente y las obligaciones fiscales del país.
            Transparencia, trazabilidad y estándares de nivel fintech.
          </p>
        </motion.div>

        {/* Main grid: compliance stack + guarantees */}
        <div className="mb-16 grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Compliance pillars — bento */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid gap-4 sm:grid-cols-2 lg:col-span-8"
          >
            {compliancePillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-[#9FE870]/30 hover:bg-white/[0.07]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#9FE870]/15 ring-1 ring-[#9FE870]/20 transition-transform group-hover:scale-105">
                    <pillar.icon className="size-5 text-[#9FE870]" />
                  </div>
                  <span className="rounded-full bg-[#9FE870]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#9FE870]">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Side panel — legal seal + checklist */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col rounded-2xl border border-[#9FE870]/25 bg-gradient-to-b from-[#9FE870]/12 to-transparent p-6 lg:col-span-4"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="relative flex size-14 items-center justify-center rounded-2xl bg-[#9FE870]/20 ring-2 ring-[#9FE870]/30">
                <Scale className="size-7 text-[#9FE870]" />
                <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[#9FE870]">
                  <CheckCircle2 className="size-3 text-[#163300]" strokeWidth={3} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#9FE870]">
                  Certificación operativa
                </p>
                <p className="text-xs text-white/50">
                  Validado bajo normativa peruana
                </p>
              </div>
            </div>

            <ul className="flex flex-1 flex-col gap-3">
              {guarantees.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#9FE870]" />
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <Building2 className="size-5 shrink-0 text-[#9FE870]" />
              <p className="text-xs leading-relaxed text-white/55">
                Integrados con{" "}
                <strong className="font-semibold text-white/90">
                  entidades oficiales del Estado Peruano
                </strong>{" "}
                para garantizar legitimidad en cada etapa del proceso.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Entity marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-white/40">
            Aliados regulatorios & institucionales
          </p>
          <Marquee />
        </motion.div>

        {/* Trust signals */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustSignals.map((signal, i) => (
            <motion.div
              key={signal.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.04] p-5 transition-colors hover:border-[#9FE870]/25 hover:bg-white/[0.06]"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#9FE870]/15">
                <signal.icon className="size-5 text-[#9FE870]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {signal.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  {signal.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
