import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PlatformChatbot } from "@/components/landing/PlatformChatbot";

interface LegalPageLayoutProps {
  children: React.ReactNode;
  /** Skip the default offset when the first section sits under a transparent nav. */
  flushTop?: boolean;
}

export function LegalPageLayout({
  children,
  flushTop = false,
}: LegalPageLayoutProps) {
  return (
    <>
      <Navbar />
      <main className={flushTop ? undefined : "pt-16"}>{children}</main>
      <Footer />
      <PlatformChatbot />
    </>
  );
}
