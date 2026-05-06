"use client";

import { motion } from "framer-motion";
import { Search, UserCheck, Banknote, Trophy } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    step: "01",
    title: "Crea tu cuenta y verifica tu identidad",
    desc:
      "Regístrate en minutos. Sube tu DNI y completa la verificación KYC para acceder a todas las subastas disponibles.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Search,
    step: "02",
    title: "Explora propiedades verificadas",
    desc:
      "Navega nuestro catálogo de propiedades en remate judicial. Cada una auditada legalmente con documentos disponibles.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Banknote,
    step: "03",
    title: "Invierte desde S/ 500",
    desc:
      "Elige el monto a invertir. Procesamos tu pago de forma segura y registramos tu participación en la subasta.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Recibe tus retornos",
    desc:
      "Una vez adjudicada la propiedad, recibes tu retorno proporcional directamente en tu cuenta Remata.",
    color: "bg-purple-50 text-purple-600",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 gradient-hero">
      <div className="mx-auto max-w-7xl section-padding">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center gap-4 mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Proceso simple
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-foreground text-balance">
            De cero a tu primera inversión
            <br />
            en menos de 10 minutos
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg">
            Hemos simplificado cada paso para que puedas invertir con
            confianza, sin complicaciones.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-border/80 z-0" />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative z-10 flex flex-col gap-4 rounded-2xl bg-white border border-border/60 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={`size-11 rounded-xl flex items-center justify-center ${s.color.split(" ")[0]}`}>
                  <s.icon className={`size-5 ${s.color.split(" ")[1]}`} />
                </div>
                <span className="text-3xl font-black text-border/80">{s.step}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm leading-snug mb-1.5">{s.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
