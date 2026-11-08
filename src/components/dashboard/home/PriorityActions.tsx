"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PriorityAction {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: LucideIcon;
}

interface PriorityActionsProps {
  /** Todas las acciones, en orden de urgencia. Se muestran tres y el resto se despliega. */
  actions: PriorityAction[];
}

const VISIBLE = 3;

/**
 * 3. Acciones prioritarias. Contenedor en primary para que sea lo primero
 * que se lee después de los KPIs; cada acción es una fila blanca con un
 * único CTA. Iconografía solo en la paleta de marca (azul, negro, blanco).
 */
export function PriorityActions({ actions: all }: PriorityActionsProps) {
  const [expanded, setExpanded] = useState(false);
  const actions = expanded ? all : all.slice(0, VISIBLE);
  const hidden = all.length - VISIBLE;
  return (
    <section
      aria-labelledby="home-actions"
      className="rounded-3xl bg-primary p-2 shadow-md shadow-primary/15"
    >
      <div className="flex items-center justify-between gap-3 px-3 pt-2 pb-3">
        <h3 id="home-actions" className="text-base sm:text-lg font-semibold text-primary-foreground">
          <span className="sm:hidden">Acciones pendientes</span>
          <span className="hidden sm:inline">Acciones que requieren tu atención</span>
        </h3>
        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-primary-foreground/85 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors shrink-0"
          >
            {expanded ? "Ver menos" : `Ver todas (${all.length})`}
            <ChevronDown className={`size-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {actions.length === 0 ? (
        <div className="flex items-center gap-3 rounded-2xl bg-card p-4">
          <span className="size-10 rounded-xl bg-primary/8 text-primary dark:bg-accent dark:text-accent-foreground flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-5" />
          </span>
          <p className="dash-body text-foreground">Estás al día. No tienes acciones pendientes.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {actions.map((action) => (
            <li key={action.id}>
              {/* Móvil: toda la fila es el enlace (un objetivo táctil grande, sin
                  un botón a ancho completo por acción). Escritorio: botón. */}
              <Link
                href={action.href}
                className="flex items-center gap-3 rounded-2xl bg-card p-3 sm:hidden active:bg-muted"
              >
                <span className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <action.icon className="size-[18px]" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">{action.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{action.description}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
              <div className="hidden sm:flex items-center gap-3 rounded-2xl bg-card p-3 pr-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <action.icon className="size-[18px]" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{action.title}</p>
                    <p className="dash-caption font-normal text-muted-foreground mt-0.5">{action.description}</p>
                  </div>
                </div>
                <Button asChild size="sm" className="rounded-lg px-4 w-28">
                  <Link href={action.href}>{action.cta}</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
