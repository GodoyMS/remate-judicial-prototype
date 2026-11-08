"use client";

import { useId, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-hydrated";
import { ChevronDown, Lock, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailSectionProps {
  id?: string;
  title: string;
  icon: LucideIcon;
  /** Una línea que resume la sección cuando está cerrada. */
  summary?: ReactNode;
  children?: ReactNode;
  /** Abierta por defecto en móvil (en escritorio siempre empieza abierta). */
  defaultOpenMobile?: boolean;
  /** Bloqueada para cuentas sin acceso: muestra que existe, no su contenido. */
  locked?: boolean;
  /** Controlado desde fuera (p. ej. "Ver escenarios" abre esta sección). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * Sección de ficha: tarjeta abierta en escritorio, acordeón en móvil.
 * Antes de hidratar no se sabe el ancho, así que el contenido se oculta
 * con CSS por debajo de `lg` en vez de abrir y cerrar (sin parpadeo).
 */
export function DetailSection({
  id,
  title,
  icon: Icon,
  summary,
  children,
  defaultOpenMobile = false,
  locked = false,
  open: controlledOpen,
  onOpenChange,
  className,
}: DetailSectionProps) {
  const [internal, setInternal] = useState<boolean | null>(null);
  const contentId = useId();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const initial = desktop === null ? null : desktop || defaultOpenMobile;

  const open = controlledOpen ?? internal ?? initial;
  const toggle = () => {
    const next = !(open ?? false);
    setInternal(next);
    onOpenChange?.(next);
  };

  return (
    <section
      id={id}
      className={cn("scroll-mt-24 rounded-2xl border border-border/60 bg-card shadow-sm", className)}
    >
      <h2>
        <button
          type="button"
          onClick={locked ? undefined : toggle}
          aria-expanded={locked ? undefined : (open ?? undefined)}
          aria-controls={locked ? undefined : contentId}
          aria-disabled={locked || undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:px-5",
            locked && "cursor-default"
          )}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary dark:bg-accent dark:text-accent-foreground">
            <Icon className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-foreground">{title}</span>
            {summary && (
              <span
                className={cn(
                  "mt-0.5 block truncate text-xs text-muted-foreground",
                  open && "lg:hidden",
                  open === null && "lg:hidden"
                )}
              >
                {summary}
              </span>
            )}
          </span>
          {locked ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              <Lock className="size-3" /> Premium
            </span>
          ) : (
            <ChevronDown
              aria-hidden
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                open && "rotate-180",
                open === null && "lg:rotate-180"
              )}
            />
          )}
        </button>
      </h2>
      {!locked && (
        <div
          id={contentId}
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out",
            open === null ? "grid-rows-[0fr] lg:grid-rows-[1fr]" : open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="min-h-0 overflow-hidden" inert={open === false ? true : undefined}>
            <div className="border-t border-border/60 px-4 pb-5 pt-4 sm:px-5">{children}</div>
          </div>
        </div>
      )}
    </section>
  );
}
