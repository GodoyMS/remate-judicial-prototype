import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { AuthBrandingPanel } from "@/components/auth/AuthBrandingPanel";

type AuthSplitLayoutProps = {
  children: React.ReactNode;
  variant?: "login" | "register" | "verification";
};

export function AuthSplitLayout({ children, variant }: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AuthBrandingPanel variant={variant} />

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center">
              <Logo className="text-2xl text-primary" />
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
