"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/contexts/user-context";

/**
 * Redirige a /login cuando la sesión expira, conservando la ruta destino
 * (WP-1.4, cierra L-034). Sin esto, la app seguía mostrando el dashboard
 * indefinidamente sin importar cuánto tiempo hubiera pasado.
 */
export function SessionGuard() {
  const { sessionExpired, logout } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!sessionExpired) return;
    logout();
    const redirect = pathname.startsWith("/dashboard") ? pathname : "/dashboard";
    router.replace(`/login?expired=1&redirect=${encodeURIComponent(redirect)}`);
  }, [sessionExpired, logout, pathname, router]);

  return null;
}
