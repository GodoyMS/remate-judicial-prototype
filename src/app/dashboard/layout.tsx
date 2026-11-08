import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SessionGuard } from "@/components/dashboard/SessionGuard";
import { NotificationsProvider } from "@/contexts/notifications-context";
import { Toaster } from "sonner";
import { connection } from "next/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // El dashboard es privado y depende de la fecha (ventanas Premium, plazos de
  // aporte, "hace X días"): se renderiza por solicitud, nunca en el build.
  // Prerenderizarlo congelaría esas fechas y romperían la hidratación.
  await connection();
  return (
    <NotificationsProvider>
      <SessionGuard />
      <div className="flex min-h-screen items-start bg-muted/20">
        <Sidebar />
        <div className="max-w-6xl mx-auto flex-1 w-full min-w-0">
          <div className="flex flex-col w-full min-h-screen min-w-0">
            <Topbar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
              {children}
            </main>
          </div>
        </div>
        <Toaster position="top-right" richColors closeButton />
      </div>
    </NotificationsProvider>
  );
}
