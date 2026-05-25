import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/20">
      <AdminSidebar />
      <div className="flex-1 w-full min-w-0 overflow-hidden">
        <div className="flex flex-col w-full h-full min-w-0 overflow-hidden">
          <AdminTopbar />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
