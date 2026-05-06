"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  Layers,
  BarChart3,
  Clock,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Inversión 100% asegurada",
    desc: "Cada inversión está respaldada por garantías legales. Tu capital está protegido durante todo el proceso de subasta.",
    highlight: true,
  },
  {
    icon: FileText,
    title: "Proceso legal transparente",
    desc: "Accede a toda la documentación judicial: expedientes, tasaciones y estado del proceso en tiempo real.",
    highlight: false,
  },
  {
    icon: Layers,
    title: "Inversión fraccionada",
    desc: "No necesitas comprar una propiedad entera. Invierte desde S/ 500 y diversifica en múltiples propiedades.",
    highlight: false,
  },
  {
    icon: BarChart3,
    title: "Retornos competitivos",
    desc: "Retornos promedio de 18–22% anual, muy por encima de los instrumentos financieros tradicionales.",
    highlight: false,
  },
  {
    icon: Clock,
    title: "Ciclos cortos de inversión",
    desc: "La mayoría de procesos se resuelven en 3–8 meses, ideal para quienes buscan liquidez y rotación de capital.",
    highlight: false,
  },
  {
    icon: Headphones,
    title: "Soporte especializado",
    desc: "Nuestro equipo de asesores legales y financieros está disponible para resolver cualquier duda en tiempo real.",
    highlight: false,
  },
];

export function Features() {
  return (
    <section id="nosotros" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl section-padding">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center gap-4 mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Por qué Remata
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-foreground text-balance">
            Todo lo que necesitas para invertir
            <br />
            de forma inteligente
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg">
            Combinamos tecnología financiera con experiencia legal para darte
            la ventaja en cada subasta.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`flex flex-col gap-4 rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                f.highlight
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 border-border/60 hover:border-primary/30"
              }`}
            >
              <div
                className={`size-11 rounded-xl flex items-center justify-center ${
                  f.highlight ? "bg-primary-foreground/15" : "bg-primary/10"
                }`}
              >
                <f.icon
                  className={`size-5 ${
                    f.highlight ? "text-primary-foreground" : "text-primary"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`font-semibold text-sm mb-2 ${
                    f.highlight ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {f.title}
                </p>
                <p
                  className={`text-sm leading-relaxed ${
                    f.highlight ? "text-primary-foreground/75" : "text-muted-foreground"
                  }`}
                >
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
