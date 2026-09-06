import Link from "next/link";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { LegalPageHero } from "@/components/landing/legal/LegalPageHero";
import { LegalContentBlock } from "@/components/landing/legal/LegalContentBlock";
import { LegalCTA } from "@/components/landing/legal/LegalCTA";

export const metadata = {
  title: "Política de privacidad | Rematto",
  description:
    "Cómo Rematto recopila, usa y protege tu información personal conforme a la Ley de Protección de Datos Personales del Perú.",
};

export default function PoliticaDePrivacidadPage() {
  return (
    <LegalPageLayout>
      <LegalPageHero
        badge="Privacidad"
        badgeIcon="Shield"
        title="Política de privacidad"
        description="Tu información es tuya. Te explicamos exactamente qué datos recopilamos, por qué lo hacemos y cómo puedes controlarlos."
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Política de privacidad" },
        ]}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl section-padding space-y-6">
          <LegalContentBlock icon="Database" title="1. Datos que recopilamos" index={0}>
            <p>Recopilamos la siguiente información para operar la plataforma de forma segura:</p>
            <ul>
              <li>
                <strong>Datos de identidad:</strong> nombre, DNI/CE/pasaporte, fecha de nacimiento,
                fotografías de documentos
              </li>
              <li>
                <strong>Datos de contacto:</strong> correo electrónico, teléfono, dirección
              </li>
              <li>
                <strong>Datos financieros:</strong> historial de inversiones, comprobantes de pago,
                cuentas bancarias vinculadas
              </li>
              <li>
                <strong>Datos técnicos:</strong> dirección IP, dispositivo, cookies de sesión
              </li>
            </ul>
          </LegalContentBlock>

          <LegalContentBlock icon="Eye" title="2. Cómo usamos tus datos" index={1}>
            <p>Utilizamos tu información exclusivamente para:</p>
            <ul>
              <li>Verificar tu identidad y cumplir obligaciones AML/KYC</li>
              <li>Procesar inversiones y gestionar tu cuenta</li>
              <li>Enviarte notificaciones sobre tus inversiones y la plataforma</li>
              <li>Prevenir fraude y actividades ilícitas</li>
              <li>Atender requerimientos de autoridades competentes cuando la ley lo exige</li>
              <li>Mejorar nuestros servicios mediante análisis agregados y anónimos</li>
            </ul>
          </LegalContentBlock>

          <LegalContentBlock icon="Lock" title="3. Protección y seguridad" index={2}>
            <p>
              La conexión con la plataforma va cifrada con TLS y los datos personales y
              documentos de identidad se guardan cifrados en reposo. El acceso está
              restringido por rol, con doble factor de autenticación para el personal
              autorizado, y cada consulta a un documento de identidad queda registrada.
            </p>
            <p>
              El detalle de los controles implementados, su alcance y lo que no
              certificamos está publicado en la{" "}
              <Link href="/seguridad" className="font-medium text-primary underline">
                página de seguridad
              </Link>
              .
            </p>
          </LegalContentBlock>

          <LegalContentBlock icon="UserCheck" title="4. Tus derechos ARCO" index={3}>
            <p>
              Conforme a la Ley N° 29733 de Protección de Datos Personales, tienes derecho a:
            </p>
            <ul>
              <li><strong>Acceso:</strong> solicitar una copia de tus datos personales</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos</li>
              <li><strong>Cancelación:</strong> solicitar la eliminación de tus datos</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento para fines específicos</li>
            </ul>
            <p>
              Para ejercer estos derechos, escríbenos a{" "}
              <a href="mailto:privacidad@rematto.pe" className="font-medium text-primary underline">
                privacidad@rematto.pe
              </a>
            </p>
          </LegalContentBlock>

          <LegalContentBlock icon="Mail" title="5. Compartición con terceros" index={4}>
            <p>
              No vendemos ni alquilamos tus datos. Solo compartimos información con:
            </p>
            <ul>
              <li>Proveedores de verificación de identidad (bajo acuerdos de confidencialidad)</li>
              <li>Entidades bancarias para procesamiento de pagos</li>
              <li>Autoridades regulatorias cuando la ley lo exija</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Última actualización: 1 de junio de 2026
            </p>
          </LegalContentBlock>
        </div>
      </section>

      <LegalCTA
        title="Tu privacidad, nuestra prioridad"
        description="Invertí con tranquilidad sabiendo que tus datos están protegidos con los más altos estándares."
        secondaryLabel="Cumplimiento regulatorio"
        secondaryHref="/cumplimiento-regulatorio"
      />
    </LegalPageLayout>
  );
}
