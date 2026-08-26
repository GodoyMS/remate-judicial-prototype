import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { WhyInvest } from "@/components/landing/WhyInvest";
import { VideoSection } from "@/components/landing/VideoSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TrustSection } from "@/components/landing/TrustSection";
import { PropertyPreview } from "@/components/landing/PropertyPreview";
import { ReturnSimulator } from "@/components/landing/ReturnSimulator";
import { SocialProof } from "@/components/landing/SocialProof";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { PlatformChatbot } from "@/components/landing/PlatformChatbot";

/**
 * Landing narrative order.
 *
 *   Hero              what is this, from how much, what do I do
 *   WhyInvest         why through a platform at all — four pillars
 *   VideoSection      see it working, immediately after the argument
 *   HowItWorks        how it works, step by step
 *   TrustSection      how I verify any of this
 *   PropertyPreview   what is open right now
 *   ReturnSimulator   what that would mean for my money
 *   SocialProof       who else has done it
 *   FinalCTA          what happens if I sign up
 *
 * The landing no longer carries a risk block of its own: the four questions it
 * asked are answered in full on /politica-de-riesgos, which every relevant
 * surface links to (hero, pillars, property cards, simulator, footer). Keeping
 * a summary here duplicated that page and interrupted the commercial sequence
 * between "what is available" and "what it would return".
 */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyInvest />
        <VideoSection />
        <HowItWorks />
        <TrustSection />
        <PropertyPreview />
        <ReturnSimulator />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
      <PlatformChatbot />
    </>
  );
}
