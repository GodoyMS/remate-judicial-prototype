"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Users,
  Clock,
  Home,
  Maximize2,
  Zap,
  Target,
  Building2,
  ArrowRight,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PropertyGalleryFullscreen } from "@/components/dashboard/PropertyGalleryFullscreen";
import { getPropertyById, formatCurrency } from "@/lib/dashboard/mock-data";

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const propertyId = parseInt(id, 10);
  const property = getPropertyById(propertyId);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [liveFeed, setLiveFeed] = useState(property?.liveInvestments ?? []);
  const [raisedAmount, setRaisedAmount] = useState(property?.raisedAmount ?? 0);

  useEffect(() => {
    if (!property) return;

    const interval = setInterval(() => {
      const names = ["J*** A.", "K*** B.", "N*** C.", "F*** D.", "G*** E."];
      const amounts = [500, 1000, 1500, 2500, 5000];
      const newInv = {
        id: `live-${Date.now()}`,
        obfuscatedName: names[Math.floor(Math.random() * names.length)],
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        timeAgo: "ahora",
      };
      setLiveFeed((prev) => [newInv, ...prev.slice(0, 7)]);
      setRaisedAmount((prev) => Math.min(prev + newInv.amount, property.totalInvestment));
    }, 12000);

    return () => clearInterval(interval);
  }, [property]);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold">Propiedad no encontrada</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/dashboard/properties">Volver a propiedades</Link>
        </Button>
      </div>
    );
  }

  const progress = Math.round((raisedAmount / property.totalInvestment) * 100);
  const remaining = property.totalInvestment - raisedAmount;

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="ghost" size="icon-sm" className="rounded-xl shrink-0">
          <Link href="/dashboard/properties">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold truncate">{property.name}</h2>
            <span className={`text-[10px] font-medium rounded-full px-2.5 py-1 border ${property.badgeStyle}`}>
              {property.badge}
            </span>
            <Badge
              variant={property.status === "Activo" ? "default" : "outline"}
              className="text-[10px]"
            >
              {property.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">{property.address}</span>
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-white shadow-sm">
              <Carousel className="w-full">
                <CarouselContent>
                  {property.images.map((img, i) => (
                    <CarouselItem key={i}>
                      <div className="relative aspect-[16/10] group cursor-pointer" onClick={() => openGallery(i)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`${property.name} ${i + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-4 right-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          onClick={(e) => { e.stopPropagation(); openGallery(i); }}
                        >
                          <Maximize2 className="size-4 mr-1" />
                          Pantalla completa
                        </Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3 bg-white/90 hover:bg-white border-0 shadow-md" />
                <CarouselNext className="right-3 bg-white/90 hover:bg-white border-0 shadow-md" />
              </Carousel>

              <div className="absolute top-4 left-4 flex gap-2 z-10 pointer-events-none">
                <Badge className="bg-white/90 text-foreground backdrop-blur-sm text-[10px]">
                  {property.images.length} fotos
                </Badge>
              </div>
            </div>
          </motion.div>

          <Card className="rounded-2xl border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{property.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-border/60">
                {[
                  { icon: Home, label: "Tipo", value: property.type },
                  { icon: Building2, label: "Área", value: property.area },
                  { icon: MapPin, label: "Distrito", value: property.district },
                  { icon: Clock, label: "Cierra en", value: property.deadline },
                ].map((item) => (
                  <div key={item.label} className="text-center sm:text-left">
                    <item.icon className="size-4 text-muted-foreground mx-auto sm:mx-0 mb-1" />
                    <p className="text-[10px] text-muted-foreground uppercase">{item.label}</p>
                    <p className="text-sm font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="size-4 text-green-600" />
                  Inversiones en tiempo real
                </CardTitle>
                <span className="flex items-center gap-1.5 text-[10px] text-green-600 font-medium">
                  <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                  En vivo
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="popLayout">
                {liveFeed.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Sin actividad reciente</p>
                ) : (
                  <div className="space-y-2">
                    {liveFeed.map((inv) => (
                      <motion.div
                        key={inv.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-secondary">
                            {inv.obfuscatedName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{inv.obfuscatedName}</p>
                            <p className="text-[10px] text-muted-foreground">{inv.timeAgo}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-green-600">{formatCurrency(inv.amount)}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/60 sticky top-4">
            <CardContent className="p-5 space-y-5">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Precio base</p>
                <p className="text-2xl font-bold">{formatCurrency(property.price)}</p>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-green-50 border border-green-200 p-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">ROI estimado</span>
                </div>
                <span className="text-xl font-bold text-green-600">+{property.roi}%</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progreso de inversión</span>
                  <span className="text-sm font-bold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2.5" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{formatCurrency(raisedAmount)} recaudado</span>
                  <span>{formatCurrency(remaining)} disponible</span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Users, label: "Inversores", value: String(property.investors) },
                  { icon: Target, label: "Mínimo", value: formatCurrency(property.minInvestment) },
                  { icon: Clock, label: "Cierra", value: property.deadline },
                  { icon: Zap, label: "Demanda", value: progress > 80 ? "Alta" : "Media" },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-xl bg-muted/30 p-3 text-center">
                    <kpi.icon className="size-4 text-muted-foreground mx-auto mb-1" />
                    <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                    <p className="text-sm font-bold">{kpi.value}</p>
                  </div>
                ))}
              </div>

              <Button asChild size="lg" className="w-full h-12 rounded-xl font-semibold text-base">
                <Link href={`/dashboard/invest?property=${property.id}`}>
                  Invertir ahora
                  <ArrowRight className="size-5 ml-1" />
                </Link>
              </Button>

              <p className="text-[10px] text-muted-foreground text-center">
                Inversión mínima {formatCurrency(property.minInvestment)} · Proceso 100% digital
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <PropertyGalleryFullscreen
        images={property.images}
        initialIndex={galleryIndex}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        propertyName={property.name}
      />
    </div>
  );
}
