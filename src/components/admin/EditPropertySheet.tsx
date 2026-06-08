"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Bell,
  CalendarIcon,
  MapPin,
  Star,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { PropertyLocationMap } from "@/components/admin/PropertyLocationMap";
import {
  PropertyImagesManager,
  type PropertyImageItem,
} from "@/components/admin/PropertyImagesManager";
import { cn } from "@/lib/utils";
import { DISTRICTS, PROVINCES, REGIONS } from "@/lib/admin/mock-data";
import { getAdminPropertyImages } from "@/lib/admin/properties";
import { CURRENCY_OPTIONS, getCurrencySymbol, type PropertyCurrency } from "@/lib/currency";
import type { AdminProperty, PropertyStatus } from "@/lib/admin/types";

interface EditPropertySheetProps {
  property: AdminProperty | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (property: AdminProperty) => void;
}

const statusLabels: Record<PropertyStatus, string> = {
  published: "Publicada",
  draft: "Borrador",
  closed: "Cerrada",
};

function urlsToImageItems(urls: string[]): PropertyImageItem[] {
  return urls.map((url, index) => ({
    id: `img-${index}-${url.slice(-20).replace(/\W/g, "")}`,
    url,
    name: decodeURIComponent(url.split("/").pop()?.split("?")[0] ?? `imagen-${index + 1}.jpg`),
  }));
}

export function EditPropertySheet({
  property,
  open,
  onOpenChange,
  onSave,
}: EditPropertySheetProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roi, setRoi] = useState("");
  const [totalInvestment, setTotalInvestment] = useState("");
  const [publishDate, setPublishDate] = useState<Date>();
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [images, setImages] = useState<PropertyImageItem[]>([]);
  const [status, setStatus] = useState<PropertyStatus>("draft");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [notifyUsers, setNotifyUsers] = useState(false);
  const [currency, setCurrency] = useState<PropertyCurrency>("PEN");

  useEffect(() => {
    if (!open || !property) return;
    setTitle(property.title);
    setDescription(property.description);
    setRoi(String(property.roi));
    setTotalInvestment(String(property.totalInvestment));
    setPublishDate(parseISO(property.publishDate));
    setRegion(property.region);
    setProvince(property.province);
    setDistrict(property.district);
    setAddress(property.address);
    setLat(property.lat);
    setLng(property.lng);
    setImages(urlsToImageItems(getAdminPropertyImages(property)));
    setStatus(property.status);
    setFeatured(property.featured);
    setPublished(property.published);
    setNotifyUsers(property.notifyUsers);
    setCurrency(property.currency);
  }, [open, property]);

  if (!property) return null;

  const provinces = PROVINCES[region] ?? [];
  const districts = DISTRICTS[province] ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const parsedRoi = Number(roi);
      const parsedTotal = Number(totalInvestment);

      if (
        !title.trim() ||
        !description.trim() ||
        !publishDate ||
        !region ||
        !province ||
        !district ||
        !address.trim() ||
        Number.isNaN(parsedRoi) ||
        Number.isNaN(parsedTotal) ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        setLoading(false);
        toast.error("Completa todos los campos requeridos");
        return;
      }

      const imageUrls = images.map((img) => img.url);
      const coverImage = imageUrls[0] ?? property.image;

      const resolvedStatus: PropertyStatus = published ? "published" : status;
      const updated: AdminProperty = {
        ...property,
        title: title.trim(),
        description: description.trim(),
        roi: parsedRoi,
        totalInvestment: parsedTotal,
        publishDate: format(publishDate, "yyyy-MM-dd"),
        region,
        province,
        district,
        address: address.trim(),
        lat,
        lng,
        image: coverImage,
        images: imageUrls,
        status: resolvedStatus,
        featured,
        published,
        notifyUsers,
        currency,
      };

      onSave(updated);
      setLoading(false);
      onOpenChange(false);
      toast.success("Propiedad actualizada");
    }, 800);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl! lg:max-w-3xl! overflow-hidden p-0 flex flex-col"
      >
        <SheetHeader className="p-6 pb-4 border-b border-border/60 shrink-0">
          <SheetTitle className="text-lg">Editar propiedad</SheetTitle>
          <SheetDescription>
            Modifica la información de la oportunidad de inversión.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Información general
              </h3>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
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
                  Las inversiones existentes conservan su moneda original.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-roi">ROI estimado (%)</Label>
                  <Input
                    id="edit-roi"
                    type="number"
                    min={1}
                    max={100}
                    value={roi}
                    onChange={(e) => setRoi(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-total">Meta de inversi?n ({getCurrencySymbol(currency)})</Label>
                  <Input
                    id="edit-total"
                    type="number"
                    min={1000}
                    value={totalInvestment}
                    onChange={(e) => setTotalInvestment(e.target.value)}
                    required
                    className="rounded-xl"
                  />
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
                    <Calendar
                      mode="single"
                      selected={publishDate}
                      onSelect={setPublishDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Imágenes
              </h3>
              <PropertyImagesManager images={images} onChange={setImages} />
            </section>

            <Separator />

            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ubicación
              </h3>

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
                      <SelectValue placeholder="Seleccionar" />
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
                <Label htmlFor="edit-address">Dirección</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="edit-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="pl-9 rounded-xl"
                  />
                </div>
              </div>

              <PropertyLocationMap
                lat={lat}
                lng={lng}
                address={address}
                onLocationChange={(nextLat, nextLng) => {
                  setLat(nextLat);
                  setLng(nextLng);
                }}
                onAddressChange={setAddress}
              />
            </section>

            <Separator />

            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Publicación
              </h3>

              <div className="flex flex-col gap-1.5">
                <Label>Estado</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as PropertyStatus)}
                  disabled={published}
                >
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(statusLabels) as PropertyStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {published && (
                  <p className="text-[11px] text-muted-foreground">
                    Al estar publicada, el estado se mantiene como Publicada.
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <ControlToggle
                  icon={Star}
                  iconClass="text-amber-500"
                  label="Destacada"
                  description="Mostrar en la sección de propiedades destacadas"
                  checked={featured}
                  onCheckedChange={setFeatured}
                />
                <ControlToggle
                  icon={CheckCircle2}
                  iconClass="text-green-600"
                  label="Publicada"
                  description="Visible para inversores en la plataforma"
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <ControlToggle
                  icon={Bell}
                  iconClass="text-secondary"
                  label="Notificar usuarios"
                  description="Enviar alerta al guardar cambios relevantes"
                  checked={notifyUsers}
                  onCheckedChange={setNotifyUsers}
                />
              </div>
            </section>
          </div>

          <SheetFooter className="p-6 pt-4 border-t border-border/60 flex-row gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 rounded-xl">
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function ControlToggle({
  icon: Icon,
  iconClass,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ElementType;
  iconClass?: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 p-3">
      <div className="flex items-start gap-3 min-w-0">
        <Icon className={cn("size-4 shrink-0 mt-0.5", iconClass)} />
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
