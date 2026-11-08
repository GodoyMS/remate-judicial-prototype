"use client";

import { Suspense, useMemo, useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { ArrowRight, ChevronDown, Crown, FileSearch, Landmark, ShieldCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/dashboard/PageHero";
import { PremiumBadge } from "@/components/dashboard/PremiumBadge";
import { PremiumPropertyCard } from "@/components/dashboard/PremiumPropertyCard";
import { useCurrentUser } from "@/contexts/user-context";
import { getAllPremiumProperties, premiumProperties } from "@/lib/premium/mock-data";
import { getAvailability, type Availability } from "@/lib/premium/availability";
import { useReservations } from "@/lib/premium/reservations";
import type { PremiumProperty } from "@/lib/premium/types";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "Todas" },
  { id: "available", label: "Disponibles" },
  { id: "mine", label: "Mis reservas" },
  { id: "collective", label: "Pasaron a colectiva" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const EMPTY_COPY: Record<FilterId, { title: string; body: string }> = {
  all: { title: "No hay oportunidades Premium por ahora", body: "Te avisaremos cuando se abra una nueva ventana." },
  available: {
    title: "No hay ventanas abiertas en este momento",
    body: "Te avisaremos por correo y en Notificaciones cuando se abra la próxima.",
  },
  mine: {
    title: "Aún no tienes reservas Premium",
    body: "Cuando envíes una solicitud de reserva, la verás aquí con su seguimiento.",
  },
  collective: {
    title: "Ninguna oportunidad pasó a colectiva",
    body: "Las ventanas que cierren sin reserva aparecerán aquí.",
  },
};

const HOW_IT_WORKS = [
  { icon: Timer, title: "Ventana exclusiva", body: "Cada oportunidad abre primero para Premium durante un plazo con fecha y hora de cierre." },
  { icon: FileSearch, title: "Solicitud de reserva", body: "Revisas el expediente y solicitas reservar el 100%. Enviar la solicitud no genera cobros." },
  { icon: ShieldCheck, title: "Revisión", body: "Validamos tu cuenta y el origen de fondos. Si se aprueba, firmas el contrato de reserva." },
  { icon: Landmark, title: "Aporte y seguimiento", body: "Transfieres a la cuenta de custodia y sigues cada hito hasta la liquidación." },
];

export default function PremiumPropertiesPage() {
  return (
    <Suspense>
      <PremiumPropertiesContent />
    </Suspense>
  );
}

function PremiumPropertiesContent() {
  const { user, isPremium } = useCurrentUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const reservations = useReservations();
  // Las creadas desde admin viven en localStorage: solo existen tras hidratar.
  const hydrated = useHydrated();
  const properties = useMemo<PremiumProperty[]>(
    () => (hydrated ? getAllPremiumProperties() : premiumProperties),
    [hydrated]
  );
  const requested = searchParams.get("filter");
  const activeFilter: FilterId = FILTERS.some((f) => f.id === requested) ? (requested as FilterId) : "all";

  const rows = useMemo(
    () =>
      properties
        .map((p) => ({ property: p, availability: getAvailability(p, reservations, user.id) }))
        // Lo que ya financió otra persona se retira de la vista (privacidad).
        .filter((r) => r.availability.kind !== "taken"),
    [properties, reservations, user.id]
  );

  const counts = useMemo(() => {
    const c: Record<FilterId, number> = { all: rows.length, available: 0, mine: 0, collective: 0 };
    rows.forEach((r) => {
      if (r.availability.kind === "available") c.available++;
      if (r.availability.kind === "mine") c.mine++;
      if (r.availability.kind === "collective") c.collective++;
    });
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const order: Record<Availability["kind"], number> = { mine: 0, available: 1, held: 2, collective: 3, taken: 4 };
    return rows
      .filter((r) => activeFilter === "all" || r.availability.kind === activeFilter)
      .sort((a, b) => {
        const byKind = order[a.availability.kind] - order[b.availability.kind];
        if (byKind !== 0) return byKind;
        return new Date(a.property.premiumDeadline).getTime() - new Date(b.property.premiumDeadline).getTime();
      });
  }, [rows, activeFilter]);

  const setFilter = (id: FilterId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") params.delete("filter");
    else params.set("filter", id);
    router.replace(`/dashboard/premium-properties${params.size ? `?${params}` : ""}`, { scroll: false });
  };

  return (
    <div className="w-full">
      <PageHero
        icon={Crown}
        eyebrow="Inversión individual"
        badge={<PremiumBadge size="md" />}
        title="Oportunidades Premium"
        description={
          isPremium
            ? "Financia individualmente el 100% del capital requerido durante una ventana exclusiva."
            : "Oportunidades de alto valor que un solo inversionista financia al 100%. Disponible con acceso Premium."
        }
      />

      {!isPremium && <StandardGate />}

      <HowItWorks defaultOpen={!isPremium} />

      {isPremium && (
        <div
          role="tablist"
          aria-label="Filtrar oportunidades"
          className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none]"
        >
          {FILTERS.map((f) => {
            const active = activeFilter === f.id;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs tabular-nums",
                    active ? "bg-primary-foreground/20" : "bg-muted text-foreground/70"
                  )}
                >
                  {counts[f.id]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r, i) => (
            <PremiumPropertyCard
              key={r.property.id}
              property={r.property}
              availability={r.availability}
              isPremium={isPremium}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <Crown className="mb-3 size-8 text-muted-foreground/50" />
          <p className="text-sm font-semibold text-foreground">{EMPTY_COPY[activeFilter].title}</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{EMPTY_COPY[activeFilter].body}</p>
          {activeFilter !== "all" && (
            <Button variant="outline" className="mt-5 rounded-xl" onClick={() => setFilter("all")}>
              Ver todas
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function HowItWorks({ defaultOpen }: { defaultOpen: boolean }) {
  // `null` = el usuario no lo ha tocado: se deriva del tipo de cuenta, que
  // se conoce recién al hidratar (abrirlo en SSR y cerrarlo después parpadea).
  const [touched, setOpen] = useState<boolean | null>(null);
  const open = touched ?? defaultOpen;
  return (
    <CollapsiblePrimitive.Root
      open={open}
      onOpenChange={setOpen}
      className="mb-6 rounded-2xl border border-border/60 bg-card shadow-sm"
    >
      <CollapsiblePrimitive.Trigger className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:px-5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary dark:bg-accent dark:text-accent-foreground">
          <FileSearch className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">¿Cómo funciona una reserva Premium?</span>
          <span className="block text-xs text-muted-foreground">Ventana exclusiva → solicitud → revisión → aporte en custodia</span>
        </span>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <ol className="grid gap-3 border-t border-border/60 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
          {HOW_IT_WORKS.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{s.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="border-t border-border/60 px-4 py-3 text-xs text-muted-foreground sm:px-5">
          Invertir el 100% del capital no equivale a adquirir la propiedad registral de forma automática. El retorno es estimado y no está garantizado.
        </p>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}

function StandardGate() {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:flex-row sm:items-center">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-premium/12 text-premium">
        <Crown className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">Estas oportunidades requieren acceso Premium</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Premium está diseñado para quienes pueden financiar individualmente el capital total de una operación. Tu cuenta Estándar sigue igual: participas en conjunto desde S/ 500.
        </p>
      </div>
      <Button asChild className="h-10 w-full shrink-0 rounded-xl sm:w-auto">
        <Link href="/dashboard/account?section=premium">
          Conocer Premium
          <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
