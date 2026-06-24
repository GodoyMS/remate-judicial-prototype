import type {
  Retorno,
  RetornoTicket,
  TicketActivity,
  TicketActivityType,
} from "./types";
import { initialRetornos } from "./mock-data";

let retornos: Retorno[] = [...initialRetornos];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribeRetornos(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getRetornos(): Retorno[] {
  return [...retornos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getRetornoById(id: string): Retorno | undefined {
  return retornos.find((r) => r.id === id);
}

export function getRetornosByUserId(userId: string): Retorno[] {
  return retornos
    .filter((r) => r.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getFlaggedRetornos(): Retorno[] {
  return retornos.filter((r) => r.ticket?.status === "flagged");
}

export function getAssignedToRetornos(adminId: string): Retorno[] {
  return retornos.filter((r) => r.ticket?.assignedToId === adminId);
}

export function addRetorno(
  data: Omit<Retorno, "id" | "createdAt" | "status">
): Retorno {
  const retorno: Retorno = {
    ...data,
    id: `ret-${Date.now()}`,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    confirmedAt: new Date().toISOString(),
  };
  retornos = [retorno, ...retornos];
  notify();
  return retorno;
}

export function openTicket(
  retornoId: string,
  data: Pick<RetornoTicket, "title" | "reason" | "description" | "attachments">,
  userName: string
): Retorno | undefined {
  const index = retornos.findIndex((r) => r.id === retornoId);
  if (index === -1) return undefined;

  const now = new Date().toISOString();
  const activity: TicketActivity[] = [
    {
      id: `act-${Date.now()}-1`,
      type: "created",
      title: "Ticket creado",
      byUser: userName,
      byRole: "client",
      createdAt: now,
    },
    {
      id: `act-${Date.now()}-2`,
      type: "flagged",
      title: "Ticket marcado como observado",
      byUser: "Sistema",
      byRole: "admin",
      createdAt: new Date(Date.now() + 1).toISOString(),
    },
  ];

  const ticket: RetornoTicket = {
    ...data,
    id: `tkt-${Date.now()}`,
    retornoId,
    status: "flagged",
    createdAt: now,
    activity,
  };

  const updated: Retorno = { ...retornos[index], ticket };
  retornos = retornos.map((r) => (r.id === retornoId ? updated : r));
  notify();
  return updated;
}

export function reopenTicket(
  retornoId: string,
  description: string,
  attachments: RetornoTicket["attachments"],
  userName: string
): Retorno | undefined {
  const index = retornos.findIndex((r) => r.id === retornoId);
  if (index === -1 || !retornos[index].ticket) return undefined;

  const now = new Date().toISOString();
  const newActivity: TicketActivity[] = [
    {
      id: `act-${Date.now()}-1`,
      type: "client_message",
      title: "Nueva observación del cliente",
      description,
      attachments,
      byUser: userName,
      byRole: "client",
      createdAt: now,
    },
    {
      id: `act-${Date.now()}-2`,
      type: "reopened",
      title: "Ticket reabierto",
      byUser: userName,
      byRole: "client",
      createdAt: new Date(Date.now() + 1).toISOString(),
    },
    {
      id: `act-${Date.now()}-3`,
      type: "flagged",
      title: "Ticket marcado como observado nuevamente",
      byUser: "Sistema",
      byRole: "admin",
      createdAt: new Date(Date.now() + 2).toISOString(),
    },
  ];

  const updatedTicket: RetornoTicket = {
    ...retornos[index].ticket!,
    status: "flagged",
    assignedToId: undefined,
    assignedToName: undefined,
    assignedAt: undefined,
    activity: [...retornos[index].ticket!.activity, ...newActivity],
  };

  const updated: Retorno = { ...retornos[index], ticket: updatedTicket };
  retornos = retornos.map((r) => (r.id === retornoId ? updated : r));
  notify();
  return updated;
}

export function assignTicket(
  retornoId: string,
  adminId: string,
  adminName: string,
  assignedByName: string
): Retorno | undefined {
  const index = retornos.findIndex((r) => r.id === retornoId);
  if (index === -1 || !retornos[index].ticket) return undefined;

  const now = new Date().toISOString();
  const newActivity: TicketActivity[] = [
    {
      id: `act-${Date.now()}-1`,
      type: "assigned",
      title: `Ticket asignado a ${adminName}`,
      byUser: assignedByName,
      byRole: "admin",
      createdAt: now,
    },
    {
      id: `act-${Date.now()}-2`,
      type: "in_review",
      title: "Ticket en revisión",
      byUser: adminName,
      byRole: "admin",
      createdAt: new Date(Date.now() + 1).toISOString(),
    },
  ];

  const updatedTicket: RetornoTicket = {
    ...retornos[index].ticket!,
    status: "in_review",
    assignedToId: adminId,
    assignedToName: adminName,
    assignedAt: now,
    activity: [...retornos[index].ticket!.activity, ...newActivity],
  };

  const updated: Retorno = { ...retornos[index], ticket: updatedTicket };
  retornos = retornos.map((r) => (r.id === retornoId ? updated : r));
  notify();
  return updated;
}

export function resolveTicket(
  retornoId: string,
  responseHtml: string,
  attachments: RetornoTicket["attachments"],
  resolverName: string
): Retorno | undefined {
  const index = retornos.findIndex((r) => r.id === retornoId);
  if (index === -1 || !retornos[index].ticket) return undefined;

  const now = new Date().toISOString();
  const newActivity: TicketActivity[] = [
    {
      id: `act-${Date.now()}-1`,
      type: "admin_message",
      title: "Respuesta oficial del equipo",
      description: responseHtml,
      attachments,
      byUser: resolverName,
      byRole: "admin",
      createdAt: now,
    },
    {
      id: `act-${Date.now()}-2`,
      type: "resolved",
      title: "Ticket resuelto",
      byUser: resolverName,
      byRole: "admin",
      createdAt: new Date(Date.now() + 1).toISOString(),
    },
  ];

  const updatedTicket: RetornoTicket = {
    ...retornos[index].ticket!,
    status: "resolved",
    resolvedAt: now,
    resolvedByName: resolverName,
    activity: [...retornos[index].ticket!.activity, ...newActivity],
  };

  const updated: Retorno = { ...retornos[index], ticket: updatedTicket };
  retornos = retornos.map((r) => (r.id === retornoId ? updated : r));
  notify();
  return updated;
}

export function addActivityEntry(
  retornoId: string,
  type: TicketActivityType,
  title: string,
  byUser: string,
  byRole: "client" | "admin"
): void {
  const index = retornos.findIndex((r) => r.id === retornoId);
  if (index === -1 || !retornos[index].ticket) return;

  const newActivity: TicketActivity = {
    id: `act-${Date.now()}`,
    type,
    title,
    byUser,
    byRole,
    createdAt: new Date().toISOString(),
  };

  const updatedTicket: RetornoTicket = {
    ...retornos[index].ticket!,
    activity: [...retornos[index].ticket!.activity, newActivity],
  };

  const updated: Retorno = { ...retornos[index], ticket: updatedTicket };
  retornos = retornos.map((r) => (r.id === retornoId ? updated : r));
  notify();
}
