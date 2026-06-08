"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, Search, MessageCircle, BookOpen } from "lucide-react";
import { useState } from "react";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { LegalCTA } from "@/components/landing/legal/LegalCTA";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

const faqCategories = [
  {
    id: "general",
    label: "General",
    questions: [
      {
        q: "¿Qué es Remata?",
        a: "Remata es una plataforma fintech peruana que permite invertir en remates judiciales inmobiliarios de forma colectiva. Puedes participar con montos desde S/ 500 y diversificar tu portafolio en propiedades verificadas legalmente.",
      },
      {
        q: "¿Es seguro invertir en remates judiciales?",
        a: "Toda inversión conlleva riesgos. Sin embargo, Remata mitiga estos riesgos mediante due diligence legal exhaustivo en cada propiedad, supervisión de la SBS y un proceso de verificación riguroso. Los retornos históricos promedian entre 15% y 25% anual, pero no garantizan resultados futuros.",
      },
      {
        q: "¿Cuál es el monto mínimo de inversión?",
        a: "El monto mínimo es S/ 500 por propiedad. Puedes invertir en múltiples propiedades para diversificar tu portafolio.",
      },
    ],
  },
  {
    id: "cuenta",
    label: "Cuenta y verificación",
    questions: [
      {
        q: "¿Cómo verifico mi identidad (KYC)?",
        a: "Después de registrarte, ve a tu perfil y completa la verificación subiendo fotos de tu DNI (anverso y reverso) y una selfie. El proceso es automático y la mayoría se aprueba en menos de 24 horas hábiles.",
      },
      {
        q: "¿Puedo invertir si soy extranjero?",
        a: "Sí, con carné de extranjería (CE) o pasaporte válido. Debes tener una cuenta bancaria en Perú para recibir retornos.",
      },
      {
        q: "¿Cómo recupero mi contraseña?",
        a: "En la página de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?' e ingresa tu correo. Recibirás un enlace para restablecerla.",
      },
    ],
  },
  {
    id: "inversiones",
    label: "Inversiones y pagos",
    questions: [
      {
        q: "¿Qué métodos de pago aceptan?",
        a: "Aceptamos transferencia bancaria, depósito en ventanilla, Yape y tarjeta de crédito/débito. Las transferencias se confirman en 1-3 días hábiles; Yape y tarjeta son instantáneos.",
      },
      {
        q: "¿Cuándo recibo mis retornos?",
        a: "Los retornos se distribuyen una vez adjudicada la propiedad en el remate judicial y completado el proceso de transferencia registral. Este proceso puede tomar entre 3 y 12 meses dependiendo del caso.",
      },
      {
        q: "¿Qué pasa si la subasta no se adjudica?",
        a: "Si la subasta se declara desierta o no se alcanza el precio base, tu inversión se devuelve íntegramente a tu cuenta Remata, sin comisiones.",
      },
    ],
  },
  {
    id: "legal",
    label: "Legal y regulación",
    questions: [
      {
        q: "¿Remata está regulado?",
        a: "Sí, estamos registrados y supervisados por la SBS (Superintendencia de Banca, Seguros y AFP). Cumplimos con las normativas AML/KYC y reportamos a la UIF-Perú cuando corresponde.",
      },
      {
        q: "¿Cómo se aplican los impuestos?",
        a: "Los retornos están sujetos a retención del 5% de impuesto a la renta. Remata emite certificados de retención anuales para tu declaración tributaria.",
      },
      {
        q: "¿Dónde presento un reclamo?",
        a: "Puedes usar nuestro Libro de Reclamaciones virtual en cualquier momento. También puedes contactar a soporte@remata.pe o llamar al (01) 700-REMATA.",
      },
    ],
  },
];

export default function PreguntasFrecuentesPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (item) =>
          !search ||
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <LegalPageLayout>
      <LegalPageHero
        badge="Ayuda"
        badgeIcon="HelpCircle"
        title="Preguntas frecuentes"
        description="Respuestas claras a las dudas más comunes. Si no encuentras lo que buscas, estamos aquí para ayudarte."
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Preguntas frecuentes" },
        ]}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl section-padding">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-10"
          >
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#163300]/40" />
            <Input
              placeholder="Buscar en preguntas frecuentes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 rounded-2xl border-[#163300]/10 bg-white pl-12 text-base shadow-sm focus-visible:ring-[#9FE870]"
            />
          </motion.div>

          {filteredCategories.length === 0 ? (
            <div className="rounded-2xl border border-[#163300]/8 bg-white p-12 text-center">
              <HelpCircle className="mx-auto mb-4 size-10 text-[#163300]/20" />
              <p className="font-medium text-[#163300]">No encontramos resultados</p>
              <p className="mt-2 text-sm text-[#163300]/60">
                Prueba con otras palabras o{" "}
                <Link href="/libro-de-reclamaciones" className="font-medium underline">
                  contáctanos directamente
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCategories.map((category, catIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIndex * 0.05 }}
                >
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#163300]/50">
                    <BookOpen className="size-4" />
                    {category.label}
                  </h2>
                  <div className="overflow-hidden rounded-2xl border border-[#163300]/8 bg-white shadow-sm">
                    <Accordion type="single" collapsible>
                      {category.questions.map((item, i) => (
                        <AccordionItem
                          key={item.q}
                          value={`${category.id}-${i}`}
                          className="border-[#163300]/8 px-5 last:border-b-0"
                        >
                          <AccordionTrigger className="py-5 text-left text-base font-semibold text-[#163300] hover:no-underline hover:text-[#163300]/80">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="pb-5 text-[#163300]/70 leading-relaxed">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 rounded-2xl border border-[#9FE870]/30 bg-[#9FE870]/10 p-6 sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#9FE870]/30">
                  <MessageCircle className="size-6 text-[#163300]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#163300]">¿Aún tienes dudas?</h3>
                  <p className="mt-1 text-sm text-[#163300]/65">
                    Nuestro equipo responde en menos de 24 horas hábiles.
                  </p>
                </div>
              </div>
              <Link
                href="/libro-de-reclamaciones"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#163300] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#163300]/90"
              >
                Libro de reclamaciones
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <LegalCTA
        title="Empieza a invertir hoy"
        description="Crea tu cuenta gratis y explora propiedades verificadas en remate judicial."
        secondaryLabel="Ver cumplimiento regulatorio"
        secondaryHref="/cumplimiento-regulatorio"
      />
    </LegalPageLayout>
  );
}
