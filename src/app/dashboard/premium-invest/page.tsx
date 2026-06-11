"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Crown,
  CreditCard,
  Banknote,
  Landmark,
  Smartphone,
  Lock,
  TrendingUp,
  MapPin,
  Shield,
  Percent,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  BankTransferForm,
  type TransferFormData,
} from "@/components/dashboard/invest/BankTransferForm";
import {
  CardPaymentForm,
  type CardFormData,
} from "@/components/dashboard/invest/CardPaymentForm";
import {
  DepositForm,
  type DepositFormData,
} from "@/components/dashboard/invest/DepositForm";
import {
  YapePaymentForm,
  type YapeFormData,
} from "@/components/dashboard/invest/YapePaymentForm";
import { CurrencyBadge } from "@/components/shared/CurrencyBadge";
import { PremiumCountdown } from "@/components/dashboard/PremiumCountdown";
import { PremiumBadge } from "@/components/dashboard/PremiumBadge";
import { useCurrentUser } from "@/contexts/user-context";
import {
  getAllPremiumProperties,
  getPremiumPropertyById,
  isPropertyEffectivelyAvailable,
  premiumProperties,
} from "@/lib/premium/mock-data";
import type { PremiumProperty } from "@/lib/premium/types";
import { formatCurrency } from "@/lib/dashboard/mock-data";
import type { PropertyCurrency } from "@/lib/currency";
import {
  getPaymentValidationHint,
  isPaymentFormValid,
} from "@/lib/invest/payment-validation";
import {
  savePendingPremiumInvestment,
  getPendingInvestmentsForProperty,
} from "@/lib/app-store";

const STEPS = ["Propiedad", "Revisión", "Pago", "Confirmación"];

const paymentMethods = [
  { id: "card", label: "Tarjeta débito / crédito", icon: CreditCard, hint: "Visa, Mastercard, Amex" },
  { id: "transfer", label: "Transferencia bancaria", icon: Banknote, hint: "BCP, Interbank, BBVA" },
  { id: "deposit", label: "Depósito en cuenta", icon: Landmark, hint: "Ventanilla o agente" },
  { id: "yape", label: "Yape", icon: Smartphone, hint: "Pago instantáneo" },
];

export default function PremiumInvestPage() {
  return (
    <Suspense>
      <PremiumInvestContent />
    </Suspense>
  );
}

function PremiumInvestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isPremium } = useCurrentUser();
  const [step, setStep] = useState(0);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [cardForm, setCardForm] = useState<CardFormData>({
    cardNumber: "", cardholder: "", expiry: "", cvv: "",
  });
  const [transferForm, setTransferForm] = useState<TransferFormData>({
    accountNumber: "", transferNumber: "", amount: "", receipt: null,
  });
  const [depositForm, setDepositForm] = useState<DepositFormData>({
    voucherNumber: "", voucherDate: undefined, operationNumber: "", amount: "", receipt: null,
  });
  const [yapeForm, setYapeForm] = useState<YapeFormData>({ phone: "", approvalCode: "" });
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const deepLinkHandled = useRef(false);

  const [allProperties, setAllProperties] = useState<PremiumProperty[]>(premiumProperties);

  useEffect(() => {
    setAllProperties(getAllPremiumProperties());
  }, []);

  const availableProperties = useMemo(
    () =>
      allProperties.filter(
        (p) => p.status === "available" && isPropertyEffectivelyAvailable(p.id)
      ),
    [allProperties]
  );

  useEffect(() => {
    if (deepLinkHandled.current) return;
    const param = searchParams.get("property");
    if (!param) return;
    const isAvailable =
      allProperties.some((p) => p.id === param && p.status === "available") &&
      isPropertyEffectivelyAvailable(param);
    if (isAvailable) {
      setSelectedPropertyId(param);
      setStep(1);
      deepLinkHandled.current = true;
    }
  }, [searchParams, allProperties]);

  const property = selectedPropertyId ? getPremiumPropertyById(selectedPropertyId) : null;
  const propertyCurrency: PropertyCurrency = property?.currency ?? "PEN";
  const amount = property?.totalValue ?? 0;
  const estimatedReturn = property ? (amount * property.premiumRoi) / 100 : 0;
  const commission = amount * 0.005;

  const availablePaymentMethods = paymentMethods.filter(
    (m) => propertyCurrency === "PEN" || m.id !== "yape"
  );

  const paymentForms = { card: cardForm, transfer: transferForm, deposit: depositForm, yape: yapeForm };
  const isPaymentStepValid = isPaymentFormValid(paymentMethod, paymentForms);
  const paymentValidationHint = getPaymentValidationHint(paymentMethod, paymentForms);

  const selectPaymentMethod = (methodId: string) => {
    setPaymentMethod(methodId);
    const amountStr = String(amount);
    if (methodId === "transfer") {
      setTransferForm((prev) => ({ ...prev, amount: amountStr }));
    }
    if (methodId === "deposit") {
      setDepositForm((prev) => ({ ...prev, amount: amountStr }));
    }
  };

  const goToPaymentStep = () => {
    const defaultMethod = availablePaymentMethods[0]?.id ?? null;
    if (!paymentMethod && defaultMethod) {
      selectPaymentMethod(defaultMethod);
    }
    setStep(2);
  };

  const requiresVerification =
    paymentMethod === "transfer" || paymentMethod === "deposit";

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      if (requiresVerification && property) {
        // Save pending investment for admin verification
        const investmentId = `pinv-${user.id}-${Date.now()}`;
        savePendingPremiumInvestment({
          id: investmentId,
          certificateId: `PREM-2026-${investmentId.slice(-6).toUpperCase()}`,
          propertyId: property.id,
          propertyName: property.name,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          amount,
          currency: propertyCurrency,
          premiumRoi: property.premiumRoi,
          estimatedReturn,
          paymentMethod: paymentMethod as "transfer" | "deposit",
          submittedAt: new Date().toISOString(),
          status: "pending_verification",
          // Transfer fields
          transferNumber: paymentMethod === "transfer" ? transferForm.transferNumber : undefined,
          originAccountNumber: paymentMethod === "transfer" ? transferForm.accountNumber : undefined,
          // Deposit fields
          voucherNumber: paymentMethod === "deposit" ? depositForm.voucherNumber : undefined,
          voucherDate: paymentMethod === "deposit" ? (depositForm.voucherDate ? String(depositForm.voucherDate) : undefined) : undefined,
          operationNumber: paymentMethod === "deposit" ? depositForm.operationNumber : undefined,
        });
        setConfirmed(true);
      } else {
        setConfirmed(true);
      }
    }, 2500);
  };

  if (!isPremium) {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="size-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
          <Lock className="size-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Acceso Premium requerido</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Las inversiones exclusivas al 100% solo están disponibles para usuarios Premium.
        </p>
        <Button asChild className="rounded-xl">
          <Link href="/dashboard/account?section=premium">
            <Crown className="size-4 mr-2" />
            Actualizar a Premium
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Demo: inicia sesión con premium@remata.com
        </p>
      </div>
    );
  }

  if (confirmed && property) {
    // Transfer / deposit → pending verification screen
    if (requiresVerification) {
      return (
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="w-full rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/50 to-white p-6 sm:p-10 flex flex-col items-center gap-6 text-center shadow-xl"
          >
            <div className="size-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Shield className="size-10 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                En verificación
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Pago recibido — verificando
              </h2>
              <p className="text-muted-foreground mt-2 max-w-md leading-relaxed">
                Recibimos tu comprobante de pago para{" "}
                <strong className="text-foreground">{property.name}</strong>.
                Un administrador verificará los datos y confirmará tu inversión.
              </p>
            </div>
            <div className="w-full rounded-2xl bg-white border border-blue-100 p-5 flex flex-col gap-3 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Inversión enviada</span>
                <span className="font-bold">{formatCurrency(amount, propertyCurrency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Método</span>
                <span>{paymentMethods.find((m) => m.id === paymentMethod)?.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ROI Premium</span>
                <span className="font-bold text-amber-700">{property.premiumRoi}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Retorno estimado</span>
                <span className="font-bold text-emerald-600">
                  {formatCurrency(estimatedReturn, propertyCurrency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estado</span>
                <span className="text-blue-700 font-medium">Pendiente de aprobación</span>
              </div>
            </div>
            <div className="w-full rounded-xl bg-amber-50 border border-amber-200 p-4 text-left text-sm">
              <p className="font-semibold text-amber-900 mb-1">¿Qué sigue?</p>
              <ul className="space-y-1 text-amber-800 text-xs">
                <li>• El administrador revisará tu comprobante en 1-2 días hábiles</li>
                <li>• La propiedad quedará reservada mientras se verifica</li>
                <li>• Recibirás una notificación cuando sea confirmado</li>
                <li>• Si es rechazado, la propiedad vuelve a estar disponible</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-11"
                onClick={() => router.push("/dashboard/premium-properties")}
              >
                Ver propiedades Premium
              </Button>
              <Button
                className="flex-1 rounded-xl h-11 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => router.push("/dashboard/my-investments?tab=premium")}
              >
                Mis inversiones Premium
              </Button>
            </div>
          </motion.div>
        </div>
      );
    }

    // Card / Yape → immediate capture
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="w-full rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-white p-6 sm:p-10 flex flex-col items-center gap-6 text-center shadow-xl"
        >
          <div className="size-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <Crown className="size-10 text-white" />
          </div>
          <div>
            <PremiumBadge size="md" className="mb-3" />
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              ¡Propiedad capturada!
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md leading-relaxed">
              Has invertido el <strong className="text-foreground">100%</strong> en{" "}
              <strong className="text-foreground">{property.name}</strong>.
              Eres el único inversor de esta propiedad premium.
            </p>
          </div>
          <div className="w-full rounded-2xl bg-white border border-amber-100 p-5 flex flex-col gap-3 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Inversión total</span>
              <span className="font-bold">{formatCurrency(amount, propertyCurrency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Participación</span>
              <span className="font-bold text-amber-700">100%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ROI Premium</span>
              <span className="font-bold text-amber-700">{property.premiumRoi}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Retorno estimado</span>
              <span className="font-bold text-emerald-600">
                {formatCurrency(estimatedReturn, propertyCurrency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Comisión (0.5%)</span>
              <span className="font-medium">{formatCurrency(commission, propertyCurrency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Certificado</span>
              <span className="font-mono text-xs">PREM-2026-NEW</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 rounded-xl h-11"
              onClick={() => router.push("/dashboard/premium-properties")}
            >
              Ver propiedades Premium
            </Button>
            <Button
              className="flex-1 rounded-xl h-11 bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => router.push("/dashboard/my-investments?tab=premium")}
            >
              Mis inversiones Premium
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Crown className="size-5 text-amber-600 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Captura Premium
          </h2>
          <PremiumBadge />
        </div>
        <p className="text-sm text-muted-foreground">
          Invierte el 100% y sé el único inversor con retorno excepcional.
        </p>
      </div>

      <div className="flex items-center mb-6 sm:mb-8 overflow-x-auto pb-1 -mx-1 px-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 min-w-[52px]">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > i
                    ? "bg-amber-500 text-white"
                    : step === i
                      ? "bg-amber-500 text-white ring-4 ring-amber-200"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {step > i ? <CheckCircle2 className="size-4" /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium text-center leading-tight max-w-[4.5rem] sm:max-w-none hidden sm:block ${step >= i ? "text-foreground" : "text-muted-foreground"}`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1.5 sm:mx-2 mb-4 min-w-[12px] ${step > i ? "bg-amber-500" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl border border-amber-200/60 bg-white p-4 sm:p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4">Selecciona una propiedad disponible</h3>
              <div className="flex flex-col gap-3">
                {availableProperties.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPropertyId(p.id)}
                    className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                      selectedPropertyId === p.id
                        ? "border-amber-400 bg-amber-50 ring-2 ring-amber-200"
                        : "border-border/60 hover:border-amber-300"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.name} className="size-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{p.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="size-3" />
                        <span className="truncate">{p.address}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <CurrencyBadge currency={p.currency} />
                        <span className="text-xs font-bold text-amber-700">{p.premiumRoi}% ROI</span>
                        <span className="text-xs font-medium">{formatCurrency(p.totalValue, p.currency)}</span>
                      </div>
                      <PremiumCountdown deadline={p.premiumDeadline} compact className="mt-2" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={() => setStep(1)}
              disabled={!selectedPropertyId}
              className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            >
              Continuar <ArrowRight className="size-4 ml-1" />
            </Button>
          </motion.div>
        )}

        {step === 1 && property && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl border border-amber-200/60 bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={property.img} alt={property.name} className="size-14 rounded-xl object-cover" />
                <div>
                  <p className="text-sm font-semibold">{property.name}</p>
                  <p className="text-xs text-amber-700 font-bold">{property.premiumRoi}% ROI Premium</p>
                </div>
              </div>

              <h3 className="text-base font-semibold mb-4">Revisión de captura al 100%</h3>

              <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valor de la propiedad</span>
                  <span className="font-bold">{formatCurrency(amount, propertyCurrency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Percent className="size-3.5" />
                    Tu participación
                  </span>
                  <span className="font-bold text-amber-700">100% — Único inversor</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="size-3.5" />
                    Retorno estimado
                  </span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(estimatedReturn, propertyCurrency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Comisión Premium (0.5%)</span>
                  <span className="font-medium">{formatCurrency(commission, propertyCurrency)}</span>
                </div>
              </div>

              <PremiumCountdown deadline={property.premiumDeadline} />

              <div className="flex items-start gap-2 mt-4 rounded-xl bg-muted/50 p-3">
                <Shield className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Al confirmar, capturas esta propiedad como único inversor Premium.
                  Otros usuarios Premium no podrán invertir una vez completado el pago.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button variant="outline" onClick={() => setStep(0)} className="rounded-xl h-11 w-full sm:w-auto">
                <ArrowLeft className="size-4 mr-1" /> Atrás
              </Button>
              <Button
                onClick={goToPaymentStep}
                className="flex-1 rounded-xl h-11 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              >
                Proceder al pago <ArrowRight className="size-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && property && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl border border-border/60 bg-white p-4 sm:p-6 shadow-sm">
              <div className="rounded-xl bg-muted/30 p-3 mb-5 flex justify-between items-center gap-3 text-sm">
                <span className="text-muted-foreground shrink-0">Monto a pagar</span>
                <span className="font-bold text-base sm:text-lg text-right">{formatCurrency(amount, propertyCurrency)}</span>
              </div>

              <h3 className="text-base font-semibold mb-4">Método de pago</h3>
              <div className="flex flex-col gap-2.5 mb-5">
                {availablePaymentMethods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => selectPaymentMethod(m.id)}
                    className={`flex items-center gap-3 sm:gap-4 rounded-xl border p-3.5 sm:p-4 text-left transition-all ${
                      paymentMethod === m.id
                        ? "border-amber-400 bg-amber-50 ring-2 ring-amber-200"
                        : "border-border/60 hover:border-amber-300"
                    }`}
                  >
                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                      paymentMethod === m.id ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      <m.icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.hint}</p>
                    </div>
                    <div className={`size-5 rounded-full border-2 shrink-0 transition-colors ${
                      paymentMethod === m.id ? "border-amber-500 bg-amber-500" : "border-border"
                    }`}>
                      {paymentMethod === m.id && <CheckCircle2 className="size-full text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === "card" && (
                <CardPaymentForm amount={String(amount)} currency={propertyCurrency} value={cardForm} onChange={setCardForm} />
              )}
              {paymentMethod === "transfer" && (
                <BankTransferForm defaultAmount={String(amount)} currency={propertyCurrency} value={transferForm} onChange={setTransferForm} />
              )}
              {paymentMethod === "deposit" && (
                <DepositForm defaultAmount={String(amount)} currency={propertyCurrency} value={depositForm} onChange={setDepositForm} />
              )}
              {paymentMethod === "yape" && (
                <YapePaymentForm defaultAmount={String(amount)} currency={propertyCurrency} value={yapeForm} onChange={setYapeForm} />
              )}
            </div>

            {!isPaymentStepValid && paymentValidationHint && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <p>{paymentValidationHint}</p>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl h-11 w-full sm:w-auto">
                <ArrowLeft className="size-4 mr-1" /> Atrás
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!isPaymentStepValid}
                className="flex-1 rounded-xl h-11 bg-amber-500 hover:bg-amber-600 text-white font-semibold disabled:opacity-50"
              >
                Revisar y confirmar <ArrowRight className="size-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && property && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/30 to-white p-4 sm:p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4">Confirmar captura Premium</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inversor</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Propiedad</span>
                  <span className="font-medium text-right max-w-[200px] truncate">{property.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inversión</span>
                  <span className="font-bold">{formatCurrency(amount, propertyCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Participación</span>
                  <span className="font-bold text-amber-700">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ROI Premium</span>
                  <span className="font-bold text-amber-700">{property.premiumRoi}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retorno estimado</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(estimatedReturn, propertyCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método</span>
                  <span>{paymentMethods.find((m) => m.id === paymentMethod)?.label}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl h-11 w-full sm:w-auto">
                <ArrowLeft className="size-4 mr-1" /> Atrás
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={confirming}
                className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold h-11 sm:h-12"
              >
                {confirming ? (
                  <span className="flex items-center gap-2">
                    <div className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Procesando captura...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Crown className="size-4" />
                    Confirmar captura al 100%
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
