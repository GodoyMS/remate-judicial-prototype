"use client";

import { motion } from "framer-motion";
import { Star, Quote, Users } from "lucide-react";

const testimonials = [
  {
    name: "María Elena Quispe",
    role: "Inversionista independiente",
    avatar: "ME",
    review:
      "Nunca pensé que podría invertir en propiedades con tan poco capital. En mi primera subasta obtuve un retorno del 19%. El proceso fue transparente y el soporte legal excelente.",
    stars: 5,
    amount: "S/ 12,500 invertido",
  },
  {
    name: "Carlos Rodríguez V.",
    role: "Empresario, Lima",
    avatar: "CR",
    review:
      "Llevo 8 meses en Remata y ya tengo 4 inversiones activas. La plataforma es intuitiva, la documentación siempre está disponible y los retornos superan cualquier instrumento bancario.",
    stars: 5,
    amount: "S/ 45,000 invertido",
  },
  {
    name: "Ana Sofía Torres",
    role: "Consultora financiera",
    avatar: "AT",
    review:
      "Como asesora financiera, recomiendo Remata a mis clientes que buscan diversificación. El marco legal es sólido, los procesos son claros y el equipo siempre responde.",
    stars: 5,
    amount: "S/ 78,000 gestionado",
  },
];

const counters = [
  { value: "S/ 48M+", label: "En propiedades subastadas" },
  { value: "3,200+", label: "Inversores activos" },
  { value: "94%", label: "Tasa de éxito en subastas" },
  { value: "18%", label: "Retorno promedio anual" },
];

export function SocialProof() {
  return (
    <section className="bg-[#F5F9F2] py-24">
      <div className="mx-auto max-w-7xl section-padding">
        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {counters.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl border border-[#163300]/8 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="pointer-events-none absolute -right-4 -top-4 size-20 rounded-full bg-[#9FE870]/15" />
              <span className="relative text-3xl font-bold tracking-tight text-[#163300] sm:text-4xl">
                {c.value}
              </span>
              <span className="relative mt-1 block text-sm text-[#163300]/55">
                {c.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 flex max-w-xl flex-col items-center text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#163300]/15 bg-[#9FE870]/20 px-4 py-1.5">
            <Users className="size-3.5 text-[#163300]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#163300]">
              Testimonios
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-[#163300] sm:text-5xl">
            Lo que dicen nuestros{" "}
            <span className="text-[#5a8f3c]">inversores</span>
          </h2>
        </motion.div>

        {/* Testimonials */}
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group flex flex-col gap-5 rounded-2xl border border-[#163300]/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9FE870]/40 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <Quote className="size-8 text-[#9FE870]/50" />
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star
                      key={j}
                      className="size-3.5 fill-[#9FE870] text-[#9FE870]"
                    />
                  ))}
                </div>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-[#163300]/80">
                &ldquo;{t.review}&rdquo;
              </p>

              <div className="flex items-center gap-3 border-t border-[#163300]/8 pt-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#163300] text-sm font-bold text-[#9FE870]">
                  {t.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#163300]">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#163300]/50">{t.role}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#9FE870]/25 px-2.5 py-1 text-[10px] font-semibold text-[#163300]">
                  {t.amount}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
