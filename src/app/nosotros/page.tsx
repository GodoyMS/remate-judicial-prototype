import { LegalPageLayout } from "@/components/landing/LegalPageLayout";
import { TeamSection } from "@/components/landing/TeamSection";
import { OriginBanner, OriginHero } from "@/components/landing/nosotros/OriginHero";
import { ProblemFound } from "@/components/landing/nosotros/ProblemFound";
import { AnotherWay } from "@/components/landing/nosotros/AnotherWay";
import { WorkTimeline } from "@/components/landing/nosotros/WorkTimeline";
import { DecisionMakingSection } from "@/components/landing/nosotros/DecisionMakingSection";
import { TransparentPlatformSection } from "@/components/landing/nosotros/TransparentPlatformSection";
import { CompanyDataSection } from "@/components/landing/nosotros/CompanyDataSection";
import { ForYouCTA } from "@/components/landing/nosotros/ForYouCTA";
import { BRAND_NAME } from "@/lib/brand";
import { teamMembers } from "@/lib/nosotros/team";

export const metadata = {
  title: `Nosotros | ${BRAND_NAME}`,
  description: `Quiénes están detrás de ${BRAND_NAME}, por qué existe la plataforma y qué papel cumple dentro de un remate judicial.`,
};

export default function NosotrosPage() {
  return (
    <LegalPageLayout flushTop>
      <OriginHero />
      <OriginBanner />
      <ProblemFound />
      <AnotherWay />
      <WorkTimeline />
      <TeamSection members={teamMembers} />
      <DecisionMakingSection />
      <TransparentPlatformSection />
      <CompanyDataSection />
      <ForYouCTA />
    </LegalPageLayout>
  );
}
