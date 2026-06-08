"use client";

import {
  Crown,
  Download,
  Calendar,
  TrendingUp,
  Percent,
  Shield,
  Sparkles,
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
import { PremiumBadge } from "@/components/dashboard/PremiumBadge";
import type { PremiumInvestment } from "@/lib/premium/types";
import type { PremiumProperty } from "@/lib/premium/types";
import { formatCurrency, formatDate } from "@/lib/dashboard/mock-data";

interface PremiumInvestmentDetailSheetProps {
  investment: PremiumInvestment | null;
  property: PremiumProperty | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
}

const statusConfig = {
  active: { label: "Activa", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "Pendiente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  completed: { label: "Completada", className: "bg-blue-50 text-blue-700 border-blue-200" },
};

export function PremiumInvestmentDetailSheet({
  investment,
  property,
  open,
  onOpenChange,
  userName = "Inversor",
}: PremiumInvestmentDetailSheetProps) {
  if (!investment || !property) return null;

  const status = statusConfig[investment.status];
  const roiMultiplier = (investment.premiumRoi / (property.standardRoi || 20)).toFixed(1);

  const handleDownload = () => {
    toast.success("Certificado Premium descargado", {
      description: investment.certificateId,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2">
            <PremiumBadge size="md" />
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
          </div>
          <SheetTitle className="text-left">{property.name}</SheetTitle>
          <SheetDescription className="text-left">
            Inversión exclusiva al 100% · Certificado {investment.certificateId}
          </SheetDescription>
        </SheetHeader>

        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="size-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-900">Retorno Premium</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">ROI Premium</p>
              <p className="text-3xl font-bold text-amber-700">{investment.premiumRoi}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ganancia estimada</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(investment.estimatedReturn, investment.currency)}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-100/50 rounded-lg px-2.5 py-1.5">
            <Sparkles className="size-3.5" />
            {roiMultiplier}x el retorno del mercado estándar ({property.standardRoi}%)
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Inversión total</span>
            <span className="font-bold">{formatCurrency(investment.amount, investment.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Percent className="size-3.5" />
              Participación
            </span>
            <span className="font-bold text-amber-700">{investment.ownershipPercent}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="size-3.5" />
              Retorno estimado
            </span>
            <span className="font-bold text-emerald-600">
              {formatCurrency(investment.estimatedReturn, investment.currency)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="size-3.5" />
              Fecha de pago
            </span>
            <span>{formatDate(investment.datePaid)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Retorno esperado</span>
            <span>{formatDate(investment.expectedRoiDate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Días restantes</span>
            <span className="font-medium">{investment.daysUntilRoi} días</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Método de pago</span>
            <span>{investment.paymentMethod}</span>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3 mb-6">
          <Shield className="size-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Como único inversor Premium de esta propiedad, recibes el retorno completo
            sin dilución. Comisión reducida del 0.5% aplicada.
          </p>
        </div>

        <Button
          onClick={handleDownload}
          className="w-full rounded-xl bg-[#163300] text-[#9FE870] hover:bg-[#163300]/90"
        >
          <Download className="size-4 mr-2" />
          Descargar certificado Premium
        </Button>
      </SheetContent>
    </Sheet>
  );
}
