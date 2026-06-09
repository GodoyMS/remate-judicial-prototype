"use client";

import { useState } from "react";
import { Video, Star, Sparkles, Eye, UserRound } from "lucide-react";
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
import { MediaUploadField, type MediaValue } from "@/components/admin/MediaUploadField";
import { cn } from "@/lib/utils";
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

const MAX_REVIEW = 320;

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
  const [hoverStars, setHoverStars] = useState(0);
  const [amount, setAmount] = useState("");
  const [avatar, setAvatar] = useState<MediaValue | null>(null);
  const [video, setVideo] = useState<MediaValue | null>(null);
  const [poster, setPoster] = useState<MediaValue | null>(null);
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);

  const resetForm = () => {
    setName("");
    setRole("");
    setReview("");
    setStars(5);
    setHoverStars(0);
    setAmount("");
    setAvatar(null);
    setVideo(null);
    setPoster(null);
    setPublished(true);
    setFeatured(false);
  };

  const initials = getInitials(name.trim()) || "??";

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
      avatar: initials,
      avatarImageUrl: avatar?.url || undefined,
      videoUrl: video?.url || undefined,
      videoPosterUrl: poster?.url || avatar?.url || undefined,
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

  const activeStars = hoverStars || stars;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) resetForm();
      }}
    >
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border/60 bg-gradient-to-br from-[#9FE870]/15 via-background to-background px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#163300] text-[#9FE870]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Nuevo testimonio</DialogTitle>
              <DialogDescription className="mt-0.5">
                Comparte la historia de un inversor en la landing page.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex max-h-[calc(92vh-160px)] flex-col gap-6 overflow-y-auto px-6 py-6"
        >
          {/* Identity */}
          <section className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-2">
              <div className="size-24">
                <MediaUploadField
                  kind="image"
                  circle
                  value={avatar}
                  onChange={setAvatar}
                  aspect="aspect-square"
                  emptyTitle="Foto"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {avatar ? "Avatar" : `Sin foto · ${initials}`}
              </p>
            </div>

            <div className="grid flex-1 gap-4 sm:grid-cols-2">
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
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="t-amount">Monto invertido (opcional)</Label>
                <Input
                  id="t-amount"
                  placeholder="Ej. S/ 12,500 invertido"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>
          </section>

          {/* Review + rating */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="t-review">Testimonio</Label>
              <span
                className={cn(
                  "text-[10px] tabular-nums",
                  review.length > MAX_REVIEW
                    ? "font-semibold text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {review.length}/{MAX_REVIEW}
              </span>
            </div>
            <Textarea
              id="t-review"
              placeholder="Escribe el testimonio del inversor…"
              rows={4}
              maxLength={MAX_REVIEW}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              className="resize-none rounded-xl"
            />
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground">
                Calificación
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setStars(n)}
                    onMouseEnter={() => setHoverStars(n)}
                    onMouseLeave={() => setHoverStars(0)}
                    className="rounded-md p-0.5 transition-transform hover:scale-110"
                    aria-label={`${n} estrellas`}
                  >
                    <Star
                      className={cn(
                        "size-5 transition-colors",
                        n <= activeStars
                          ? "fill-amber-400 text-amber-400"
                          : "fill-transparent text-muted-foreground/40",
                      )}
                    />
                  </button>
                ))}
                <span className="ml-1 text-xs font-semibold tabular-nums text-foreground">
                  {stars}.0
                </span>
              </div>
            </div>
          </section>

          {/* Video */}
          <section className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Video className="size-4 text-muted-foreground" />
              <p className="text-sm font-medium">Video testimonial</p>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase text-muted-foreground">
                Opcional
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Archivo de video</Label>
                <MediaUploadField
                  kind="video"
                  value={video}
                  onChange={setVideo}
                  poster={poster?.url || avatar?.url}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Miniatura / poster</Label>
                <MediaUploadField
                  kind="image"
                  aspect="aspect-video"
                  value={poster}
                  onChange={setPoster}
                  emptyTitle="Poster"
                  emptyHint="Imagen de portada"
                />
              </div>
            </div>
          </section>

          {/* Visibility */}
          <section className="flex flex-col gap-3 rounded-2xl border border-border/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="size-4 text-muted-foreground" />
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
              <div className="flex items-center gap-2">
                <Star className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Destacar</p>
                  <p className="text-xs text-muted-foreground">Prioridad en el carrusel</p>
                </div>
              </div>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>
          </section>
        </form>

        <DialogFooter className="border-t border-border/60 bg-muted/15 px-6 py-4">
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
            onClick={handleSubmit}
            disabled={loading || !name.trim() || !role.trim() || !review.trim()}
            className="rounded-xl font-semibold"
          >
            {loading ? (
              "Guardando…"
            ) : (
              <>
                <UserRound className="mr-2 size-4" />
                Crear testimonio
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
