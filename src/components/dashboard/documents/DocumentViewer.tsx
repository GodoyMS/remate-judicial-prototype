"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  Download,
  ExternalLink,
  FileText,
  HardDrive,
  Hash,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { formatDateTime } from "@/lib/admin/formatters";
import { deleteDocument } from "@/lib/documents/store";
import {
  DOCUMENT_KIND_LABELS,
  formatFileSize,
  type UserDocument,
} from "@/lib/documents/types";
import { DocumentKindIcon } from "./DocumentKindIcon";

/**
 * Visor a pantalla completa: el documento ocupa el lienzo y a la derecha
 * (abajo en móvil) un panel con todos sus metadatos y acciones.
 */
export function DocumentViewer({
  document: doc,
  onClose,
}: {
  document: UserDocument | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!doc) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [doc, onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {doc && (
        <motion.div
          key={doc.id}
          role="dialog"
          aria-modal="true"
          aria-label={doc.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col bg-zinc-950 lg:flex-row"
        >
          <Canvas doc={doc} onClose={onClose} />
          <DetailsPanel doc={doc} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>,
    window.document.body
  );
}

function Canvas({ doc, onClose }: { doc: UserDocument; onClose: () => void }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    doc.kind === "word" ? "ready" : "loading"
  );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* Barra superior del lienzo */}
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 px-4 text-zinc-100">
        <div className="flex min-w-0 items-center gap-2.5">
          <DocumentKindIcon kind={doc.kind} className="size-8 rounded-lg" />
          <p className="truncate text-sm font-medium">{doc.fileName}</p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Cerrar visor"
          className="rounded-full text-zinc-300 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X className="size-5" />
        </Button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center p-4 pt-0 sm:p-8 sm:pt-0">
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="size-7 animate-spin" />
            <p className="text-xs">Cargando vista previa…</p>
          </div>
        )}

        {status === "error" ? (
          <PreviewFallback
            doc={doc}
            icon={<AlertCircle className="size-7" />}
            title="No pudimos cargar la vista previa"
            text="El archivo sigue disponible. Puedes descargarlo para verlo."
          />
        ) : doc.kind === "image" ? (
          <motion.img
            src={doc.url}
            alt={doc.title}
            onLoad={() => setStatus("ready")}
            onError={() => setStatus("error")}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={status === "ready" ? { opacity: 1, scale: 1 } : {}}
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
          />
        ) : doc.kind === "pdf" ? (
          <iframe
            src={`${doc.url}#toolbar=1&view=FitH`}
            title={doc.title}
            onLoad={() => setStatus("ready")}
            className="size-full rounded-xl bg-white shadow-2xl"
          />
        ) : (
          <PreviewFallback
            doc={doc}
            icon={<FileText className="size-7" />}
            title="Vista previa no disponible para Word"
            text="Los documentos .doc y .docx se abren con tu editor. Descárgalo para revisarlo."
          />
        )}
      </div>
    </div>
  );
}

function PreviewFallback({
  doc,
  icon,
  title,
  text,
}: {
  doc: UserDocument;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex max-w-sm flex-col items-center rounded-3xl bg-white/5 px-8 py-10 text-center ring-1 ring-white/10">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 text-zinc-200">
        {icon}
      </span>
      <p className="mt-4 text-base font-semibold text-white">{title}</p>
      <p className="mt-1.5 text-sm text-zinc-400">{text}</p>
      <Button asChild className="mt-6 rounded-xl">
        <a href={doc.url} download={doc.fileName}>
          <Download className="mr-2 size-4" />
          Descargar archivo
        </a>
      </Button>
    </div>
  );
}

function DetailsPanel({ doc, onClose }: { doc: UserDocument; onClose: () => void }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteDocument(doc.userId, doc.id);
      toast.success("Documento eliminado", { description: doc.title });
      setConfirmOpen(false);
      onClose();
    } catch {
      toast.error("No pudimos eliminar el documento. Inténtalo de nuevo.");
    } finally {
      setDeleting(false);
    }
  }

  const rows = [
    {
      icon: FileText,
      label: "Tipo",
      value:
        doc.kind === "pdf"
          ? DOCUMENT_KIND_LABELS.pdf
          : `${DOCUMENT_KIND_LABELS[doc.kind]} · ${doc.fileName.split(".").pop()?.toUpperCase()}`,
    },
    { icon: HardDrive, label: "Tamaño", value: formatFileSize(doc.size) },
    { icon: CalendarDays, label: "Subido", value: formatDateTime(doc.uploadedAt) },
    { icon: Hash, label: "ID", value: doc.id, mono: true },
  ];

  return (
    <motion.aside
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex max-h-[45vh] w-full shrink-0 flex-col overflow-y-auto rounded-t-3xl bg-card text-card-foreground lg:max-h-none lg:w-[380px] lg:rounded-none"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border/60 px-6 py-5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Detalle del documento
          </p>
          <h2 className="mt-1 text-lg font-bold leading-snug tracking-tight text-balance">
            {doc.title}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Cerrar visor"
          className="hidden shrink-0 rounded-full lg:inline-flex"
        >
          <X className="size-5" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-6 px-6 py-5">
        <section>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Descripción</p>
          {doc.description ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {doc.description}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground">Sin descripción</p>
          )}
        </section>

        <section>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Información del archivo</p>
          <dl className="divide-y divide-border/60 rounded-2xl border border-border/60">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center gap-3 px-4 py-3">
                <r.icon className="size-4 shrink-0 text-muted-foreground" />
                <dt className="text-xs text-muted-foreground">{r.label}</dt>
                <dd
                  className={
                    r.mono
                      ? "ml-auto truncate font-mono text-[11px] text-foreground"
                      : "ml-auto truncate text-sm font-medium text-foreground"
                  }
                >
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div className="sticky bottom-0 flex flex-col gap-2 border-t border-border/60 bg-card px-6 py-4">
        <div className="grid grid-cols-2 gap-2">
          <Button asChild className="rounded-xl">
            <a href={doc.url} download={doc.fileName}>
              <Download className="mr-2 size-4" />
              Descargar
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <a href={doc.url} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 size-4" />
              Abrir
            </a>
          </Button>
        </div>
        <Button
          variant="ghost"
          className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="mr-2 size-4" />
          Eliminar documento
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={(o) => !deleting && setConfirmOpen(o)}>
        <AlertDialogContent className="z-[60] rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este documento?</AlertDialogTitle>
            <AlertDialogDescription>
              “{doc.title}” se eliminará de tu cuenta. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" disabled={deleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-white hover:bg-destructive/90"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
            >
              {deleting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.aside>
  );
}
