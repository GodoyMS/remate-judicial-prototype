import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { LegalContentBlock } from "@/components/landing/legal/LegalContentBlock";
import { LegalCTA } from "@/components/landing/legal/LegalCTA";

export const metadata = {
  title: "Términos de uso | Remata",
  description:
    "Conoce los términos y condiciones que rigen el uso de la plataforma Remata para inversión en remates judiciales.",
};

export default function TerminosDeUsoPage() {
  return (
    <LegalPageLayout>
      <LegalPageHero
        badge="Legal"
        badgeIcon="FileText"
        title="Términos de uso"
        description="Transparencia total sobre cómo funciona nuestra plataforma. Léelos con calma — están escritos para humanos, no para abogados."
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Términos de uso" },
        ]}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl section-padding space-y-6">
          <LegalContentBlock icon="Gavel" title="1. Aceptación de los términos" index={0}>
            <p>
              Al acceder o utilizar Remata, aceptas estos Términos de Uso y nuestra Política de
              Privacidad. Si no estás de acuerdo, por favor no utilices la plataforma.
            </p>
            <p>
              Remata S.A.C. es una empresa registrada en Perú, supervisada por la Superintendencia
              de Banca, Seguros y AFP (SBS), dedicada a facilitar la inversión colectiva en remates
              judiciales inmobiliarios.
            </p>
          </LegalContentBlock>

          <LegalContentBlock icon="Users" title="2. Elegibilidad y registro" index={1}>
            <p>Para usar Remata debes:</p>
            <ul>
              <li>Ser mayor de 18 años y tener capacidad legal plena</li>
              <li>Residir en Perú o contar con documentación válida para invertir</li>
              <li>Completar el proceso de verificación de identidad (KYC)</li>
              <li>Proporcionar información veraz y actualizada</li>
            </ul>
            <p>
              Nos reservamos el derecho de rechazar o suspender cuentas que no cumplan estos
              requisitos o que presenten actividad sospechosa.
            </p>
          </LegalContentBlock>

          <LegalContentBlock icon="Scale" title="3. Naturaleza de las inversiones" index={2}>
            <p>
              Las inversiones en remates judiciales conllevan riesgos inherentes, incluyendo la
              posibilidad de pérdida parcial o total del capital invertido. Los retornos pasados no
              garantizan resultados futuros.
            </p>
            <p>
              Remata actúa como intermediario tecnológico que facilita la participación en
              subastas judiciales. No somos asesores financieros ni garantizamos adjudicaciones
              específicas.
            </p>
          </LegalContentBlock>

          <LegalContentBlock icon="Shield" title="4. Obligaciones del usuario" index={3}>
            <p>Como usuario de Remata te comprometes a:</p>
            <ul>
              <li>Usar la plataforma únicamente para fines legales</li>
              <li>No realizar operaciones de lavado de activos ni financiamiento del terrorismo</li>
              <li>Mantener la confidencialidad de tus credenciales de acceso</li>
              <li>Notificarnos inmediatamente ante cualquier uso no autorizado de tu cuenta</li>
              <li>Cumplir con las leyes tributarias aplicables a tus retornos</li>
            </ul>
          </LegalContentBlock>

          <LegalContentBlock icon="AlertTriangle" title="5. Limitación de responsabilidad" index={4}>
            <p>
              Remata no se hace responsable por decisiones de inversión del usuario, demoras en
              procesos judiciales, cambios normativos o eventos de fuerza mayor que afecten las
              subastas o adjudicaciones.
            </p>
            <p>
              Nuestra responsabilidad máxima se limita al monto de las comisiones pagadas por el
              usuario en los últimos 12 meses.
            </p>
          </LegalContentBlock>

          <LegalContentBlock icon="FileText" title="6. Modificaciones" index={5}>
            <p>
              Podemos actualizar estos términos en cualquier momento. Te notificaremos por correo
              electrónico con al menos 15 días de anticipación ante cambios materiales. El uso
              continuado de la plataforma constituye aceptación de los nuevos términos.
            </p>
            <p className="text-sm text-[#163300]/50">
              Última actualización: 1 de junio de 2026
            </p>
          </LegalContentBlock>
        </div>
      </section>

      <LegalCTA
        title="¿Listo para invertir con confianza?"
        description="Crea tu cuenta en minutos y accede a propiedades verificadas en remate judicial."
        secondaryLabel="Ver preguntas frecuentes"
        secondaryHref="/preguntas-frecuentes"
      />
    </LegalPageLayout>
  );
}
