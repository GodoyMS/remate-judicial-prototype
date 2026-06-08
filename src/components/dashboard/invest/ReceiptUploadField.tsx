"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, ImageIcon, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReceiptUploadFieldProps = {
  id?: string;
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  hint?: string;
};

export function ReceiptUploadField({
  id = "receipt-upload",
  label,
  value,
  onChange,
  hint = "Foto (JPG, PNG) o PDF — máx. 10 MB",
}: ReceiptUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (!value?.type.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleFile = (file: File | null) => {
    if (!file) {
      setFileError(null);
      onChange(null);
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setFileError("Formato no válido. Usa JPG, PNG, WebP o PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError("El archivo supera el límite de 10 MB.");
      return;
    }
    setFileError(null);
    onChange(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    handleFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {!value ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "group flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-6 transition-all",
            dragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform group-hover:scale-110">
            <Upload className="size-5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Arrastra tu archivo aquí o haz clic</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-muted-foreground shadow-sm">
              <ImageIcon className="size-3" /> Foto
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-muted-foreground shadow-sm">
              <FileText className="size-3" /> PDF
            </span>
          </div>
        </button>
      ) : null}
      {fileError && (
        <p className="text-xs text-destructive font-medium">{fileError}</p>
      )}
      {value ? (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm">
          <div className="flex items-center gap-3 p-3">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Vista previa" className="size-14 rounded-lg object-cover" />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <FileText className="size-6" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{value.name}</p>
              <p className="text-xs text-muted-foreground">
                {(value.size / 1024).toFixed(0)} KB · {value.type === "application/pdf" ? "PDF" : "Imagen"}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 rounded-lg text-muted-foreground hover:text-destructive"
              onClick={clearFile}
            >
              <X className="size-4" />
            </Button>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-t border-border/50 py-2 text-xs font-medium text-primary hover:bg-muted/30"
          >
            Cambiar archivo
          </button>
        </div>
      ) : null}
    </div>
  );
}
