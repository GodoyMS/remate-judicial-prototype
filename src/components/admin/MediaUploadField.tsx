"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  Film,
  Loader2,
  Trash2,
  UploadCloud,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type MediaKind = "image" | "video";

const ACCEPTED: Record<MediaKind, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
  video: ["video/mp4", "video/webm", "video/quicktime", "video/ogg"],
};

const HINT: Record<MediaKind, string> = {
  image: "JPG, PNG o WEBP",
  video: "MP4, WEBM o MOV",
};

export interface MediaValue {
  url: string;
  name: string;
}

interface MediaUploadFieldProps {
  kind: MediaKind;
  value?: MediaValue | null;
  onChange: (value: MediaValue | null) => void;
  /** Tailwind aspect helper, e.g. "aspect-video" or "aspect-square" */
  aspect?: string;
  /** Make the preview a circle (used for avatars). */
  circle?: boolean;
  maxFileSizeMb?: number;
  /** Compact variant renders a smaller inline dropzone. */
  compact?: boolean;
  emptyTitle?: string;
  emptyHint?: string;
  poster?: string;
  className?: string;
  disabled?: boolean;
}

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function MediaUploadField({
  kind,
  value,
  onChange,
  aspect = kind === "video" ? "aspect-video" : "aspect-square",
  circle = false,
  maxFileSizeMb = kind === "video" ? 80 : 8,
  compact = false,
  emptyTitle,
  emptyHint,
  poster,
  className,
  disabled = false,
}: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const ownedBlobRef = useRef<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [size, setSize] = useState<number | null>(null);

  const releaseOwnedBlob = useCallback(() => {
    if (ownedBlobRef.current) {
      URL.revokeObjectURL(ownedBlobRef.current);
      ownedBlobRef.current = null;
    }
  }, []);

  useEffect(() => releaseOwnedBlob, [releaseOwnedBlob]);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!ACCEPTED[kind].includes(file.type)) {
        toast.error(`Formato no soportado. Usa ${HINT[kind]}.`);
        return;
      }
      if (file.size > maxFileSizeMb * 1024 * 1024) {
        toast.error(`El archivo supera ${maxFileSizeMb}MB.`);
        return;
      }

      releaseOwnedBlob();
      const url = URL.createObjectURL(file);
      ownedBlobRef.current = url;
      setSize(file.size);
      setUploading(true);
      // Simulate an async upload to a storage bucket for the prototype.
      window.setTimeout(() => {
        setUploading(false);
        onChange({ url, name: file.name });
        toast.success(
          kind === "video" ? "Video cargado" : "Imagen cargada",
        );
      }, 650 + Math.random() * 350);
    },
    [kind, maxFileSizeMb, onChange, releaseOwnedBlob],
  );

  const openPicker = () => {
    if (disabled || uploading) return;
    inputRef.current?.click();
  };

  const handleRemove = () => {
    releaseOwnedBlob();
    setSize(null);
    onChange(null);
  };

  const hasValue = Boolean(value?.url);

  const dropHandlers = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      handleFile(e.dataTransfer.files?.[0]);
    },
  };

  const Icon = kind === "video" ? Film : ImagePlus;

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED[kind].join(",")}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {hasValue ? (
        <div
          className={cn(
            "group relative overflow-hidden border border-border/60 bg-muted/30",
            circle ? "rounded-full" : "rounded-2xl",
            aspect,
          )}
        >
          {kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value!.url}
              alt={value!.name}
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <video
              src={value!.url}
              poster={poster}
              controls
              playsInline
              className="absolute inset-0 size-full bg-black object-contain"
            />
          )}

          {uploading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/60 backdrop-blur-[1px]">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span className="text-[10px] font-medium">Subiendo…</span>
            </div>
          )}

          {!disabled && kind === "image" && (
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-end gap-1.5 bg-gradient-to-t from-black/65 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={openPicker}
                className="inline-flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-semibold text-foreground shadow-sm hover:bg-white"
              >
                <RefreshCw className="size-3" />
                Cambiar
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 rounded-lg bg-red-600/90 px-2 py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-red-600"
              >
                <Trash2 className="size-3" />
                Quitar
              </button>
            </div>
          )}
        </div>
      ) : circle ? (
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          {...dropHandlers}
          className={cn(
            "flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed p-2 text-center transition-colors",
            dragOver
              ? "border-primary bg-primary/5 text-primary"
              : "border-border/70 bg-muted/20 text-muted-foreground hover:border-primary/40 hover:bg-muted/35",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin text-primary" />
          ) : (
            <Icon className="size-5" />
          )}
          {emptyTitle && (
            <span className="text-[9px] font-semibold leading-none text-foreground">
              {emptyTitle}
            </span>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          {...dropHandlers}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-center transition-colors",
            compact ? "px-3 py-5" : "px-4 py-8",
            dragOver
              ? "border-primary bg-primary/5 text-primary"
              : "border-border/70 bg-muted/20 text-muted-foreground hover:border-primary/40 hover:bg-muted/35",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          {uploading ? (
            <Loader2 className="size-6 animate-spin text-primary" />
          ) : (
            <div
              className={cn(
                "flex items-center justify-center rounded-2xl bg-background shadow-sm",
                compact ? "size-9" : "size-12",
              )}
            >
              <Icon className={compact ? "size-4" : "size-6"} />
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-foreground">
              {emptyTitle ??
                (kind === "video" ? "Sube un video" : "Sube una imagen")}
            </p>
            <p className="mt-0.5 text-[10px] leading-tight">
              {emptyHint ?? (
                <>
                  Arrastra o haz clic · {HINT[kind]} · máx {maxFileSizeMb}MB
                </>
              )}
            </p>
          </div>
        </button>
      )}

      {hasValue && (
        <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
          <span className="flex min-w-0 items-center gap-1.5">
            <UploadCloud className="size-3 shrink-0 text-emerald-600" />
            <span className="truncate">{value!.name}</span>
          </span>
          <div className="flex shrink-0 items-center gap-2">
            {size != null && <span className="tabular-nums">{formatBytes(size)}</span>}
            {kind === "video" && !disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="font-semibold text-destructive hover:underline"
              >
                Quitar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
