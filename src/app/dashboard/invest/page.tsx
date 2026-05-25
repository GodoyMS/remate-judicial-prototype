"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  CreditCard,
  Banknote,
  TrendingUp,
  MapPin,
  Lock,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BankTransferForm,
  isTransferFormValid,
  type TransferFormData,
} from "@/components/dashboard/invest/BankTransferForm";
import {
  CardPaymentForm,
  isCardFormValid,
  type CardFormData,
} from "@/components/dashboard/invest/CardPaymentForm";
import { dashboardProperties, formatCurrency } from "@/lib/dashboard/mock-data";

const STEPS = ["Propiedad", "Monto", "Pago", "Confirmación"];

const properties = dashboardProperties.map((p) => ({
  id: p.id,
  name: p.name,
  address: p.address,
  price: formatCurrency(p.price),
  roi: `${p.roi}%`,
  minInv: p.minInvestment,
  deadline: p.deadline,
  img: p.img,
}));

const paymentMethods = [
  { id: "card", label: "Tarjeta débito / crédito", icon: CreditCard, hint: "Visa, Mastercard, Amex" },
  { id: "transfer", label: "Transferencia bancaria", icon: Banknote, hint: "BCP, Interbank, BBVA, Scotiabank" },
];

export default function InvestPage() {
  return (
    <Suspense>
      <InvestPageContent />
    </Suspense>
  );
}

function InvestPageContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [cardForm, setCardForm] = useState<CardFormData>({
    cardNumber: "",
    cardholder: "",
    expiry: "",
    cvv: "",
  });
  const [transferForm, setTransferForm] = useState<TransferFormData>({
    accountNumber: "",
    transferNumber: "",
    amount: "",
    receipt: null,
  });
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const propertyParam = searchParams.get("property");
    if (propertyParam) {
      const id = parseInt(propertyParam, 10);
      if (properties.some((p) => p.id === id)) {
        setSelectedProperty(id);
      }
    }
  }, [searchParams]);

  const property = properties.find((p) => p.id === selectedProperty);

  const estimatedReturn = property && amount
    ? (parseFloat(amount) * parseFloat(property.roi) / 100).toFixed(2)
    : "0.00";

  const selectPaymentMethod = (methodId: string) => {
    setPaymentMethod(methodId);
    if (methodId === "transfer" && amount) {
      setTransferForm((prev) => ({
        ...prev,
        amount: prev.amount || amount,
      }));
    }
  };

  const isPaymentStepValid =
    paymentMethod === "card"
      ? isCardFormValid(cardForm)
      : paymentMethod === "transfer"
        ? isTransferFormValid(transferForm)
        : false;

  const resetFlow = () => {
    setConfirmed(false);
    setStep(0);
    setSelectedProperty(null);
    setAmount("");
    setPaymentMethod(null);
    setCardForm({ cardNumber: "", cardholder: "", expiry: "", cvv: "" });
    setTransferForm({ accountNumber: "", transferNumber: "", amount: "", receipt: null });
  };

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setConfirmed(true);
    }, 2000);
  };

  if (confirmed) {
    return (
      <div className=" max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="w-full rounded-3xl border border-border/60 bg-white p-10 flex flex-col items-center gap-6 text-center shadow-xl"
        >
          <div className="size-20 rounded-full bg-accent flex items-center justify-center">
            <CheckCircle2 className="size-10 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">¡Inversión realizada!</h2>
            <p className="text-muted-foreground mt-2 max-w-sm leading-relaxed">
              Tu inversión de <strong className="text-foreground">S/ {parseFloat(amount).toLocaleString()}</strong> en{" "}
              <strong className="text-foreground">{property?.name}</strong> ha sido confirmada.
            </p>
          </div>
          <div className="w-full rounded-2xl bg-muted/30 border border-border/60 p-5 flex flex-col gap-3 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Propiedad</span>
              <span className="font-medium text-foreground truncate max-w-[200px]">{property?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monto invertido</span>
              <span className="font-bold text-foreground">S/ {parseFloat(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Retorno estimado</span>
              <span className="font-bold text-green-600">S/ {parseFloat(estimatedReturn).toLocaleString()} ({property?.roi})</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Método de pago</span>
              <span className="font-medium text-foreground">
                {paymentMethods.find((m) => m.id === paymentMethod)?.label}
              </span>
            </div>
          </div>
          <Button
            onClick={resetFlow}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            Nueva inversión
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Nueva inversión</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sigue los pasos para completar tu inversión de forma segura.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step > i
                    ? "bg-primary text-primary-foreground"
                    : step === i
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > i ? <CheckCircle2 className="size-4" /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium hidden sm:block ${step >= i ? "text-foreground" : "text-muted-foreground"}`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${step > i ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {/* Step 0: Select property */}
        {step === 0 && (
          <motion.div
            key="step-property"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground mb-4">Selecciona una propiedad</h3>
              <div className="flex flex-col gap-3">
                {properties.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProperty(p.id)}
                    className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
                      selectedProperty === p.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.name} className="size-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{p.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="size-3" />
                        <span>{p.address}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs font-medium text-foreground">{p.price}</span>
                        <span className="text-xs font-bold text-green-600">{p.roi} ROI</span>
                        <span className="text-xs text-muted-foreground">{p.deadline}</span>
                      </div>
                    </div>
                    <div
                      className={`size-5 rounded-full border-2 shrink-0 transition-colors ${
                        selectedProperty === p.id ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {selectedProperty === p.id && (
                        <CheckCircle2 className="size-full text-primary-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={() => setStep(1)}
              disabled={!selectedProperty}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold group disabled:opacity-50"
            >
              Continuar
              <ArrowRight className="size-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </motion.div>
        )}

        {/* Step 1: Amount */}
        {step === 1 && property && (
          <motion.div
            key="step-amount"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              {/* Selected property summary */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={property.img} alt={property.name} className="size-14 rounded-xl object-cover" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{property.name}</p>
                  <p className="text-xs text-green-600 font-bold">{property.roi} retorno estimado</p>
                </div>
              </div>

              <h3 className="text-base font-semibold text-foreground mb-4">¿Cuánto deseas invertir?</h3>

              <div className="flex flex-col gap-3">
                <Label className="text-sm font-medium">Monto de inversión (soles)</Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">S/</span>
                  <Input
                    type="number"
                    placeholder={`${property.minInv}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-12 pl-10 rounded-xl border-border/80 bg-muted/30 text-lg font-semibold text-foreground"
                    min={property.minInv}
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="size-3" />
                  Inversión mínima: S/ {property.minInv.toLocaleString()}
                </p>
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2 mt-3">
                {[property.minInv, 1000, 5000, 10000].map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(String(q))}
                    className={`flex-1 h-8 rounded-lg text-xs font-medium border transition-colors ${
                      amount === String(q)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/80 text-muted-foreground hover:border-primary/50 hover:text-foreground bg-white"
                    }`}
                  >
                    {q >= 1000 ? `${q / 1000}K` : q}
                  </button>
                ))}
              </div>

              {/* Estimated return */}
              {amount && parseFloat(amount) >= property.minInv && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-xl bg-green-50 border border-green-200 p-4 flex items-center gap-3"
                >
                  <div className="size-9 rounded-xl bg-green-600 flex items-center justify-center">
                    <TrendingUp className="size-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-green-700 font-medium">Retorno estimado al año</p>
                    <p className="text-xl font-bold text-green-700">S/ {parseFloat(estimatedReturn).toLocaleString()}</p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)} className="flex-1 h-11 rounded-xl border-border/80">
                <ArrowLeft className="size-4 mr-1" /> Atrás
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!amount || parseFloat(amount) < property.minInv}
                className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold group disabled:opacity-50"
              >
                Continuar
                <ArrowRight className="size-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Payment method */}
        {step === 2 && (
          <motion.div
            key="step-payment"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground mb-4">Método de pago</h3>

              <div className="flex flex-col gap-3 mb-6">
                {paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => selectPaymentMethod(m.id)}
                    className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                      paymentMethod === m.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                    }`}
                  >
                    <div className={`size-10 rounded-xl flex items-center justify-center ${
                      paymentMethod === m.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      <m.icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.hint}</p>
                    </div>
                    <div className={`size-5 rounded-full border-2 transition-colors ${
                      paymentMethod === m.id ? "border-primary bg-primary" : "border-border"
                    }`}>
                      {paymentMethod === m.id && <CheckCircle2 className="size-full text-primary-foreground" />}
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === "card" && (
                <CardPaymentForm amount={amount} value={cardForm} onChange={setCardForm} />
              )}

              {paymentMethod === "transfer" && (
                <BankTransferForm
                  defaultAmount={amount}
                  value={transferForm}
                  onChange={setTransferForm}
                />
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 rounded-xl border-border/80">
                <ArrowLeft className="size-4 mr-1" /> Atrás
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!isPaymentStepValid}
                className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold group disabled:opacity-50"
              >
                Continuar
                <ArrowRight className="size-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review & confirm */}
        {step === 3 && property && (
          <motion.div
            key="step-confirm"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground mb-5">Resumen de inversión</h3>

              {/* Property */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={property.img} alt={property.name} className="size-14 rounded-xl object-cover" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{property.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building2 className="size-3" />
                    <span>{property.address}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-3">
                {[
                  ["Monto a invertir", `S/ ${parseFloat(amount).toLocaleString()}`],
                  ["Retorno estimado", `S/ ${parseFloat(estimatedReturn).toLocaleString()} (${property.roi})`],
                  ["Cierre de subasta", property.deadline],
                  ["Método de pago", paymentMethods.find((m) => m.id === paymentMethod)?.label ?? ""],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                    <span className="text-sm text-muted-foreground">{k}</span>
                    <span className={`text-sm font-semibold ${k === "Retorno estimado" ? "text-green-600" : "text-foreground"}`}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="mt-5 rounded-xl bg-muted/30 border border-border/60 p-3 flex items-start gap-2">
                <Info className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Al confirmar, aceptas los Términos de inversión de Remata. Los retornos son estimados y pueden variar según el resultado de la subasta.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => {
                if (paymentMethod === "transfer" && amount) {
                  setTransferForm((prev) => ({ ...prev, amount }));
                }
                setStep(2);
              }} className="flex-1 h-11 rounded-xl border-border/80">
                <ArrowLeft className="size-4 mr-1" /> Atrás
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={confirming}
                className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                {confirming ? (
                  <span className="flex items-center gap-2">
                    <div className="size-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Lock className="size-4" />
                    Confirmar inversión
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
