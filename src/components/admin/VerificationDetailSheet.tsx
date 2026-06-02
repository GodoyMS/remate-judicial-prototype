"use client";

import {
  CreditCard,
  Mail,
  Phone,
  Shield,
  Clock,
  User,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { VerificationStatusBadge } from "@/components/admin/VerificationStatusBadge";
import { VerificationRowActions } from "@/components/admin/VerificationRowActions";
import type { IdentityVerification } from "@/lib/admin/types";
import {
  documentTypeLabels,
  getVerificationFullName,
} from "@/lib/admin/mock-data";
import { formatDate } from "@/lib/admin/formatters";
import { cn } from "@/lib/utils";

const activityIcons: Record<string, string> = {
  submitted: "bg-primary",
  review_started: "bg-amber-400",
  accepted: "bg-emerald-500",
  rejected: "bg-red-500",
  resolicitado: "bg-sky-500",
  resubmitted: "bg-violet-500",
};

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

interface VerificationDetailSheetProps {
  verification: IdentityVerification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept?: (v: IdentityVerification) => void;
  onReject?: (v: IdentityVerification) => void;
  onResolicitar?: (v: IdentityVerification) => void;
  onViewAdminMessage?: (
    v: IdentityVerification,
    kind: "rejection" | "resolicit"
  ) => void;
}

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon ? (
        <Icon className="size-4 text-muted-foreground shrink-0 mt-0.5" />
      ) : (
        <div className="size-4 shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground mt-0.5 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function DocumentImage({
  label,
  hint,
  src,
  alt,
}: {
  label: string;
  hint: string;
  src: string;
  alt: string;
}) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      </div>
      <div className="group relative rounded-xl overflow-hidden border border-border/60 aspect-[16/10] bg-muted/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
          <span className="text-xs text-white font-medium">{label}</span>
          <ZoomIn className="size-4 text-white/90" />
        </div>
      </div>
    </div>
  );
}

export function VerificationDetailSheet({
  verification,
  open,
  onOpenChange,
  onAccept,
  onReject,
  onResolicitar,
  onViewAdminMessage,
}: VerificationDetailSheetProps) {
  if (!verification) return null;

  const name = getVerificationFullName(verification);
  const isRejected = verification.status === "rejected";
  const sortedActivity = [...verification.activityLog].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0 gap-0">
        <div className="bg-gradient-to-br from-primary/8 via-background to-amber-500/5 px-6 pt-6 pb-5 border-b border-border/40">
          <SheetHeader className="p-0 text-left space-y-0">
            <div className="flex items-start gap-4 pr-8">
              <div className="size-14 rounded-2xl bg-primary/15 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                {verification.firstName[0]}
                {verification.lastName[0]?.[0] ?? ""}
              </div>
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-lg leading-tight">{name}</SheetTitle>
                <SheetDescription className="text-sm mt-0.5">
                  {verification.email}
                </SheetDescription>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <VerificationStatusBadge status={verification.status} />
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {verification.provider}
                  </Badge>
                </div>
              </div>
            </div>
          </SheetHeader>

          {!isRejected && (onAccept || onReject || onResolicitar) && (
            <div className="mt-4 flex justify-start">
              <VerificationRowActions
                verification={verification}
                onAccept={onAccept}
                onReject={onReject}
                onResolicitar={onResolicitar}
                onViewMore={() => {}}
                hideViewMore
                compact
              />
            </div>
          )}
        </div>

        <Tabs defaultValue="detalle" className="px-6 py-4">
          <TabsList variant="line" className="w-full justify-start mb-4">
            <TabsTrigger value="detalle">Detalle</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="actividad">Actividad</TabsTrigger>
          </TabsList>

          <TabsContent value="detalle" className="mt-0 space-y-1">
            <DetailRow
              label="Tipo de documento"
              value={documentTypeLabels[verification.documentType]}
              icon={CreditCard}
            />
            <DetailRow
              label="Número de documento"
              value={verification.documentNumber}
              icon={Shield}
            />
            <DetailRow label="Nombres" value={verification.firstName} icon={User} />
            <DetailRow label="Apellidos" value={verification.lastName} icon={User} />
            <DetailRow label="Celular" value={verification.phone} icon={Phone} />
            <DetailRow label="Género" value={verification.gender} icon={User} />
            <DetailRow label="Correo" value={verification.email} icon={Mail} />
            <DetailRow
              label="Enviado"
              value={formatDateTime(verification.submittedAt)}
              icon={Clock}
            />

            {verification.rejectionReason && onViewAdminMessage && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50/80 p-3">
                <p className="text-xs font-semibold text-red-800 mb-1">
                  Motivo de rechazo
                </p>
                <p className="text-xs text-red-900/80 line-clamp-3 leading-relaxed">
                  {verification.rejectionReason}
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 mt-1 text-red-700 text-xs"
                  onClick={() => onViewAdminMessage(verification, "rejection")}
                >
                  Ver mensaje completo
                </Button>
              </div>
            )}

            {verification.resolicitReason && onViewAdminMessage && (
              <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50/80 p-3">
                <p className="text-xs font-semibold text-sky-800 mb-1">
                  Solicitud de nueva verificación
                </p>
                <p className="text-xs text-sky-900/80 line-clamp-3 leading-relaxed">
                  {verification.resolicitReason}
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 mt-1 text-sky-700 text-xs"
                  onClick={() =>
                    onViewAdminMessage(verification, "resolicit")
                  }
                >
                  Ver mensaje completo
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documentos" className="mt-0 space-y-6">
            <DocumentImage
              label="Parte frontal del DNI"
              hint="Foto y datos personales visibles"
              src={verification.frontImageUrl}
              alt="Parte frontal del documento"
            />
            <DocumentImage
              label="Parte posterior del DNI"
              hint="Firma y código de barras"
              src={verification.backImageUrl}
              alt="Parte posterior del documento"
            />
          </TabsContent>

          <TabsContent value="actividad" className="mt-0">
            <p className="text-xs text-muted-foreground mb-4">
              Historial del proceso de verificación de identidad
            </p>
            <div className="relative pl-4 border-l border-border/60 space-y-5">
              {sortedActivity.map((event, idx) => (
                <div key={event.id} className="relative">
                  <div
                    className={cn(
                      "absolute -left-[21px] top-1 size-2.5 rounded-full ring-2 ring-background",
                      activityIcons[event.type] ?? "bg-muted-foreground"
                    )}
                  />
                  <div className={idx === 0 ? "" : ""}>
                    <p className="text-sm font-medium text-foreground leading-snug">
                      {event.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatDateTime(event.date)}
                    </p>
                    {event.adminNote ? (
                      <p className="text-xs text-muted-foreground mt-2 rounded-lg bg-muted/50 border border-border/40 px-3 py-2 leading-relaxed">
                        {event.adminNote}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Separator />
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
