"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, CloudUpload, Loader2, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { uploadDocumentSchema } from "@/lib/documents/schema";
import { uploadDocument } from "@/lib/documents/store";
import { ACCEPT_ATTRIBUTE, formatFileSize, getDocumentKind } from "@/lib/documents/types";
import { DocumentKindIcon } from "./DocumentKindIcon";

type FieldErrors = Partial<Record<"title" | "description" | "file", string>>;
type Phase = "idle" | "uploading" | "error";

const DESCRIPTION_MAX = 500;

export function UploadDocumentDialog({
  open,
  onOpenChange,
  userId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}) {
  const ids = { title: useId(), description: useId(), file: useId() };
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);

  // Vista previa local para imágenes; se libera al cambiar de archivo.
  const preview = useMemo(
    () => (file && getDocumentKind(file) === "image" ? URL.createObjectURL(file) : null),
    [file]
  );
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  // Reinicia el formulario al cerrar (tras la animación de salida).
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setTitle("");
      setDescription("");
      setFile(null);
      setErrors({});
      setSubmitted(false);
      setPhase("idle");
      setProgress(0);
    }, 200);
    return () => clearTimeout(t);
  }, [open]);

  function validate(next = { title, description, file }) {
    const result = uploadDocumentSchema.safeParse({
      title: next.title,
      description: next.description || undefined,
      file: next.file ?? undefined,
    });
    if (result.success) {
      setErrors({});
      return result.data;
    }
    const fieldErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FieldErrors;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    setErrors(fieldErrors);
    return null;
  }

  function pickFile(f: File | null) {
    setFile(f);
    // El archivo se valida al instante: el usuario sabe ya si es demasiado grande.
    if (f || submitted) validate({ title, description, file: f });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const data = validate();
    if (!data) return;
    setPhase("uploading");
    try {
      await uploadDocument(userId, data, setProgress);
      toast.success("Documento subido", { description: data.title });
      onOpenChange(false);
    } catch {
      setPhase("error");
    }
  }

  const uploading = phase === "uploading";
  const kind = file ? getDocumentKind(file) : null;

  return (
    <Dialog open={open} onOpenChange={(o) => !uploading && onOpenChange(o)}>
      <DialogContent className="w-[calc(100%-1.5rem)] rounded-3xl sm:max-w-lg">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader className="pb-5 pr-8">
            <DialogTitle className="text-lg">Subir documento</DialogTitle>
            <DialogDescription>
              Imagen, PDF o Word de hasta 20 MB. Solo tú y el equipo de verificación pueden verlo.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 pb-6">
            {/* Título */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={ids.title}>
                Título <span className="text-destructive">*</span>
              </Label>
              <Input
                id={ids.title}
                value={title}
                disabled={uploading}
                placeholder="Ej. Constancia de cuenta bancaria"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? `${ids.title}-err` : undefined}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (submitted) validate({ title: e.target.value, description, file });
                }}
                className="h-11 rounded-xl"
                autoFocus
              />
              <FieldError id={`${ids.title}-err`} message={errors.title} />
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <Label htmlFor={ids.description}>
                  Descripción <span className="font-normal text-muted-foreground">(opcional)</span>
                </Label>
                <span
                  className={cn(
                    "text-[11px] tabular-nums text-muted-foreground",
                    description.length > DESCRIPTION_MAX && "text-destructive"
                  )}
                >
                  {description.length}/{DESCRIPTION_MAX}
                </span>
              </div>
              <Textarea
                id={ids.description}
                value={description}
                disabled={uploading}
                rows={3}
                placeholder="Agrega contexto para el equipo de verificación"
                aria-invalid={!!errors.description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (submitted) validate({ title, description: e.target.value, file });
                }}
                className="resize-none rounded-xl"
              />
              <FieldError message={errors.description} />
            </div>

            {/* Archivo */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={ids.file}>
                Documento <span className="text-destructive">*</span>
              </Label>
              <input
                ref={inputRef}
                id={ids.file}
                type="file"
                accept={ACCEPT_ATTRIBUTE}
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  pickFile(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
              />

              <AnimatePresence mode="wait" initial={false}>
                {!file ? (
                  <motion.button
                    key="drop"
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      pickFile(e.dataTransfer.files?.[0] ?? null);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      dragging
                        ? "border-primary bg-primary/5"
                        : errors.file
                          ? "border-destructive/40 bg-destructive/5"
                          : "border-border hover:border-primary/40 hover:bg-muted/40"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-12 items-center justify-center rounded-2xl transition-transform duration-200",
                        dragging ? "scale-110 bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                      )}
                    >
                      <CloudUpload className="size-6" />
                    </span>
                    <p className="text-sm font-medium text-foreground">
                      {dragging ? "Suelta el archivo aquí" : (
                        <>
                          Arrastra tu archivo o <span className="text-primary">explora</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, PDF, DOC o DOCX · máx. 20 MB</p>
                  </motion.button>
                ) : (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-3",
                      errors.file ? "border-destructive/40 bg-destructive/5" : "border-border/70 bg-muted/30"
                    )}
                  >
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="" className="size-12 shrink-0 rounded-xl object-cover ring-1 ring-border" />
                    ) : kind ? (
                      <DocumentKindIcon kind={kind} className="size-12" />
                    ) : (
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                        <AlertCircle className="size-5" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    {!uploading && (
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-lg text-xs"
                          onClick={() => inputRef.current?.click()}
                        >
                          Cambiar
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-lg"
                          aria-label="Quitar archivo"
                          onClick={() => pickFile(null)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <FieldError message={errors.file} />
            </div>

            {/* Progreso / error de subida */}
            <AnimatePresence initial={false}>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      {progress < 100 ? (
                        <Loader2 className="size-3.5 animate-spin text-primary" />
                      ) : (
                        <CheckCircle2 className="size-3.5 text-success" />
                      )}
                      {progress < 100 ? "Subiendo documento…" : "Procesando…"}
                    </span>
                    <span className="tabular-nums text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </motion.div>
              )}
              {phase === "error" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  role="alert"
                  className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-xs text-destructive"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  No pudimos subir el documento. Revisa tu conexión e inténtalo de nuevo.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DialogFooter className="rounded-b-3xl px-6">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl"
              disabled={uploading}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="min-w-36 rounded-xl" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Subiendo…
                </>
              ) : phase === "error" ? (
                <>
                  <RotateCcw className="mr-2 size-4" />
                  Reintentar
                </>
              ) : (
                <>
                  <CloudUpload className="mr-2 size-4" />
                  Subir documento
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldError({ id, message }: { id?: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-1 text-xs text-destructive"
        >
          <AlertCircle className="size-3 shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
