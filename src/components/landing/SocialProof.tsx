"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { TestimonialsCarousel } from "@/components/landing/TestimonialsCarousel";

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

        {/* Testimonials carousel */}
        <TestimonialsCarousel />
      </div>
    </section>
  );
}
