import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { VideoSection } from "@/components/landing/VideoSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { PropertyPreview } from "@/components/landing/PropertyPreview";
import { SocialProof } from "@/components/landing/SocialProof";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <VideoSection />
        <TrustSection />
        <HowItWorks />
        <Features />
        <PropertyPreview />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
