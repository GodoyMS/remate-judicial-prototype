import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import type { DashboardProperty } from "@/lib/dashboard/types";

interface FeaturedOpportunityProps {
  property: DashboardProperty;
}

/** Oportunidad destacada junto a la actividad reciente (sección 5). */
export function FeaturedOpportunity({ property }: FeaturedOpportunityProps) {
  return (
    <section
      aria-labelledby="home-featured"
      className="rounded-3xl border border-border/60 bg-card p-3 shadow-sm flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={property.img} alt="" className="absolute inset-0 size-full object-cover" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-semibold text-background backdrop-blur-sm">
          <Sparkles className="size-3" />
          Oportunidad destacada
        </span>
      </div>

      <div className="flex flex-col gap-4 px-2 pt-4 pb-2 flex-1">
        <div>
          <p className="dash-overline text-muted-foreground">Explora nuevas oportunidades</p>
          <h3 id="home-featured" className="dash-heading text-foreground mt-1">
            {property.name}
          </h3>
          <p className="dash-caption font-normal text-muted-foreground mt-0.5 inline-flex items-center gap-1">
            <MapPin className="size-3" />
            {property.district}, {property.region}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-muted/60 p-3">
          <div>
            <dt className="dash-caption font-normal text-muted-foreground">Precio base</dt>
            <dd className="text-base font-bold text-foreground tabular-nums mt-0.5">
              {formatCurrency(property.price, property.currency)}
            </dd>
          </div>
          <div>
            <dt className="dash-caption font-normal text-muted-foreground">Retorno estimado</dt>
            <dd className="text-base font-bold text-primary dark:text-accent-foreground tabular-nums mt-0.5">{property.roi}%</dd>
          </div>
        </dl>

        <Button asChild className="h-10 rounded-xl mt-auto">
          <Link href={`/dashboard/properties/${property.id}`}>
            Ver oportunidad
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
