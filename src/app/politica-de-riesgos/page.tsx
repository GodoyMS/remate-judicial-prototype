import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { RiskPolicyContent } from "@/components/landing/legal/RiskPolicyContent";
import { BRAND_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Política de riesgos | ${BRAND_NAME}`,
  description:
    "Qué puede salir mal al invertir en remates judiciales, qué ocurre con tu capital en cada escenario y cuánto puede demorar. Sin letra chica.",
};

export default function PoliticaDeRiesgosPage() {
  return (
    <LegalPageLayout>
      <RiskPolicyContent />
    </LegalPageLayout>
  );
}
