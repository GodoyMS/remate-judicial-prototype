"use client";

import { motion } from "framer-motion";
import { Search, UserCheck, Banknote, Trophy, Zap } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    step: "01",
    title: "Crea tu cuenta y verifica tu identidad",
    desc: "Regístrate en minutos. Sube tu DNI y completa la verificación KYC para acceder a todas las subastas disponibles.",
  },
  {
    icon: Search,
    step: "02",
    title: "Explora propiedades verificadas",
    desc: "Navega nuestro catálogo de propiedades en remate judicial. Cada una auditada legalmente con documentos disponibles.",
  },
  {
    icon: Banknote,
    step: "03",
    title: "Invierte desde S/ 500",
    desc: "Elige el monto a invertir. Procesamos tu pago de forma segura y registramos tu participación en la subasta.",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Recibe tus retornos",
    desc: "Una vez adjudicada la propiedad, recibes tu retorno proporcional directamente en tu cuenta Remata.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative overflow-hidden bg-[#F5F9F2] py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(22,51,0,0.06) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -right-32 top-0 size-80 rounded-full bg-[#9FE870]/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl section-padding">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 flex max-w-2xl flex-col items-center text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#163300]/15 bg-[#9FE870]/20 px-4 py-1.5">
            <Zap className="size-3.5 text-[#163300]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#163300]">
              Proceso simple
            </span>
          </div>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-[#163300] sm:text-5xl">
            De cero a tu primera inversión en{" "}
            <span className="text-[#5a8f3c]">menos de 10 minutos</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#163300]/60">
            Hemos simplificado cada paso para que inviertas con confianza, sin
            complicaciones ni fricción.
          </p>
        </motion.div>

        <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div
            className="pointer-events-none absolute top-[52px] right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent via-[#9FE870] to-transparent lg:block"
            aria-hidden
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative flex flex-col gap-5 rounded-2xl border border-[#163300]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#9FE870]/50 hover:shadow-lg hover:shadow-[#163300]/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#163300] ring-2 ring-[#9FE870]/30 transition-transform group-hover:scale-105">
                  <s.icon className="size-5 text-[#9FE870]" />
                </div>
                <span className="text-4xl font-black leading-none text-[#163300]/10 transition-colors group-hover:text-[#9FE870]/40">
                  {s.step}
                </span>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold leading-snug text-[#163300]">
                  {s.title}
                </p>
                <p className="text-xs leading-relaxed text-[#163300]/55">
                  {s.desc}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute -right-2.5 top-[52px] z-10 hidden size-5 items-center justify-center rounded-full bg-[#9FE870] lg:flex">
                  <div className="size-1.5 rounded-full bg-[#163300]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
