"use client";

import { useState } from "react";
import { Video, Star, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminTestimonial } from "@/lib/admin/types";

interface CreateTestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (testimonial: AdminTestimonial) => void;
  nextSortOrder: number;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function CreateTestimonialDialog({
  open,
  onOpenChange,
  onCreate,
  nextSortOrder,
}: CreateTestimonialDialogProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(5);
  const [amount, setAmount] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPosterUrl, setVideoPosterUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);

  const resetForm = () => {
    setName("");
    setRole("");
    setReview("");
    setStars(5);
    setAmount("");
    setVideoUrl("");
    setVideoPosterUrl("");
    setPublished(true);
    setFeatured(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const testimonial: AdminTestimonial = {
      id: `t${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      review: review.trim(),
      stars,
      amount: amount.trim() || undefined,
      avatar: getInitials(name.trim()) || "??",
      videoUrl: videoUrl.trim() || undefined,
      videoPosterUrl: videoPosterUrl.trim() || undefined,
      published,
      featured,
      sortOrder: nextSortOrder,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setTimeout(() => {
      onCreate(testimonial);
      setLoading(false);
      onOpenChange(false);
      resetForm();
      toast.success("Testimonio creado", {
        description: published
          ? "Ya es visible en la landing page."
          : "Guardado como borrador.",
      });
    }, 600);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) resetForm();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Nuevo testimonio</DialogTitle>
          <DialogDescription>
            Agrega la historia de un inversor para mostrarla en la landing page.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="t-name">Nombre completo</Label>
              <Input
                id="t-name"
                placeholder="Ej. María Elena Quispe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="t-role">Rol / ocupación</Label>
              <Input
                id="t-role"
                placeholder="Ej. Inversionista independiente"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="t-review">Testimonio</Label>
            <Textarea
              id="t-review"
              placeholder="Escribe el testimonio del inversor..."
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Calificación</Label>
              <div className="flex items-center gap-1">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="ml-1 text-xs text-muted-foreground">{stars}/5</span>
              </div>
            </div>
            <Slider
              value={[stars]}
              onValueChange={([v]) => setStars(v)}
              min={1}
              max={5}
              step={1}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="t-amount">Monto invertido (opcional)</Label>
            <Input
              id="t-amount"
              placeholder="Ej. S/ 12,500 invertido"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Video className="size-4 text-muted-foreground" />
              <p className="text-sm font-medium">Video testimonial (opcional)</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="t-video">URL del video</Label>
              <Input
                id="t-video"
                placeholder="https://..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="t-poster">URL del poster / miniatura</Label>
              <Input
                id="t-poster"
                placeholder="https://..."
                value={videoPosterUrl}
                onChange={(e) => setVideoPosterUrl(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Publicar en landing</p>
                  <p className="text-xs text-muted-foreground">
                    Visible en el carrusel de testimonios
                  </p>
                </div>
              </div>
              <Switch checked={published} onCheckedChange={setPublished} />
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-3">
              <div>
                <p className="text-sm font-medium">Destacar</p>
                <p className="text-xs text-muted-foreground">
                  Prioridad en el carrusel
                </p>
              </div>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl font-semibold">
              {loading ? "Guardando..." : "Crear testimonio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
