import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { NotificationsProvider } from "@/contexts/notifications-context";
import { UserProvider } from "@/contexts/user-context";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <NotificationsProvider>
        <div className="flex h-screen overflow-hidden bg-muted/20">
          <Sidebar />
          <div className="max-w-6xl mx-auto flex-1 w-full min-w-0">
            <div className="flex flex-col w-full h-full min-w-0 overflow-hidden">
              <Topbar />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden min-w-0">
                {children}
              </main>
            </div>
          </div>
          <Toaster position="top-right" richColors closeButton />
        </div>
      </NotificationsProvider>
    </UserProvider>
  );
}
