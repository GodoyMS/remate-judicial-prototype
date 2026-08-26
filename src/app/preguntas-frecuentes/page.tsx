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
        q: "¿Qué es Rematto?",
        a: "Rematto es una plataforma fintech peruana que permite invertir en remates judiciales inmobiliarios de forma colectiva. Puedes participar con montos desde S/ 500 y diversificar tu portafolio en propiedades verificadas legalmente.",
      },
      {
        q: "¿Es seguro invertir en remates judiciales?",
        a: "No. Toda inversión en remates judiciales conlleva riesgo de pérdida parcial o total del capital, y los plazos dependen de procesos judiciales que no controlamos. Lo que sí hacemos es reducir riesgos evitables: estudio de títulos de cada expediente, revisión de cargas en SUNARP y publicación del expediente judicial para que puedas verificarlo. Los retornos históricos no garantizan resultados futuros. Lee la política de riesgos antes de invertir.",
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
        a: "Si la subasta se declara desierta, o si otro postor supera el techo de puja definido para la operación, se devuelve el 100% de tu aporte sin comisiones, en un máximo de 10 días hábiles.",
      },
      {
        q: "¿Y si el pool no llega a completarse?",
        a: "Si el capital objetivo no se reúne antes del cierre de la convocatoria, la operación no se ejecuta y se devuelve el 100% de tu aporte, sin comisión, en un máximo de 5 días hábiles. No cobramos por operaciones que no llegaron a ejecutarse.",
      },
      {
        q: "¿Qué pasa si el proceso judicial se suspende?",
        a: "El juzgado puede suspender, reprogramar o anular un remate — por ejemplo si el deudor paga la deuda, aparece una tercería o se apela una resolución. Tu capital permanece íntegro en la cuenta de custodia y puedes elegir entre esperar la reprogramación o solicitar la devolución. Una reprogramación suele añadir entre 1 y 6 meses.",
      },
      {
        q: "¿Qué pasa si la propiedad se vende por debajo de lo estimado?",
        a: "El retorno es menor al proyectado y puede ser negativo: es posible recuperar menos de lo aportado. El resultado, positivo o negativo, se reparte a prorrata entre todos los participantes del pool. Los porcentajes publicados son estimaciones referenciales, no una garantía.",
      },
      {
        q: "¿Qué pasa si la venta demora más de lo previsto?",
        a: "El capital permanece invertido en el activo y el retorno anualizado baja, porque el mismo margen se reparte en más meses. La causa más común de demora es la entrega de la posesión cuando el inmueble está ocupado, que requiere un lanzamiento judicial.",
      },
      {
        q: "¿Puedo retirar mi dinero antes de que termine la operación?",
        a: "Antes de la adjudicación, sí: puedes solicitar la devolución de tu aporte. Después no. Es una inversión ilíquida y hoy no existe un mercado secundario donde vender tu participación. Invierte solo capital que no vayas a necesitar durante el plazo estimado.",
      },
      {
        q: "¿Cuánto dura una operación de principio a fin?",
        a: "Entre 12 y 24 meses en un caso típico: apertura del pool, remate, inscripción de la adjudicación, entrega de la posesión, comercialización y liquidación. Los plazos dependen de tiempos judiciales que no controlamos.",
      },
    ],
  },
  {
    id: "custodia",
    label: "Tu dinero y tus documentos",
    questions: [
      {
        q: "¿Dónde está mi dinero mientras la operación avanza?",
        a: "Antes de la subasta, en una cuenta de custodia separada del patrimonio de Rematto. Durante el remate, comprometido como respaldo de la puja. Tras la adjudicación, representado en tu participación sobre el inmueble. Al cierre, se descuentan gastos y comisiones y el saldo se transfiere a tu cuenta bancaria.",
      },
      {
        q: "¿Qué documento respalda mi participación?",
        a: "Un contrato de inversión con validez legal peruana, firmado electrónicamente, que identifica la operación, el expediente judicial, tu monto aportado y el porcentaje de participación que te corresponde. Queda disponible para descarga en tu panel.",
      },
      {
        q: "¿Qué pasa con mi inversión si Rematto deja de operar?",
        a: "Los aportes se mantienen en cuentas de custodia separadas del patrimonio de la empresa, y tu participación sobre un inmueble adjudicado está respaldada por el contrato de inversión y el título de adjudicación. Ante cualquier duda sobre este punto antes de invertir, escríbenos y lo revisamos contigo.",
      },
      {
        q: "¿Puedo invertir montos altos? ¿Hay límites?",
        a: "No hay un tope por inversor, pero sí un capital objetivo por operación: cuando se completa, la convocatoria se cierra. Para montos elevados recomendamos hablar con el equipo antes, para revisar diversificación entre operaciones y la documentación aplicable.",
      },
    ],
  },
  {
    id: "legal",
    label: "Legal y regulación",
    questions: [
      {
        q: "¿Rematto está regulado?",
        a: "Operamos como sociedad constituida en Perú y aplicamos procedimientos de verificación de identidad (KYC) y prevención de lavado de activos conforme a la normativa peruana vigente. Ninguna entidad del Estado patrocina, respalda ni garantiza las inversiones ofrecidas en la plataforma. Consulta la sección de cumplimiento regulatorio para el detalle del marco aplicable.",
      },
      {
        q: "¿Cómo se aplican los impuestos?",
        a: "Los retornos están sujetos a retención del 5% de impuesto a la renta. Rematto emite certificados de retención anuales para tu declaración tributaria.",
      },
      {
        q: "¿Dónde presento un reclamo?",
        a: "Puedes usar nuestro Libro de Reclamaciones virtual en cualquier momento. También puedes escribir a soporte@rematto.pe o llamar al +51 1 700 8000, de lunes a viernes de 9:00 a 18:00.",
      },
    ],
  },
  {
    id: "datos",
    label: "Tus datos personales",
    questions: [
      {
        q: "¿Qué información mía guardan?",
        a: "Tus datos de registro (nombre, correo, teléfono), los documentos de verificación de identidad (foto del DNI y selfie), tus datos bancarios para transferirte los retornos y el historial de tus operaciones en la plataforma.",
      },
      {
        q: "¿Quién puede ver mis documentos?",
        a: "Solo el personal del área de verificación, y únicamente mientras revisa tu identidad. Nadie más dentro de la empresa accede a tu DNI o tu selfie, y esos accesos quedan registrados. Los otros inversores de un pool nunca ven tu identidad.",
      },
      {
        q: "¿Para qué usan mis datos?",
        a: "Para verificar que eres quien dices ser (obligación legal de toda plataforma financiera en Perú), para transferirte tus retornos y para comunicarnos contigo sobre tus operaciones. No vendemos ni cedemos tus datos a terceros con fines comerciales.",
      },
      {
        q: "¿Cuánto tiempo los conservan?",
        a: "Mientras tu cuenta esté activa, y después durante el plazo que exige la normativa de prevención de lavado de activos. Cumplido ese plazo, se eliminan.",
      },
      {
        q: "¿Cómo los protegen, en simple?",
        a: "Tu información viaja cifrada entre tu dispositivo y la plataforma, y se guarda cifrada en nuestros servidores. En la práctica: aunque alguien accediera al archivo, no podría leerlo. El personal accede solo a lo que su función requiere, con doble factor de autenticación.",
      },
      {
        q: "¿Puedo pedir que borren mis datos?",
        a: "Sí. Puedes solicitar acceso, rectificación o eliminación escribiendo a privacidad@rematto.pe. Si tienes operaciones en curso o dentro del plazo legal de conservación, te explicaremos qué parte podemos eliminar y cuándo el resto.",
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
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar en preguntas frecuentes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 rounded-2xl border-border bg-card pl-12 text-base shadow-sm focus-visible:ring-primary"
            />
          </motion.div>

          {filteredCategories.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <HelpCircle className="mx-auto mb-4 size-10 text-muted-foreground" />
              <p className="font-medium text-foreground">No encontramos resultados</p>
              <p className="mt-2 text-sm text-muted-foreground">
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
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    <BookOpen className="size-4" />
                    {category.label}
                  </h2>
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <Accordion type="single" collapsible>
                      {category.questions.map((item, i) => (
                        <AccordionItem
                          key={item.q}
                          value={`${category.id}-${i}`}
                          className="border-border px-5 last:border-b-0"
                        >
                          <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground hover:no-underline hover:text-foreground/80">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
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
            className="mt-12 rounded-2xl border border-primary/30 bg-primary/10 p-6 sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/30">
                  <MessageCircle className="size-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">¿Aún tienes dudas?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Nuestro equipo responde en menos de 24 horas hábiles.
                  </p>
                </div>
              </div>
              <Link
                href="/libro-de-reclamaciones"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Libro de reclamaciones
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RM-025 — the closing CTA sent people to another document instead of
          to a person. The secondary action is now the contact channel. */}
      <LegalCTA
        title="¿No encontraste tu respuesta?"
        description="Escríbenos por WhatsApp, teléfono o correo. Resolvemos dudas antes de que crees una cuenta."
        primaryLabel="Hablar con el equipo"
        primaryHref="/contacto"
        secondaryLabel="Leer la política de riesgos"
        secondaryHref="/politica-de-riesgos"
      />
    </LegalPageLayout>
  );
}
