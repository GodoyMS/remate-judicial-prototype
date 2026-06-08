"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Upload,
  MapPin,
  CalendarIcon,
  Bell,
  ImageIcon,
  X,
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

interface CreatePropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePropertyDialog({ open, onOpenChange }: CreatePropertyDialogProps) {
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState<string>("Lima");
  const [province, setProvince] = useState<string>("Lima");
  const [district, setDistrict] = useState<string>("");
  const [publishDate, setPublishDate] = useState<Date>();
  const [notifyUsers, setNotifyUsers] = useState(true);
  const [currency, setCurrency] = useState<PropertyCurrency>("PEN");
  const [files, setFiles] = useState<string[]>([]);

  const provinces = PROVINCES[region] ?? [];
  const districts = DISTRICTS[province] ?? [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    const names = Array.from(selected).map((f) => f.name);
    setFiles((prev) => [...prev, ...names]);
    toast.success(`${names.length} archivo(s) agregado(s)`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      toast.success("Propiedad creada exitosamente", {
        description: notifyUsers
          ? "Se notificará a los usuarios al publicarse."
          : "Guardada como borrador.",
      });
      setFiles([]);
      setPublishDate(undefined);
      setCurrency("PEN");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Nueva propiedad</DialogTitle>
          <DialogDescription>
            Completa la información para registrar una nueva oportunidad de inversión.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Ej. Departamento en San Isidro" required className="rounded-xl" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe la propiedad, características y potencial de inversión..."
              rows={3}
              required
              className="rounded-xl"
            />
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
            <p className="text-[11px] text-muted-foreground">
              Todas las inversiones de esta propiedad se registrarán en la moneda seleccionada.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="roi">ROI estimado (%)</Label>
              <Input id="roi" type="number" min={1} max={100} placeholder="22" required className="rounded-xl" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="total">Monto total de inversión ({getCurrencySymbol(currency)})</Label>
              <Input id="total" type="number" min={1000} placeholder="285000" required className="rounded-xl" />
            </div>
          </div>

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
                <Calendar mode="single" selected={publishDate} onSelect={setPublishDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Región</Label>
              <Select value={region} onValueChange={(v) => { setRegion(v); setProvince(""); setDistrict(""); }}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Provincia</Label>
              <Select value={province} onValueChange={(v) => { setProvince(v); setDistrict(""); }}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
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
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Dirección</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="Av. Javier Prado Este 1240, San Isidro"
                required
                className="pl-9 rounded-xl"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border/60 overflow-hidden bg-muted/20">
            <div className="aspect-[16/6] bg-muted/40 flex flex-col items-center justify-center gap-2 relative">
              <MapPin className="size-8 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">Vista previa de Google Maps</p>
              <p className="text-[10px] text-muted-foreground/60">-12.0964, -77.0428 · San Isidro, Lima</p>
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
                    <button type="button" onClick={() => setFiles((prev) => prev.filter((x) => x !== f))}>
                      <X className="size-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 p-4 bg-accent/30">
            <div className="flex items-center gap-3">
              <Bell className="size-4 text-secondary" />
              <div>
                <p className="text-sm font-medium">Notificar a usuarios</p>
                <p className="text-xs text-muted-foreground">Enviar alerta push y email al publicar</p>
              </div>
            </div>
            <Switch checked={notifyUsers} onCheckedChange={setNotifyUsers} />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl">
              {loading ? "Creando..." : "Crear propiedad"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
