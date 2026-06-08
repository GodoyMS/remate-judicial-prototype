"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminNotificationsProvider } from "@/contexts/admin-notifications-context";
import { AdminAuthProvider, AdminRouteGuard } from "@/contexts/admin-auth-context";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminNotificationsProvider>
        <div className="flex h-screen overflow-hidden bg-muted/20">
          <AdminSidebar />
          <div className="flex-1 w-full min-w-0 overflow-hidden">
            <div className="flex flex-col w-full h-full min-w-0 overflow-hidden">
              <AdminTopbar />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden min-w-0">
                <AdminRouteGuard>{children}</AdminRouteGuard>
              </main>
            </div>
          </div>
          <Toaster position="top-right" richColors closeButton />
        </div>
      </AdminNotificationsProvider>
    </AdminAuthProvider>
  );
}
