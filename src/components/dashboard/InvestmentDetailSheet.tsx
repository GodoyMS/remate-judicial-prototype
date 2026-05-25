"use client";

import {
  Download,
  Calendar,
  TrendingUp,
  Building2,
  CreditCard,
  FileText,
  Shield,
  Hash,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { UserInvestment } from "@/lib/dashboard/types";
import type { DashboardProperty } from "@/lib/dashboard/types";
import { formatCurrency, formatDate } from "@/lib/dashboard/mock-data";

interface InvestmentDetailSheetProps {
  investment: UserInvestment | null;
  property: DashboardProperty | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusLabels = {
  active: { label: "Activa", variant: "default" as const },
  completed: { label: "Completada", variant: "secondary" as const },
  pending: { label: "Pendiente", variant: "outline" as const },
  cancelled: { label: "Cancelada", variant: "destructive" as const },
};

export function InvestmentDetailSheet({
  investment,
  property,
  open,
  onOpenChange,
}: InvestmentDetailSheetProps) {
  if (!investment || !property) return null;

  const status = statusLabels[investment.status];

  const handleDownloadCertificate = () => {
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Certificado de Inversión ${investment.certificateId}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 40px; border: 3px double #163300; }
    h1 { color: #163300; text-align: center; font-size: 28px; margin-bottom: 8px; }
    .subtitle { text-align: center; color: #666; margin-bottom: 40px; }
    .cert-id { text-align: center; font-family: monospace; background: #E2F6D5; padding: 8px 16px; border-radius: 8px; display: inline-block; margin: 0 auto 32px; }
    .section { margin: 24px 0; }
    .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
    .value { font-size: 18px; font-weight: bold; color: #163300; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .footer { margin-top: 48px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #ddd; padding-top: 24px; }
    .seal { text-align: center; margin: 32px 0; font-size: 48px; }
  </style>
</head>
<body>
  <h1>CERTIFICADO DE INVERSIÓN</h1>
  <p class="subtitle">Remata — Plataforma de Inversión en Remates Judiciales</p>
  <div style="text-align:center"><div class="cert-id">${investment.certificateId}</div></div>
  <div class="seal">⚖️</div>
  <p style="text-align:center;line-height:1.8">Se certifica que <strong>Ana Sofía Torres</strong> (DNI: 72345678)<br>
  ha realizado una inversión verificada en la siguiente propiedad:</p>
  <div class="section">
    <div class="label">Propiedad</div>
    <div class="value">${property.name}</div>
    <div style="color:#666;margin-top:4px">${property.address}</div>
  </div>
  <div class="grid">
    <div><div class="label">Monto invertido</div><div class="value">${formatCurrency(investment.amount)}</div></div>
    <div><div class="label">ROI estimado</div><div class="value">+${investment.roi}%</div></div>
    <div><div class="label">Retorno estimado</div><div class="value">${formatCurrency(investment.estimatedReturn)}</div></div>
    <div><div class="label">Fecha de pago</div><div class="value">${formatDate(investment.datePaid)}</div></div>
    <div><div class="label">Fecha estimada de retorno</div><div class="value">${formatDate(investment.expectedRoiDate)}</div></div>
    <div><div class="label">Método de pago</div><div class="value">${investment.paymentMethod}</div></div>
  </div>
  <div class="footer">
    Documento generado el ${new Date().toLocaleDateString("es-PE")} · Válido como comprobante legal de participación<br>
    Remata S.A.C. · RUC 20601234567 · Lima, Perú
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificado-${investment.certificateId}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Certificado descargado", {
      description: `Archivo ${investment.certificateId}.html guardado`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        <div className="bg-gradient-to-br from-accent/40 to-secondary/5 p-6 pb-4 border-b border-border/40">
          <SheetHeader>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="size-5 text-secondary" />
              <Badge variant={status.variant} className="text-[10px]">
                {status.label}
              </Badge>
            </div>
            <SheetTitle className="text-lg">Detalle de inversión</SheetTitle>
            <SheetDescription className="font-mono text-xs">
              {investment.certificateId}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={property.img} alt={property.name} className="size-16 rounded-xl object-cover shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{property.name}</p>
              <p className="text-xs text-muted-foreground truncate">{property.address}</p>
              <p className="text-xs text-green-600 font-bold mt-1">+{investment.roi}% ROI</p>
            </div>
          </div>

          <div className="rounded-2xl bg-muted/30 border border-border/60 p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Monto invertido</p>
            <p className="text-3xl font-bold text-foreground mt-1">{formatCurrency(investment.amount)}</p>
            <p className="text-sm text-green-600 font-semibold mt-1">
              Retorno est. {formatCurrency(investment.estimatedReturn)}
            </p>
          </div>

          <div className="space-y-3">
            <DetailRow icon={Hash} label="ID de certificado" value={investment.certificateId} />
            <DetailRow icon={Calendar} label="Fecha de pago" value={formatDate(investment.datePaid)} />
            <DetailRow icon={TrendingUp} label="ROI de la propiedad" value={`+${investment.roi}% anual`} />
            <DetailRow icon={Clock} label="Retorno estimado" value={formatDate(investment.expectedRoiDate)} />
            {investment.status === "active" && (
              <DetailRow
                icon={Clock}
                label="Tiempo restante"
                value={`${investment.daysUntilRoi} días`}
              />
            )}
            <DetailRow icon={CreditCard} label="Método de pago" value={investment.paymentMethod} />
            <DetailRow icon={Building2} label="Tipo de propiedad" value={property.type} />
          </div>

          <Separator />

          <div className="rounded-xl bg-accent/30 border border-border/60 p-4 flex items-start gap-3">
            <Shield className="size-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Inversión verificada legalmente</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Este certificado acredita tu participación en el remate judicial. Descárgalo como respaldo legal.
              </p>
            </div>
          </div>

          <Button
            onClick={handleDownloadCertificate}
            className="w-full h-12 rounded-xl font-semibold text-base"
            size="lg"
          >
            <Download className="size-5 mr-2" />
            Descargar certificado de inversión
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
