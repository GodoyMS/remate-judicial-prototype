"use client";

import { useState } from "react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Upload,
  MapPin,
  CalendarIcon,
  Bell,
  ImageIcon,
  X,
  Crown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DISTRICTS, PROVINCES, REGIONS } from "@/lib/admin/mock-data";
import { CURRENCY_OPTIONS, getCurrencySymbol, type PropertyCurrency } from "@/lib/currency";
import {
  generatePremiumPropertyId,
  saveCreatedPremiumProperty,
} from "@/lib/app-store";
import type { AdminProperty } from "@/lib/admin/types";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop";

const PROPERTY_TYPES = [
  "Departamento",
  "Casa",
  "Penthouse",
  "Villa",
  "Loft",
  "Oficina",
  "Local comercial",
] as const;

interface CreatePremiumPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function CreatePremiumPropertyDialog({
  open,
  onOpenChange,
  onCreated,
}: CreatePremiumPropertyDialogProps) {
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState<string>("Lima");
  const [province, setProvince] = useState<string>("Lima");
  const [district, setDistrict] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("Departamento");
  const [publishDate, setPublishDate] = useState<Date>(new Date());
  const [premiumDeadline, setPremiumDeadline] = useState<Date>(addDays(new Date(), 7));
  const [notifyPremiumUsers, setNotifyPremiumUsers] = useState(true);
  const [featured, setFeatured] = useState(true);
  const [currency, setCurrency] = useState<PropertyCurrency>("PEN");
  const [files, setFiles] = useState<string[]>([]);

  const provinces = PROVINCES[region] ?? [];
  const districts = DISTRICTS[province] ?? [];

  const resetForm = () => {
    setRegion("Lima");
    setProvince("Lima");
    setDistrict("");
    setPropertyType("Departamento");
    setPublishDate(new Date());
    setPremiumDeadline(addDays(new Date(), 7));
    setNotifyPremiumUsers(true);
    setFeatured(true);
    setCurrency("PEN");
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    const names = Array.from(selected).map((f) => f.name);
    setFiles((prev) => [...prev, ...names]);
    toast.success(`${names.length} archivo(s) agregado(s)`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const roi = Number(formData.get("roi"));
    const premiumRoi = Number(formData.get("premiumRoi"));
    const totalInvestment = Number(formData.get("total"));
    const area = String(formData.get("area") ?? "").trim();

    if (!district) {
      toast.error("Selecciona un distrito");
      return;
    }
    if (premiumRoi <= roi) {
      toast.error("El ROI Premium debe ser mayor al ROI estándar");
      return;
    }
    if (premiumDeadline <= new Date()) {
      toast.error("La fecha límite premium debe ser futura");
      return;
    }

    setLoading(true);

    const id = generatePremiumPropertyId();
    const today = format(new Date(), "yyyy-MM-dd");
    const publishDateStr = publishDate ? format(publishDate, "yyyy-MM-dd") : today;
    const deadlineStr = `${format(premiumDeadline, "yyyy-MM-dd")}T23:59:59`;

    const property: AdminProperty = {
      id,
      title,
      description,
      roi,
      publishDate: publishDateStr,
      totalInvestment,
      raisedAmount: 0,
      address,
      region,
      province,
      district,
      lat: -12.0464,
      lng: -77.0428,
      published: true,
      featured,
      notifyUsers: false,
      image: DEFAULT_IMAGE,
      images: [DEFAULT_IMAGE],
      investorsCount: 0,
      createdAt: today,
      status: "published",
      currency,
      isPremiumExclusive: true,
      premiumRoi,
      premiumDeadline: deadlineStr,
      premiumStatus: "available",
      notifyPremiumUsers,
      propertyType,
      area,
    };

    saveCreatedPremiumProperty(property);

    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      resetForm();
      onCreated?.();
      toast.success("Propiedad Premium creada exitosamente", {
        description: notifyPremiumUsers
          ? "Se notificará a los usuarios Premium sobre la nueva oportunidad."
          : "La ventana exclusiva está activa para inversores Premium.",
      });
    }, 800);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <Crown className="size-5 text-amber-600" />
            Nueva propiedad Premium
          </DialogTitle>
          <DialogDescription>
            Crea una ventana exclusiva para inversores Premium con captura al 100%.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="premium-title">Título</Label>
            <Input
              id="premium-title"
              name="title"
              placeholder="Ej. Penthouse Vista al Mar — Chorrillos"
              required
              className="rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="premium-description">Descripción</Label>
            <Textarea
              id="premium-description"
              name="description"
              placeholder="Describe la propiedad y la oportunidad exclusiva Premium..."
              rows={3}
              required
              className="rounded-xl"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Tipo de propiedad</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="premium-area">Área</Label>
              <Input
                id="premium-area"
                name="area"
                placeholder="Ej. 240 m²"
                required
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Moneda de la propiedad</Label>
            <Select
              value={currency}
              onValueChange={(v) => setCurrency(v as PropertyCurrency)}
            >
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="premium-roi">ROI estándar (%)</Label>
              <Input
                id="premium-roi"
                name="roi"
                type="number"
                min={1}
                max={100}
                placeholder="22"
                required
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="premium-premium-roi" className="flex items-center gap-1">
                <TrendingUp className="size-3 text-amber-600" />
                ROI Premium (%)
              </Label>
              <Input
                id="premium-premium-roi"
                name="premiumRoi"
                type="number"
                min={1}
                max={100}
                placeholder="48"
                required
                className="rounded-xl border-amber-200 focus-visible:ring-amber-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="premium-total">
                Monto total ({getCurrencySymbol(currency)})
              </Label>
              <Input
                id="premium-total"
                name="total"
                type="number"
                min={1000}
                placeholder="890000"
                required
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Fecha de publicación</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start rounded-xl font-normal",
                      !publishDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="size-4 mr-2" />
                    {publishDate
                      ? format(publishDate, "PPP", { locale: es })
                      : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={publishDate} onSelect={(d) => d && setPublishDate(d)} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-1">
                <Crown className="size-3 text-amber-600" />
                Vence ventana Premium
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start rounded-xl font-normal border-amber-200",
                      !premiumDeadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="size-4 mr-2 text-amber-600" />
                    {premiumDeadline
                      ? format(premiumDeadline, "PPP", { locale: es })
                      : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={premiumDeadline}
                    onSelect={(d) => d && setPremiumDeadline(d)}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Región</Label>
              <Select
                value={region}
                onValueChange={(v) => {
                  setRegion(v);
                  setProvince("");
                  setDistrict("");
                }}
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Provincia</Label>
              <Select
                value={province}
                onValueChange={(v) => {
                  setProvince(v);
                  setDistrict("");
                }}
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Distrito</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="premium-address">Dirección</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="premium-address"
                name="address"
                placeholder="Av. Javier Prado Este 1240, San Isidro"
                required
                className="pl-9 rounded-xl"
              />
            </div>
          </div>

          <div className="rounded-xl border border-amber-200/60 overflow-hidden bg-amber-50/30">
            <div className="aspect-[16/6] bg-muted/40 flex flex-col items-center justify-center gap-2 relative">
              <MapPin className="size-8 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">Vista previa de ubicación</p>
              <Badge variant="outline" className="absolute top-2 right-2 text-[10px] bg-white/80">
                Mapa simulado
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Archivos e imágenes</Label>
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/80 bg-muted/20 p-6 cursor-pointer hover:bg-muted/40 transition-colors">
              <Upload className="size-8 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Arrastra archivos o haz clic para subir
              </span>
              <span className="text-xs text-muted-foreground/60">PNG, JPG, PDF — máx. 10MB</span>
              <input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
            </label>
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {files.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1 text-xs bg-muted rounded-lg px-2 py-1"
                  >
                    <ImageIcon className="size-3" />
                    {f}
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((x) => x !== f))}
                    >
                      <X className="size-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-amber-200/60 p-4 bg-amber-50/40">
            <div className="flex items-center gap-3">
              <Bell className="size-4 text-amber-600" />
              <div>
                <p className="text-sm font-medium">Notificar usuarios Premium</p>
                <p className="text-xs text-muted-foreground">
                  Enviar alerta push y email a inversores Premium
                </p>
              </div>
            </div>
            <Switch checked={notifyPremiumUsers} onCheckedChange={setNotifyPremiumUsers} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 p-4 bg-accent/30">
            <div>
              <p className="text-sm font-medium">Destacar en listado</p>
              <p className="text-xs text-muted-foreground">Mostrar como propiedad destacada</p>
            </div>
            <Switch checked={featured} onCheckedChange={setFeatured} />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white"
            >
              {loading ? "Creando..." : "Crear propiedad Premium"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
