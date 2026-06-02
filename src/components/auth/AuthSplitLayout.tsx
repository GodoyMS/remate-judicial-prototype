import Link from "next/link";
import { Gavel } from "lucide-react";
import { AuthBrandingPanel } from "@/components/auth/AuthBrandingPanel";

type AuthSplitLayoutProps = {
  children: React.ReactNode;
};

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AuthBrandingPanel />

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="size-9 rounded-lg bg-primary flex items-center justify-center">
                <Gavel className="size-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">remata</span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
