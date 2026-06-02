"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  Bell,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  LogOut,
  ChevronRight,
  Wallet,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/notifications-context";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  {
    href: "/dashboard/account",
    label: "Mi perfil",
    description: "Datos personales y KYC",
    icon: User,
  },
  {
    href: "/dashboard/my-investments",
    label: "Mis inversiones",
    description: "S/ 12,500 invertidos",
    icon: TrendingUp,
  },
  {
    href: "/dashboard/notifications",
    label: "Notificaciones",
    description: "Centro de alertas",
    icon: Bell,
    showBadge: true,
  },
  {
    href: "/dashboard/account?section=security",
    label: "Seguridad",
    description: "Contraseña y 2FA",
    icon: ShieldCheck,
  },
  {
    href: "/dashboard/account?section=notifications",
    label: "Preferencias",
    description: "Email y push",
    icon: Settings,
  },
] as const;

export function UserMenu() {
  const router = useRouter();
  const { unreadCount } = useNotifications();

  const handleHelp = () => {
    toast.message("Centro de ayuda", {
      description:
        "Escríbenos a soporte@remata.pe — respondemos en menos de 2 horas hábiles.",
    });
  };

  const handleLogout = () => {
    toast.success("Sesión cerrada", {
      description: "Hasta pronto, Ana Sofía. Te esperamos de vuelta.",
    });
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative size-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground cursor-pointer hover:opacity-90 transition-all ring-2 ring-transparent hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Menú de usuario"
        >
          AS
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 border-2 border-background" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 rounded-2xl p-0 overflow-hidden shadow-xl ring-1 ring-border/60"
      >
        <div className="bg-gradient-to-br from-primary/8 via-background to-muted/40 px-4 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0 shadow-md">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                Ana Sofía Torres
              </p>
              <p className="text-xs text-muted-foreground truncate">
                ana.torres@mail.com
              </p>
              <Badge
                variant="outline"
                className="mt-1.5 h-5 text-[10px] font-medium border-emerald-200 bg-emerald-50 text-emerald-700"
              >
                <ShieldCheck className="size-2.5 mr-1" />
                Identidad verificada
              </Badge>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-background/80 border border-border/60 px-3 py-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Wallet className="size-3" />
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  Invertido
                </span>
              </div>
              <p className="text-sm font-bold text-foreground mt-0.5">
                S/ 12,500
              </p>
            </div>
            <div className="rounded-xl bg-background/80 border border-border/60 px-3 py-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp className="size-3" />
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  Retorno
                </span>
              </div>
              <p className="text-sm font-bold text-emerald-600 mt-0.5">
                +22.7%
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuGroup className="p-1.5">
          {MENU_ITEMS.map((item) => (
            <DropdownMenuItem key={item.href} asChild className="p-0">
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 cursor-pointer"
              >
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <item.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
                {"showBadge" in item && item.showBadge && unreadCount > 0 ? (
                  <span className="size-5 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shrink-0">
                    {unreadCount}
                  </span>
                ) : (
                  <ChevronRight className="size-3.5 text-muted-foreground/40 shrink-0" />
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="mx-0" />

        <DropdownMenuGroup className="p-1.5">
          <DropdownMenuItem
            onClick={handleHelp}
            className="rounded-xl px-2.5 py-2.5 cursor-pointer"
          >
            <HelpCircle className="size-4 text-muted-foreground" />
            <span className="flex-1">Centro de ayuda</span>
            <ExternalLink className="size-3 text-muted-foreground/50" />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="mx-0" />

        <div className="p-1.5">
          <DropdownMenuItem
            variant="destructive"
            onClick={handleLogout}
            className={cn(
              "rounded-xl px-2.5 py-2.5 cursor-pointer",
              "text-red-600 focus:text-red-600 focus:bg-red-50"
            )}
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
