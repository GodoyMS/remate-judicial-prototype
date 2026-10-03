import { getDocumentKind, type UserDocument } from "./types";

/**
 * Store en memoria del módulo "Mis documentos" (prototipo, sin backend).
 * Las llamadas simulan latencia de red para poder mostrar estados de carga
 * y error reales en la UI.
 */

const SEED: Omit<UserDocument, "userId">[] = [
  {
    id: "doc-seed-1",
    title: "DNI — anverso",
    description: "Documento de identidad usado para la verificación KYC.",
    fileName: "dni-anverso.jpg",
    mimeType: "image/jpeg",
    kind: "image",
    size: 842_310,
    url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&fit=crop",
    uploadedAt: "2026-09-12T15:24:00.000Z",
  },
  {
    id: "doc-seed-2",
    title: "Constancia de cuenta bancaria",
    fileName: "constancia-bcp.pdf",
    mimeType: "application/pdf",
    kind: "pdf",
    size: 1_024,
    url: "/samples/constancia-cuenta.pdf",
    uploadedAt: "2026-09-28T10:02:00.000Z",
  },
];

let documents: UserDocument[] | null = null;
const listeners = new Set<() => void>();

function ensure(userId: string): UserDocument[] {
  if (!documents) documents = SEED.map((d) => ({ ...d, userId }));
  return documents;
}

function notify() {
  listeners.forEach((fn) => fn());
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function subscribeDocuments(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function fetchDocuments(userId: string): Promise<UserDocument[]> {
  await wait(700);
  return ensure(userId)
    .filter((d) => d.userId === userId)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

export async function uploadDocument(
  userId: string,
  input: { title: string; description?: string; file: File },
  onProgress: (pct: number) => void
): Promise<UserDocument> {
  for (let pct = 0; pct <= 100; pct += 10) {
    onProgress(pct);
    await wait(90 + Math.min(input.file.size / 200_000, 120));
  }
  const doc: UserDocument = {
    id: `doc-${Date.now()}`,
    userId,
    title: input.title,
    description: input.description || undefined,
    fileName: input.file.name,
    mimeType: input.file.type,
    kind: getDocumentKind(input.file)!,
    size: input.file.size,
    url: URL.createObjectURL(input.file),
    uploadedAt: new Date().toISOString(),
  };
  documents = [doc, ...ensure(userId)];
  notify();
  return doc;
}

export async function deleteDocument(userId: string, id: string): Promise<void> {
  await wait(400);
  const target = ensure(userId).find((d) => d.id === id);
  if (target?.url.startsWith("blob:")) URL.revokeObjectURL(target.url);
  documents = ensure(userId).filter((d) => d.id !== id);
  notify();
}
