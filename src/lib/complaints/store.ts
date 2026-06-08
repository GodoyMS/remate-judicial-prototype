import type { Complaint, ComplaintResponse } from "@/lib/admin/types";

const initialComplaints: Complaint[] = [
  {
    id: "rec-001",
    fullName: "Carlos Mendoza Ríos",
    email: "carlos.mendoza@gmail.com",
    phone: "+51 987 654 321",
    documentType: "dni",
    documentNumber: "45678912",
    type: "reclamo",
    subject: "Retraso en confirmación de inversión",
    description:
      "Realicé una transferencia bancaria el 15 de mayo por S/ 5,000 hacia la propiedad en San Isidro. Han pasado 5 días hábiles y mi inversión sigue en estado pendiente. Adjunté el voucher correctamente.",
    status: "pending",
    createdAt: "2026-06-03T10:30:00",
  },
  {
    id: "rec-002",
    fullName: "Ana Lucía Torres",
    email: "ana.torres@outlook.com",
    phone: "+51 912 345 678",
    documentType: "dni",
    documentNumber: "72345678",
    type: "queja",
    subject: "Dificultad para verificar identidad",
    description:
      "Intenté subir mi DNI tres veces y el sistema rechaza la foto del reverso indicando que está borrosa, aunque la imagen es nítida. Necesito asistencia para completar mi verificación KYC.",
    status: "in_review",
    createdAt: "2026-06-01T14:15:00",
  },
  {
    id: "rec-003",
    fullName: "Roberto Sánchez Vega",
    email: "rsanchez@empresa.pe",
    phone: "+51 998 112 233",
    documentType: "ce",
    documentNumber: "001234567",
    type: "consulta",
    subject: "Consulta sobre retención de impuestos",
    description:
      "¿Cómo se aplican las retenciones de impuesto a la renta sobre los retornos de inversión en remates judiciales? Necesito documentación para mi contador.",
    status: "resolved",
    createdAt: "2026-05-28T09:00:00",
    response: {
      message:
        "Estimado Roberto, gracias por su consulta. Los retornos generados por inversiones en remates judiciales están sujetos a retención del 5% según la normativa vigente (Resolución SBS N° 1234-2025). Hemos enviado el certificado de retenciones a su correo registrado. Quedamos atentos a cualquier duda adicional.",
      respondedBy: "Valentina Ríos",
      respondedAt: "2026-05-29T11:30:00",
    },
  },
  {
    id: "rec-004",
    fullName: "Patricia Huamán Quispe",
    email: "phuaman@yahoo.com",
    phone: "+51 945 678 901",
    documentType: "dni",
    documentNumber: "34567890",
    type: "sugerencia",
    subject: "Mejorar filtros de búsqueda de propiedades",
    description:
      "Sería muy útil poder filtrar propiedades por distrito y rango de ROI simultáneamente. También sugiero agregar un mapa interactivo para ver la ubicación de cada inmueble.",
    status: "resolved",
    createdAt: "2026-05-25T16:45:00",
    response: {
      message:
        "Hola Patricia, agradecemos mucho su sugerencia. Nuestro equipo de producto ya la tiene en el roadmap para el próximo trimestre. Le notificaremos cuando estén disponibles los nuevos filtros y el mapa interactivo.",
      respondedBy: "Valentina Ríos",
      respondedAt: "2026-05-26T10:00:00",
    },
  },
];

let complaints: Complaint[] = [...initialComplaints];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribeComplaints(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getComplaints(): Complaint[] {
  return [...complaints].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getComplaintById(id: string): Complaint | undefined {
  return complaints.find((c) => c.id === id);
}

export function addComplaint(
  data: Omit<Complaint, "id" | "status" | "createdAt" | "response">
): Complaint {
  const complaint: Complaint = {
    ...data,
    id: `rec-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  complaints = [complaint, ...complaints];
  notify();
  return complaint;
}

export function respondToComplaint(
  id: string,
  response: Omit<ComplaintResponse, "respondedAt">
): Complaint | undefined {
  const index = complaints.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  const updated: Complaint = {
    ...complaints[index],
    status: "resolved",
    response: {
      ...response,
      respondedAt: new Date().toISOString(),
    },
  };
  complaints = complaints.map((c) => (c.id === id ? updated : c));
  notify();
  return updated;
}

export function updateComplaintStatus(
  id: string,
  status: Complaint["status"]
): Complaint | undefined {
  const index = complaints.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  const updated = { ...complaints[index], status };
  complaints = complaints.map((c) => (c.id === id ? updated : c));
  notify();
  return updated;
}
