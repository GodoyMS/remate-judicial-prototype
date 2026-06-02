"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

const OTP_DURATION = 5 * 60;

function isInvalidDemoOtp(code: string) {
  return /^(\d)\1{5}$/.test(code);
}

const STEPS = [
  { id: "email", label: "Correo", icon: Mail },
  { id: "otp", label: "Código", icon: ShieldCheck },
  { id: "password", label: "Contraseña", icon: KeyRound },
] as const;

type Step = (typeof STEPS)[number]["id"] | "success";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function stepIndex(step: Step) {
  if (step === "success") return 3;
  return STEPS.findIndex((s) => s.id === step);
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [otpShake, setOtpShake] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [timerActive, setTimerActive] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const isExpired = timerActive && timeLeft === 0;
  const otpComplete = otp.length === 6;
  const timerProgress = timerActive ? (timeLeft / OTP_DURATION) * 100 : 100;

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  useEffect(() => {
    if (step === "otp") {
      const t = setTimeout(() => otpInputRef.current?.focus(), 400);
      return () => clearTimeout(t);
    }
  }, [step]);

  const startTimer = useCallback(() => {
    setTimeLeft(OTP_DURATION);
    setTimerActive(true);
  }, []);

  const triggerOtpError = useCallback(() => {
    setOtpError(true);
    setOtpShake(true);
    setFailedAttempts((prev) => prev + 1);
    setTimeout(() => setOtpShake(false), 600);
  }, []);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtp("");
      setOtpError(false);
      setFailedAttempts(0);
      startTimer();
      setStep("otp");
    }, 1200);
  };

  const handleResendCode = () => {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setTimeout(() => {
      setResendLoading(false);
      setOtp("");
      setOtpError(false);
      setFailedAttempts(0);
      startTimer();
      setResendCooldown(30);
      otpInputRef.current?.focus();
    }, 900);
  };

  const handleConfirmOtp = () => {
    if (!otpComplete || isExpired) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (isInvalidDemoOtp(otp)) {
        triggerOtpError();
        setOtp("");
        otpInputRef.current?.focus();
        return;
      }
      setOtpError(false);
      setStep("password");
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setPasswordError("Incluye al menos una letra y un número.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 1200);
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (otpError) setOtpError(false);
  };

  const goBack = () => {
    if (step === "otp") {
      setStep("email");
      setTimerActive(false);
      setOtp("");
      setOtpError(false);
    } else if (step === "password") {
      setStep("otp");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setPasswordError(null);
    }
  };

  const currentStepIndex = stepIndex(step);

  return (
    <AuthSplitLayout>
          {/* Step indicator */}
          {step !== "success" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center">
                {STEPS.map((s, idx) => {
                  const isDone = currentStepIndex > idx;
                  const isActive = currentStepIndex === idx;
                  return (
                    <div key={s.id} className="flex items-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <motion.div
                          animate={{
                            scale: isActive ? 1.05 : 1,
                          }}
                          className={cn(
                            "size-9 rounded-full flex items-center justify-center transition-colors duration-300",
                            isDone && "bg-primary text-primary-foreground",
                            isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                            !isDone && !isActive && "bg-muted text-muted-foreground"
                          )}
                        >
                          {isDone ? (
                            <CheckCircle2 className="size-4" />
                          ) : (
                            <s.icon className="size-4" />
                          )}
                        </motion.div>
                        <span
                          className={cn(
                            "text-[11px] font-medium hidden sm:block",
                            isDone || isActive ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {s.label}
                        </span>
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div className="w-12 sm:w-16 mx-2 mb-5 h-0.5 rounded-full bg-border overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: isDone ? "100%" : "0%" }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">
                    ¿Olvidaste tu contraseña?
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Ingresa tu correo y te enviaremos un código de 6 dígitos para
                    verificar tu identidad.
                  </p>
                </div>

                <form onSubmit={handleSendEmail} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="nombre@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 rounded-xl border-border/80 bg-muted/30 text-sm pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm mt-2 group"
                    disabled={loading || !email}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="size-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                        Enviando código...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Enviar código de verificación
                        <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  ¿Recordaste tu contraseña?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </motion.div>
            )}

            {/* Step 2: OTP */}
            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
                >
                  <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                  Cambiar correo
                </button>

                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">
                    Verifica tu correo
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Enviamos un código de 6 dígitos a{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>

                {/* Timer */}
                <div className="mb-6 rounded-xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <Timer
                        className={cn(
                          "size-4",
                          isExpired ? "text-destructive" : "text-primary"
                        )}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {isExpired ? "Código expirado" : "Código válido por"}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-sm font-bold tabular-nums",
                        isExpired
                          ? "text-destructive"
                          : timeLeft <= 60
                          ? "text-amber-600"
                          : "text-primary"
                      )}
                    >
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        isExpired
                          ? "bg-destructive"
                          : timeLeft <= 60
                          ? "bg-amber-500"
                          : "bg-primary"
                      )}
                      animate={{ width: `${timerProgress}%` }}
                      transition={{ duration: 0.5, ease: "linear" }}
                    />
                  </div>
                  {isExpired && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-destructive mt-2.5"
                    >
                      El código ha expirado. Solicita uno nuevo para continuar.
                    </motion.p>
                  )}
                </div>

                {/* OTP Input */}
                <motion.div
                  animate={otpShake ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col gap-3 mb-2"
                >
                  <Label className="text-sm font-medium text-foreground text-center">
                    Código de verificación
                  </Label>
                  <InputOTP
                    ref={otpInputRef}
                    maxLength={6}
                    inputMode="numeric"
                    pattern="^[0-9]*$"
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={isExpired}
                  >
                    <InputOTPGroup
                      aria-invalid={otpError}
                      className={cn(
                        "w-full justify-center gap-2 sm:gap-2.5",
                        otpError && "has-aria-invalid"
                      )}
                    >
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          aria-invalid={otpError}
                          className={cn(
                            "size-12 sm:size-14 rounded-xl border-border/80 bg-muted/30 text-xl font-bold shadow-sm first:rounded-xl last:rounded-xl transition-all duration-200",
                            "data-[active=true]:border-primary/50 data-[active=true]:ring-primary/20 data-[active=true]:ring-3",
                            otp[i] && !otpError && "border-primary/30 bg-primary/5",
                            otpError &&
                              "border-destructive bg-destructive/5 text-destructive animate-pulse"
                          )}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  {/* Progress dots */}
                  <div className="flex items-center justify-between gap-2 px-1 mt-1">
                    <div className="flex gap-1">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1 w-5 rounded-full transition-all duration-300",
                            otpError && i < otp.length
                              ? "bg-destructive"
                              : i < otp.length
                              ? "bg-primary"
                              : "bg-border"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground tabular-nums">
                      {otp.length}/6 dígitos
                    </p>
                  </div>
                </motion.div>

                {/* Error message */}
                <AnimatePresence>
                  {otpError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3">
                        <p className="text-sm font-medium text-destructive">
                          Código incorrecto
                        </p>
                        <p className="text-xs text-destructive/80 mt-0.5">
                          {failedAttempts >= 3
                            ? "Demasiados intentos fallidos. Solicita un nuevo código."
                            : "Verifica el código e inténtalo de nuevo."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-3 mt-6">
                  <Button
                    type="button"
                    onClick={handleConfirmOtp}
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm group"
                    disabled={!otpComplete || isExpired || loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="size-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                        Verificando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Confirmar código
                        <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    className="w-full h-11 rounded-xl border-border/80 font-medium text-sm"
                    disabled={resendLoading || (resendCooldown > 0 && !isExpired)}
                  >
                    {resendLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="size-4 border-2 border-muted-foreground/40 border-t-muted-foreground rounded-full animate-spin" />
                        Reenviando...
                      </span>
                    ) : resendCooldown > 0 && !isExpired ? (
                      `Reenviar en ${resendCooldown}s`
                    ) : (
                      "Reenviar código"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: New Password */}
            {step === "password" && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
                >
                  <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                  Volver al código
                </button>

                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">
                    Nueva contraseña
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Crea una contraseña segura para tu cuenta. Asegúrate de recordarla.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="new-password" className="text-sm font-medium text-foreground">
                      Nueva contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError(null);
                        }}
                        className={cn(
                          "h-11 rounded-xl border-border/80 bg-muted/30 text-sm pr-10",
                          passwordError && "border-destructive focus-visible:ring-destructive/30"
                        )}
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {/* Strength indicator */}
                    {password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex flex-col gap-1.5 mt-1"
                      >
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((level) => {
                            const strength =
                              password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)
                                ? 4
                                : password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)
                                ? 3
                                : password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
                                ? 2
                                : password.length >= 4
                                ? 1
                                : 0;
                            return (
                              <div
                                key={level}
                                className={cn(
                                  "h-1 flex-1 rounded-full transition-colors duration-300",
                                  level <= strength
                                    ? strength <= 1
                                      ? "bg-destructive"
                                      : strength <= 2
                                      ? "bg-amber-500"
                                      : strength <= 3
                                      ? "bg-primary"
                                      : "bg-green-500"
                                    : "bg-border"
                                )}
                              />
                            );
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Al menos 8 caracteres con letras y números.
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                      Confirmar contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repite tu contraseña"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordError(null);
                        }}
                        className={cn(
                          "h-11 rounded-xl border-border/80 bg-muted/30 text-sm pr-10",
                          passwordError && confirmPassword && password !== confirmPassword && "border-destructive focus-visible:ring-destructive/30",
                          confirmPassword && password === confirmPassword && "border-green-500/50 focus-visible:ring-green-500/20"
                        )}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {confirmPassword && password === confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-green-600 flex items-center gap-1"
                      >
                        <CheckCircle2 className="size-3" />
                        Las contraseñas coinciden
                      </motion.p>
                    )}
                  </div>

                  <AnimatePresence>
                    {passwordError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3">
                          <p className="text-sm text-destructive">{passwordError}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm mt-2 group"
                    disabled={loading || !password || !confirmPassword}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="size-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                        Restableciendo...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Restablecer contraseña
                        <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="size-20 rounded-full bg-accent flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="size-10 text-accent-foreground" />
                </motion.div>

                <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
                  ¡Contraseña actualizada!
                </h1>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-8">
                  Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar
                  sesión con tu nueva contraseña.
                </p>

                <Button
                  asChild
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm group"
                >
                  <Link href="/login">
                    <span className="flex items-center gap-1.5">
                      Ir a iniciar sesión
                      <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
    </AuthSplitLayout>
  );
}
