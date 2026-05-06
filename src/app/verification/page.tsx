"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Gavel,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  User,
  CreditCard,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STEPS = [
  { id: 1, label: "Datos personales", icon: User },
  { id: 2, label: "Documento de identidad", icon: CreditCard },
  { id: 3, label: "Verificación lista", icon: Shield },
];

type UploadedFile = { name: string; preview: string } | null;

export default function VerificationPage() {
  const [step, setStep] = useState(1);
  const [frontFile, setFrontFile] = useState<UploadedFile>(null);
  const [backFile, setBackFile] = useState<UploadedFile>(null);
  const [dragOver, setDragOver] = useState<"front" | "back" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFile = useCallback(
    (file: File, side: "front" | "back") => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = { name: file.name, preview: e.target?.result as string };
        if (side === "front") setFrontFile(data);
        else setBackFile(data);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleDrop = (e: React.DragEvent, side: "front" | "back") => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file, side);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    const file = e.target.files?.[0];
    if (file) handleFile(file, side);
  };

  const handleFinish = () => {
    setSubmitting(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-border/60 px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <Gavel className="size-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">remata</span>
        </Link>
        <span className="text-sm text-muted-foreground">Verificación de identidad</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-10">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`size-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step > s.id
                        ? "bg-primary text-primary-foreground"
                        : step === s.id
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.id ? (
                      <CheckCircle2 className="size-4" />
                    ) : (
                      <s.icon className="size-4" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      step >= s.id ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-colors duration-300 ${
                      step > s.id ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="rounded-3xl bg-white border border-border/60 shadow-xl shadow-foreground/5 p-8"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground tracking-tight">Datos personales</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ingresa tu información tal como aparece en tu documento de identidad.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium">Tipo de documento</Label>
                    <select className="h-11 w-full rounded-xl border border-border/80 bg-muted/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                      <option value="dni">DNI — Documento Nacional de Identidad</option>
                      <option value="passport">Pasaporte</option>
                      <option value="ce">Carnet de Extranjería</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium">Número de documento</Label>
                    <Input
                      placeholder="12345678"
                      className="h-11 rounded-xl border-border/80 bg-muted/30 text-sm"
                      maxLength={12}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium">Nombres</Label>
                      <Input
                        placeholder="Ana Sofía"
                        className="h-11 rounded-xl border-border/80 bg-muted/30 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium">Apellidos</Label>
                      <Input
                        placeholder="Torres Vega"
                        className="h-11 rounded-xl border-border/80 bg-muted/30 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium">Celular</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border/80 bg-muted/30 text-sm text-muted-foreground shrink-0">
                        🇵🇪 +51
                      </div>
                      <Input
                        placeholder="987 654 321"
                        className="h-11 rounded-xl border-border/80 bg-muted/30 text-sm flex-1"
                        type="tel"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-medium">Género</Label>
                    <div className="flex gap-3">
                      {["Masculino", "Femenino", "Prefiero no decir"].map((g) => (
                        <label
                          key={g}
                          className="flex items-center gap-2 cursor-pointer text-sm text-foreground"
                        >
                          <input
                            type="radio"
                            name="genero"
                            value={g}
                            className="accent-primary"
                          />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm mt-6 group"
                >
                  Continuar
                  <ArrowRight className="size-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="rounded-3xl bg-white border border-border/60 shadow-xl shadow-foreground/5 p-8"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground tracking-tight">Sube tu documento</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Necesitamos ambas caras de tu DNI. Las fotos deben ser claras y legibles.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Instrucciones */}
                  <div className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/15 p-3">
                    <Shield className="size-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-foreground/75 leading-relaxed">
                      Tus documentos se cifran con encriptación AES-256 y se eliminan automáticamente tras la verificación.
                    </p>
                  </div>

                  {/* Upload areas */}
                  {(["front", "back"] as const).map((side) => {
                    const file = side === "front" ? frontFile : backFile;
                    const label = side === "front" ? "Parte frontal del DNI" : "Parte posterior del DNI";
                    const hint = side === "front" ? "Muestra tu foto y datos" : "Muestra tu firma y código de barras";
                    const inputId = `upload-${side}`;

                    return (
                      <div key={side}>
                        <Label className="text-sm font-medium mb-2 block">{label}</Label>
                        {file ? (
                          <div className="relative rounded-xl overflow-hidden border border-border/60 aspect-[16/9]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={file.preview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  side === "front" ? setFrontFile(null) : setBackFile(null)
                                }
                                className="rounded-full bg-white/90 p-2 text-foreground hover:bg-white transition-colors"
                              >
                                <X className="size-4" />
                              </button>
                            </div>
                            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-green-600 text-white text-xs px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="size-3" />
                              Cargado
                            </div>
                          </div>
                        ) : (
                          <label
                            htmlFor={inputId}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(side); }}
                            onDragLeave={() => setDragOver(null)}
                            onDrop={(e) => handleDrop(e, side)}
                            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed aspect-[16/9] cursor-pointer transition-all duration-200 ${
                              dragOver === side
                                ? "border-primary bg-primary/5"
                                : "border-border/60 bg-muted/30 hover:border-primary/50 hover:bg-primary/5"
                            }`}
                          >
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Upload className="size-5 text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-foreground">
                                Arrastra la imagen aquí
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                o <span className="text-primary font-medium">haz clic para seleccionar</span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{hint}</p>
                            </div>
                            <input
                              id={inputId}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleInputChange(e, side)}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-11 rounded-xl border-border/80"
                  >
                    <ArrowLeft className="size-4 mr-1" />
                    Atrás
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm group"
                  >
                    Continuar
                    <ArrowRight className="size-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl bg-white border border-border/60 shadow-xl shadow-foreground/5 p-8 flex flex-col items-center text-center gap-6"
              >
                {/* Success icon */}
                <div className="size-20 rounded-full bg-accent flex items-center justify-center">
                  <CheckCircle2 className="size-10 text-accent-foreground" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    ¡Verificación enviada!
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
                    Tu información está siendo revisada por nuestro equipo. Recibirás una confirmación
                    en tu correo en las próximas <strong className="text-foreground">2–4 horas</strong>.
                  </p>
                </div>

                {/* Status timeline */}
                <div className="w-full flex flex-col gap-3">
                  {[
                    { label: "Información personal recibida", done: true },
                    { label: "Documentos cargados", done: true },
                    { label: "Revisión en proceso", done: false, active: true },
                    { label: "Cuenta activada", done: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div
                        className={`size-5 rounded-full flex items-center justify-center shrink-0 ${
                          item.done
                            ? "bg-primary"
                            : item.active
                            ? "bg-amber-400"
                            : "bg-border"
                        }`}
                      >
                        {item.done ? (
                          <CheckCircle2 className="size-3 text-primary-foreground" />
                        ) : item.active ? (
                          <div className="size-2 rounded-full bg-white animate-pulse" />
                        ) : (
                          <div className="size-2 rounded-full bg-white/60" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          item.done || item.active ? "text-foreground font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleFinish}
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm group"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="size-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                      Ingresando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Ir al dashboard
                      <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
