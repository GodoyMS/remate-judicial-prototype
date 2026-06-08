"use client";

import { useEffect, useState } from "react";
import { Star, Video, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { AdminTestimonial } from "@/lib/admin/types";

interface EditTestimonialSheetProps {
  testimonial: AdminTestimonial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (testimonial: AdminTestimonial) => void;
  onDelete: (id: string) => void;
}

export function EditTestimonialSheet({
  testimonial,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: EditTestimonialSheetProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(5);
  const [amount, setAmount] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPosterUrl, setVideoPosterUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (!open || !testimonial) return;
    setName(testimonial.name);
    setRole(testimonial.role);
    setReview(testimonial.review);
    setStars(testimonial.stars);
    setAmount(testimonial.amount ?? "");
    setVideoUrl(testimonial.videoUrl ?? "");
    setVideoPosterUrl(testimonial.videoPosterUrl ?? "");
    setSortOrder(testimonial.sortOrder);
    setPublished(testimonial.published);
    setFeatured(testimonial.featured);
  }, [open, testimonial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonial) return;

    setLoading(true);
    const updated: AdminTestimonial = {
      ...testimonial,
      name: name.trim(),
      role: role.trim(),
      review: review.trim(),
      stars,
      amount: amount.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      videoPosterUrl: videoPosterUrl.trim() || undefined,
      sortOrder,
      published,
      featured,
    };

    setTimeout(() => {
      onSave(updated);
      setLoading(false);
      onOpenChange(false);
      toast.success("Testimonio actualizado");
    }, 500);
  };

  const handleDelete = () => {
    if (!testimonial) return;
    onDelete(testimonial.id);
    onOpenChange(false);
    toast.success("Testimonio eliminado");
  };

  if (!testimonial) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Editar testimonio</SheetTitle>
          <SheetDescription>
            Modifica el contenido y la visibilidad de este testimonio.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5 px-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-name">Nombre</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-role">Rol</Label>
            <Input
              id="edit-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-review">Testimonio</Label>
            <Textarea
              id="edit-review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
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
            <Label htmlFor="edit-amount">Monto (opcional)</Label>
            <Input
              id="edit-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-sort">Orden en carrusel</Label>
            <Input
              id="edit-sort"
              type="number"
              min={1}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="rounded-xl"
            />
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Video className="size-4 text-muted-foreground" />
              <p className="text-sm font-medium">Video</p>
            </div>
            <Input
              placeholder="URL del video"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="rounded-xl"
            />
            <Input
              placeholder="URL del poster"
              value={videoPosterUrl}
              onChange={(e) => setVideoPosterUrl(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Publicado</p>
                <p className="text-xs text-muted-foreground">Visible en landing</p>
              </div>
              <Switch checked={published} onCheckedChange={setPublished} />
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-3">
              <div>
                <p className="text-sm font-medium">Destacado</p>
                <p className="text-xs text-muted-foreground">Prioridad visual</p>
              </div>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>
          </div>

          <SheetFooter className="flex-col gap-2 sm:flex-col">
            <Button type="submit" disabled={loading} className="w-full rounded-xl font-semibold">
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4 mr-2" />
                  Eliminar testimonio
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar testimonio?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El testimonio de{" "}
                    <strong>{testimonial.name}</strong> dejará de mostrarse en la
                    plataforma.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
