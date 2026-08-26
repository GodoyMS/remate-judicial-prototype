import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { WhyInvest } from "@/components/landing/WhyInvest";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { VideoSection } from "@/components/landing/VideoSection";
import { PropertyPreview } from "@/components/landing/PropertyPreview";
import { RiskSection } from "@/components/landing/RiskSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { PlatformChatbot } from "@/components/landing/PlatformChatbot";

/**
 * Landing narrative order — audit findings RM-001, RM-018, RM-019.
 *
 * The page used to present every argument it had, in no particular order, and
 * kept the downside out of the commercial story entirely. It now follows the
 * questions a first-time reader actually asks, in sequence:
 *
 *   Hero            what is this, from how much, what do I do
 *   WhyInvest       why through a platform at all (four pillars, no more)
 *   HowItWorks      how it works, step by step
 *   VideoSection    see it working
 *   PropertyPreview what is open right now
 *   RiskSection     what can go wrong  ← was missing entirely (RM-018)
 *   TrustSection    how I verify any of this
 *   SocialProof     who else has done it
 *   FinalCTA        what happens if I sign up
 */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyInvest />
        <HowItWorks />
        <VideoSection />
        <PropertyPreview />
        <RiskSection />
        <TrustSection />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
      <PlatformChatbot />
    </>
  );
}
