"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "María Elena Quispe",
    role: "Inversionista independiente",
    avatar: "ME",
    avatarBg: "bg-blue-100 text-blue-700",
    review:
      "Nunca pensé que podría invertir en propiedades con tan poco capital. En mi primera subasta obtuve un retorno del 19%. El proceso fue transparente y el soporte legal excelente.",
    stars: 5,
    amount: "S/ 12,500 invertido",
  },
  {
    name: "Carlos Rodríguez V.",
    role: "Empresario, Lima",
    avatar: "CR",
    avatarBg: "bg-green-100 text-green-700",
    review:
      "Llevo 8 meses en Remata y ya tengo 4 inversiones activas. La plataforma es intuitiva, la documentación siempre está disponible y los retornos superan cualquier instrumento bancario.",
    stars: 5,
    amount: "S/ 45,000 invertido",
  },
  {
    name: "Ana Sofía Torres",
    role: "Consultora financiera",
    avatar: "AT",
    avatarBg: "bg-purple-100 text-purple-700",
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
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl section-padding">
        {/* Counters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {counters.map((c) => (
            <div
              key={c.label}
              className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-muted/30 p-6"
            >
              <span className="text-3xl font-bold text-foreground">{c.value}</span>
              <span className="text-sm text-muted-foreground">{c.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center gap-3 mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Testimonios
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            Lo que dicen nuestros inversores
          </h2>
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="flex flex-col gap-5 rounded-2xl border border-border/60 p-6 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm text-foreground leading-relaxed flex-1">&ldquo;{t.review}&rdquo;</p>

              <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                <div
                  className={`size-10 rounded-full flex items-center justify-center text-sm font-bold ${t.avatarBg}`}
                >
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-1">
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
