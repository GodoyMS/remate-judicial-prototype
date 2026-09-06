import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { WhyInvest } from "@/components/landing/WhyInvest";
import { VideoSection } from "@/components/landing/VideoSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { WhatWeManage } from "@/components/landing/WhatWeManage";
import { WhatYouGet } from "@/components/landing/WhatYouGet";
import { InvestmentModes } from "@/components/landing/InvestmentModes";
import { TrustSection } from "@/components/landing/TrustSection";
import { ForWhom } from "@/components/landing/ForWhom";
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
 *   WhyInvest         what I get through the platform — four pillars
 *   VideoSection      see it working, immediately after the argument
 *   HowItWorks        how it works, step by step, custody included
 *   WhatWeManage      what the team does after the auction is won
 *   WhatYouGet        what I actually own, and where my money sits
 *   InvestmentModes   collective or Premium
 *   TrustSection      how I verify any of this, in official sources
 *   ForWhom           is this for someone like me
 *   PropertyPreview   what is open right now (and what is coming)
 *   ReturnSimulator   what that would mean for my money
 *   SocialProof       who else has done it
 *   FinalCTA          sign up, or talk to someone first
 *
 * The sequence answers the questions in the order a cautious investor asks
 * them: what it is, what I get, how it works, who handles it, what I own,
 * how I check it, whether it suits me, what is available, what it returns.
 * Risk is never a section of its own here — it is stated where each decision
 * is made (hero strip, custody block, opportunities, simulator) and answered
 * in full on /politica-de-riesgos.
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
        <WhatWeManage />
        <WhatYouGet />
        <InvestmentModes />
        <TrustSection />
        <ForWhom />
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
