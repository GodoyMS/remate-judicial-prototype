"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, FileWarning } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addComplaint } from "@/lib/complaints/store";
import type { ComplaintType, DocumentType } from "@/lib/admin/types";

const complaintTypes: { value: ComplaintType; label: string }[] = [
  { value: "reclamo", label: "Reclamo" },
  { value: "queja", label: "Queja" },
  { value: "sugerencia", label: "Sugerencia" },
  { value: "consulta", label: "Consulta" },
];

const documentTypes: { value: DocumentType; label: string }[] = [
  { value: "dni", label: "DNI" },
  { value: "ce", label: "Carné de extranjería" },
  { value: "passport", label: "Pasaporte" },
];

export function ComplaintForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    documentType: "dni" as DocumentType,
    documentNumber: "",
    type: "reclamo" as ComplaintType,
    subject: "",
    description: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.subject || !form.description) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const complaint = addComplaint(form);
      setTrackingId(complaint.id);
      setSubmitted(true);
      setLoading(false);
      toast.success("Reclamación registrada", {
        description: `Tu número de seguimiento es ${complaint.id}`,
      });
    }, 1200);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-[#9FE870]/30 bg-[#9FE870]/10 p-8 sm:p-12 text-center"
      >
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#9FE870]/30">
          <CheckCircle2 className="size-8 text-[#163300]" />
        </div>
        <h3 className="text-2xl font-bold text-[#163300]">¡Reclamación registrada!</h3>
        <p className="mt-3 text-[#163300]/65">
          Hemos recibido tu solicitud. Te responderemos al correo{" "}
          <strong className="text-[#163300]">{form.email}</strong> en un plazo máximo de 15 días
          hábiles.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#163300]/10 bg-white px-5 py-3">
          <FileWarning className="size-4 text-[#163300]/50" />
          <span className="text-sm text-[#163300]/60">
            N° de seguimiento:{" "}
            <strong className="font-mono text-[#163300]">{trackingId}</strong>
          </span>
        </div>
        <Button
          variant="outline"
          className="mt-8 rounded-full"
          onClick={() => {
            setSubmitted(false);
            setForm({
              fullName: "",
              email: "",
              phone: "",
              documentType: "dni",
              documentNumber: "",
              type: "reclamo",
              subject: "",
              description: "",
            });
          }}
        >
          Registrar otra reclamación
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#163300]/8 bg-white p-6 sm:p-8 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#163300]">Formulario de reclamación</h3>
        <p className="mt-1 text-sm text-[#163300]/60">
          Campos marcados con * son obligatorios. Tu información será tratada de forma confidencial.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fullName">Nombre completo *</Label>
          <Input
            id="fullName"
            placeholder="Ej. Juan Pérez García"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="rounded-xl border-[#163300]/10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico *</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="rounded-xl border-[#163300]/10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            placeholder="+51 999 888 777"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="rounded-xl border-[#163300]/10"
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de documento</Label>
          <Select
            value={form.documentType}
            onValueChange={(v) => update("documentType", v)}
          >
            <SelectTrigger className="rounded-xl border-[#163300]/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentNumber">Número de documento</Label>
          <Input
            id="documentNumber"
            placeholder="12345678"
            value={form.documentNumber}
            onChange={(e) => update("documentNumber", e.target.value)}
            className="rounded-xl border-[#163300]/10"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Tipo de solicitud *</Label>
          <Select value={form.type} onValueChange={(v) => update("type", v)}>
            <SelectTrigger className="rounded-xl border-[#163300]/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {complaintTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="subject">Asunto *</Label>
          <Input
            id="subject"
            placeholder="Resumen breve de tu reclamación"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            className="rounded-xl border-[#163300]/10"
            required
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Descripción detallada *</Label>
          <Textarea
            id="description"
            placeholder="Describe tu reclamación con el mayor detalle posible. Incluye fechas, montos y cualquier información relevante."
            rows={5}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="rounded-xl border-[#163300]/10 resize-none"
            required
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#163300]/45">
          Conforme a la Ley N° 29571 — Código de Protección y Defensa del Consumidor
        </p>
        <Button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#163300] px-8 font-semibold text-white hover:bg-[#163300]/90"
        >
          <Send className="mr-2 size-4" />
          {loading ? "Enviando..." : "Enviar reclamación"}
        </Button>
      </div>
    </motion.form>
  );
}
