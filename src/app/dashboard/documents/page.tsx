"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronRight,
  CloudUpload,
  FolderOpen,
  RotateCcw,
  Search,
  SearchX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/contexts/user-context";
import { formatDateTime } from "@/lib/admin/formatters";
import { fetchDocuments, subscribeDocuments } from "@/lib/documents/store";
import {
  DOCUMENT_KIND_LABELS,
  formatFileSize,
  type DocumentKind,
  type UserDocument,
} from "@/lib/documents/types";
import { DocumentKindIcon } from "@/components/dashboard/documents/DocumentKindIcon";
import { UploadDocumentDialog } from "@/components/dashboard/documents/UploadDocumentDialog";
import { DocumentViewer } from "@/components/dashboard/documents/DocumentViewer";

type LoadState = "loading" | "ready" | "error";

const KIND_FILTERS: { value: DocumentKind | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pdf", label: "PDF" },
  { value: "image", label: "Imágenes" },
  { value: "word", label: "Word" },
];

export default function DocumentsPage() {
  const { user } = useCurrentUser();
  const [docs, setDocs] = useState<UserDocument[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<DocumentKind | "all">("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewing, setViewing] = useState<UserDocument | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setState("loading");
      try {
        setDocs(await fetchDocuments(user.id));
        setState("ready");
      } catch {
        setState("error");
      }
    },
    [user.id]
  );

  // Primera carga: el estado inicial ya es "loading".
  useEffect(() => {
    let cancelled = false;
    fetchDocuments(user.id).then(
      (result) => {
        if (cancelled) return;
        setDocs(result);
        setState("ready");
      },
      () => !cancelled && setState("error")
    );
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  useEffect(() => subscribeDocuments(() => load(true)), [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return docs.filter(
      (d) =>
        (kind === "all" || d.kind === kind) &&
        (!q ||
          d.title.toLowerCase().includes(q) ||
          d.fileName.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q))
    );
  }, [docs, search, kind]);

  const totalSize = docs.reduce((acc, d) => acc + d.size, 0);
  const closeViewer = useCallback(() => setViewing(null), []);

  return (
    <div className="w-full">
      {/* Hero primario a sangre: continúa la banda del Topbar (ver
          HERO_ROUTES) anulando el padding de <main>. */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 rounded-b-3xl bg-primary text-primary-foreground px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-foreground/70 mb-1">
            Cuenta
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Mis documentos</h2>
          <p className="text-sm text-primary-foreground/80 mt-1">
            {state === "ready"
              ? `${docs.length} documento${docs.length !== 1 ? "s" : ""} · ${formatFileSize(totalSize)} en total`
              : "Sube y gestiona tus documentos de identidad, bancarios y de respaldo"}
          </p>
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          className="w-fit shrink-0 rounded-xl bg-primary-foreground text-primary shadow-sm hover:bg-primary-foreground/90"
        >
          <CloudUpload className="mr-2 size-4" />
          Subir documento
        </Button>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, archivo o descripción…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={state !== "ready"}
            className="h-10 rounded-xl bg-card pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-xl border border-border/60 bg-card p-1">
          {KIND_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              disabled={state !== "ready"}
              onClick={() => setKind(f.value)}
              className={cn(
                "flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none",
                kind === f.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        {state === "loading" ? (
          <LoadingRows />
        ) : state === "error" ? (
          <StateMessage
            tone="destructive"
            icon={AlertTriangle}
            title="No pudimos cargar tus documentos"
            text="Hubo un problema de conexión. Tus archivos están a salvo."
            action={
              <Button variant="outline" className="rounded-xl" onClick={() => load()}>
                <RotateCcw className="mr-2 size-4" />
                Reintentar
              </Button>
            }
          />
        ) : docs.length === 0 ? (
          <StateMessage
            icon={FolderOpen}
            title="Aún no tienes documentos"
            text="Sube tu DNI, constancias bancarias u otros respaldos para agilizar tus verificaciones."
            action={
              <Button className="rounded-xl" onClick={() => setUploadOpen(true)}>
                <CloudUpload className="mr-2 size-4" />
                Subir mi primer documento
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <StateMessage
            icon={SearchX}
            title="Sin resultados"
            text="Ningún documento coincide con tu búsqueda o filtro."
            action={
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setSearch("");
                  setKind("all");
                }}
              >
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          <>
            {/* Cabecera (solo desktop) */}
            <div className="hidden grid-cols-[minmax(0,1fr)_110px_100px_180px_28px] gap-4 border-b border-border/60 bg-primary/5 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:grid">
              <span className="text-primary">Documento</span>
              <span>Tipo</span>
              <span>Tamaño</span>
              <span>Subido</span>
              <span />
            </div>
            <ul className="divide-y divide-border/60">
              {filtered.map((d, i) => (
                <motion.li
                  key={d.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.2) }}
                >
                  <button
                    type="button"
                    onClick={() => setViewing(d)}
                    className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none sm:px-5 md:grid-cols-[minmax(0,1fr)_110px_100px_180px_28px]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <DocumentKindIcon kind={d.kind} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{d.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {d.fileName}
                          <span className="md:hidden"> · {formatFileSize(d.size)}</span>
                        </p>
                      </div>
                    </div>
                    <span className="hidden text-xs font-medium text-muted-foreground md:block">
                      {DOCUMENT_KIND_LABELS[d.kind]}
                    </span>
                    <span className="hidden text-sm tabular-nums text-foreground md:block">
                      {formatFileSize(d.size)}
                    </span>
                    <span className="hidden text-sm text-muted-foreground md:block">
                      {formatDateTime(d.uploadedAt)}
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </>
        )}
      </div>

      <UploadDocumentDialog open={uploadOpen} onOpenChange={setUploadOpen} userId={user.id} />
      <DocumentViewer document={viewing} onClose={closeViewer} />
    </div>
  );
}

function LoadingRows() {
  return (
    <div aria-busy="true" aria-label="Cargando documentos" className="divide-y divide-border/60">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-4">
          <Skeleton className="size-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3 rounded-md" />
            <Skeleton className="h-3 w-1/4 rounded-md" />
          </div>
          <Skeleton className="hidden h-3.5 w-24 rounded-md md:block" />
        </div>
      ))}
    </div>
  );
}

function StateMessage({
  icon: Icon,
  title,
  text,
  action,
  tone = "default",
}: {
  icon: typeof FolderOpen;
  title: string;
  text: string;
  action?: React.ReactNode;
  tone?: "default" | "destructive";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center px-6 py-16 text-center"
    >
      <span
        className={cn(
          "flex size-14 items-center justify-center rounded-2xl",
          tone === "destructive" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
        )}
      >
        <Icon className="size-6" />
      </span>
      <p className="mt-4 text-base font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
