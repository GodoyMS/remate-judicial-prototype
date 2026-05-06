"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, Clock, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const properties = [
  {
    id: 1,
    title: "Departamento en San Isidro",
    address: "Av. Javier Prado Este 1240, San Isidro",
    type: "Departamento",
    area: "112 m²",
    basePrice: "S/ 285,000",
    roi: "22%",
    deadline: "8 días",
    status: "Activo",
    statusColor: "bg-green-50 text-green-700 border-green-200",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=360&fit=crop&auto=format",
    badge: "🔥 Alta demanda",
    badgeStyle: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    id: 2,
    title: "Casa en La Molina",
    address: "Jr. Las Casuarinas 350, La Molina",
    type: "Casa",
    area: "280 m²",
    basePrice: "S/ 520,000",
    roi: "18%",
    deadline: "15 días",
    status: "Activo",
    statusColor: "bg-green-50 text-green-700 border-green-200",
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=360&fit=crop&auto=format",
    badge: "⚖️ Proceso expedito",
    badgeStyle: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: 3,
    title: "Penthouse en Miraflores",
    address: "Calle Berlín 847, Miraflores",
    type: "Penthouse",
    area: "195 m²",
    basePrice: "S/ 680,000",
    roi: "20%",
    deadline: "22 días",
    status: "Próximo",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=360&fit=crop&auto=format",
    badge: "⭐ Exclusivo",
    badgeStyle: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

export function PropertyPreview() {
  return (
    <section id="propiedades" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl section-padding">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Propiedades disponibles
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Subastas abiertas ahora
            </h2>
            <p className="text-muted-foreground max-w-md">
              Propiedades auditadas legalmente, listas para invertir. Actualizado en tiempo real.
            </p>
          </div>
          <Button variant="outline" asChild className="shrink-0 rounded-full border-border/80">
            <Link href="/register">
              Ver todas las propiedades
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group rounded-2xl border border-border/60 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[16/9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={`text-xs border rounded-full px-2.5 py-0.5 font-medium ${p.statusColor}`}>
                    {p.status}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className={`text-xs border rounded-full px-2.5 py-0.5 font-medium ${p.badgeStyle}`}>
                    {p.badge}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                    <Home className="size-3.5" />
                    <span>{p.type} · {p.area}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-base leading-snug">{p.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="size-3" />
                    <span className="truncate">{p.address}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 divide-x divide-border/60 rounded-xl border border-border/60 overflow-hidden">
                  <div className="flex flex-col items-center py-2.5 px-1">
                    <span className="text-xs text-muted-foreground">Precio base</span>
                    <span className="text-xs font-semibold text-foreground mt-0.5">{p.basePrice}</span>
                  </div>
                  <div className="flex flex-col items-center py-2.5 px-1">
                    <span className="text-xs text-muted-foreground">ROI est.</span>
                    <span className="text-xs font-bold text-green-600 mt-0.5 flex items-center gap-0.5">
                      <TrendingUp className="size-3" />{p.roi}
                    </span>
                  </div>
                  <div className="flex flex-col items-center py-2.5 px-1">
                    <span className="text-xs text-muted-foreground">Cierra en</span>
                    <span className="text-xs font-semibold text-foreground mt-0.5 flex items-center gap-0.5">
                      <Clock className="size-3 text-amber-500" />{p.deadline}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full rounded-xl h-9 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm"
                  asChild
                >
                  <Link href="/register">Invertir ahora</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
