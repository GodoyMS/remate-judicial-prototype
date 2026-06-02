"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  GripVertical,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
  Upload,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export interface PropertyImageItem {
  id: string;
  url: string;
  name: string;
}

interface PropertyImagesManagerProps {
  images: PropertyImageItem[];
  onChange: (images: PropertyImageItem[]) => void;
  maxImages?: number;
  maxFileSizeMb?: number;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function createId() {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function PropertyImagesManager({
  images,
  onChange,
  maxImages = 12,
  maxFileSizeMb = 10,
}: PropertyImagesManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PropertyImageItem | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
  const blobUrlsRef = useRef<Set<string>>(new Set());

  const trackBlobUrl = useCallback((url: string) => {
    if (url.startsWith("blob:")) {
      blobUrlsRef.current.add(url);
    }
  }, []);

  const revokeBlobUrl = useCallback((url: string) => {
    if (url.startsWith("blob:") && blobUrlsRef.current.has(url)) {
      URL.revokeObjectURL(url);
      blobUrlsRef.current.delete(url);
    }
  }, []);

  useEffect(() => {
    const blobs = blobUrlsRef.current;
    return () => {
      blobs.forEach((url) => URL.revokeObjectURL(url));
      blobs.clear();
    };
  }, []);

  const remainingSlots = maxImages - images.length;

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      const available = maxImages - images.length;
      if (available <= 0) {
        toast.error(`Máximo ${maxImages} imágenes por propiedad`);
        return;
      }

      const toAdd = fileArray.slice(0, available);
      if (fileArray.length > available) {
        toast.warning(`Solo se agregaron ${available} imagen(es). Límite alcanzado.`);
      }

      const newItems: PropertyImageItem[] = [];

      for (const file of toAdd) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          toast.error(`${file.name}: formato no soportado (usa JPG, PNG o WEBP)`);
          continue;
        }
        if (file.size > maxFileSizeMb * 1024 * 1024) {
          toast.error(`${file.name}: supera ${maxFileSizeMb}MB`);
          continue;
        }

        const url = URL.createObjectURL(file);
        trackBlobUrl(url);
        const id = createId();
        newItems.push({ id, url, name: file.name });
        setUploadingIds((prev) => new Set(prev).add(id));
        window.setTimeout(() => {
          setUploadingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, 600 + Math.random() * 400);
      }

      if (newItems.length === 0) return;

      onChange([...images, ...newItems]);
      toast.success(`${newItems.length} imagen(es) agregada(s)`);
    },
    [images, maxFileSizeMb, maxImages, onChange, trackBlobUrl]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    revokeBlobUrl(deleteTarget.url);
    onChange(images.filter((img) => img.id !== deleteTarget.id));
    toast.success("Imagen eliminada");
    setDeleteTarget(null);
  };

  const setAsCover = (id: string) => {
    const index = images.findIndex((img) => img.id === id);
    if (index <= 0) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
    toast.success("Imagen establecida como portada");
  };

  const handleReorder = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const fromIndex = images.findIndex((img) => img.id === fromId);
    const toIndex = images.findIndex((img) => img.id === toId);
    if (fromIndex < 0 || toIndex < 0) return;

    const next = [...images];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">Galería de imágenes</p>
          <p className="text-xs text-muted-foreground">
            Arrastra para reordenar. La primera imagen es la portada.
          </p>
        </div>
        <Badge variant="outline" className="text-[10px] tabular-nums shrink-0">
          {images.length}/{maxImages}
        </Badge>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image, index) => {
            const isUploading = uploadingIds.has(image.id);
            return (
            <div
              key={image.id}
              draggable={!isUploading}
              onDragStart={() => setDraggingId(image.id)}
              onDragEnd={() => setDraggingId(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (draggingId) handleReorder(draggingId, image.id);
                setDraggingId(null);
              }}
              className={cn(
                "group relative aspect-[4/3] rounded-xl border border-border/60 overflow-hidden bg-muted/30",
                draggingId === image.id && "opacity-50 ring-2 ring-primary/40",
                !isUploading && "cursor-grab active:cursor-grabbing"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.name}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]",
                  isUploading && "opacity-60 blur-[1px]"
                )}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

              {index === 0 && (
                <Badge className="absolute top-2 left-2 text-[10px] gap-1 z-10">
                  <Star className="size-3 fill-current" />
                  Portada
                </Badge>
              )}

              {isUploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/50 z-10">
                  <Loader2 className="size-5 animate-spin text-primary" />
                  <span className="text-[10px] font-medium text-foreground/80">
                    Subiendo...
                  </span>
                </div>
              )}

              {!isUploading && (
                <div className="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    type="button"
                    className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Arrastrar para reordenar"
                  >
                    <GripVertical className="size-3.5" />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewUrl(image.url)}
                      className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                      aria-label="Ver imagen"
                    >
                      <ZoomIn className="size-3.5" />
                    </button>
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => setAsCover(image.id)}
                        className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                        aria-label="Establecer como portada"
                      >
                        <Star className="size-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(image)}
                      className="p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-600 transition-colors"
                      aria-label="Eliminar imagen"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <p className="absolute top-2 right-2 text-[9px] font-medium text-white/90 bg-black/40 rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity truncate max-w-[55%] z-10">
                {image.name}
              </p>
            </div>
          );
          })}

          {remainingSlots > 0 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-[4/3] rounded-xl border-2 border-dashed border-border/80 bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
            >
              <ImagePlus className="size-6" />
              <span className="text-xs font-medium">Agregar</span>
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors p-8 flex flex-col items-center justify-center gap-3 text-muted-foreground"
        >
          <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
            <Upload className="size-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Sube imágenes de la propiedad</p>
            <p className="text-xs mt-1">Arrastra archivos aquí o haz clic para seleccionar</p>
            <p className="text-[10px] mt-2 text-muted-foreground/70">
              JPG, PNG, WEBP · máx. {maxFileSizeMb}MB · hasta {maxImages} imágenes
            </p>
          </div>
        </button>
      )}

      {images.length > 0 && remainingSlots > 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "rounded-xl border-2 border-dashed p-4 flex items-center justify-center gap-3 transition-colors cursor-pointer",
            dragOver
              ? "border-primary bg-primary/5 text-primary"
              : "border-border/60 bg-muted/10 text-muted-foreground hover:bg-muted/25"
          )}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-4 shrink-0" />
          <p className="text-xs font-medium">
            Arrastra más imágenes o{" "}
            <span className="text-primary underline-offset-2 hover:underline">
              selecciona archivos
            </span>
            {" "}({remainingSlots} disponibles)
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.name
                ? `Se eliminará "${deleteTarget.name}" de la galería.`
                : "Esta acción no se puede deshacer."}
              {deleteTarget && images[0]?.id === deleteTarget.id && images.length > 1 && (
                <span className="block mt-2 text-amber-700">
                  Es la portada actual. La siguiente imagen pasará a ser la portada.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {previewUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa de imagen"
        >
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 rounded-xl"
            onClick={() => setPreviewUrl(null)}
          >
            Cerrar
          </Button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Vista previa"
            className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
