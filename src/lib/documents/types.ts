export type DocumentKind = "image" | "pdf" | "word";

export interface UserDocument {
  id: string;
  userId: string;
  title: string;
  description?: string;
  fileName: string;
  mimeType: string;
  kind: DocumentKind;
  /** Bytes. */
  size: number;
  /** Object URL (subidas de la sesión) o URL remota (semilla). */
  url: string;
  uploadedAt: string;
}

export const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  image: "Imagen",
  pdf: "PDF",
  word: "Word",
};

export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;

export const ACCEPTED_DOCUMENT_TYPES: Record<string, DocumentKind> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "application/pdf": "pdf",
  "application/msword": "word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "word",
};

const EXTENSION_KINDS: Record<string, DocumentKind> = {
  jpg: "image",
  jpeg: "image",
  png: "image",
  webp: "image",
  gif: "image",
  pdf: "pdf",
  doc: "word",
  docx: "word",
};

/** El navegador a veces deja `type` vacío para .doc/.docx: se cae a la extensión. */
export function getDocumentKind(file: { name: string; type: string }): DocumentKind | null {
  const byMime = ACCEPTED_DOCUMENT_TYPES[file.type];
  if (byMime) return byMime;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_KINDS[ext] ?? null;
}

export const ACCEPT_ATTRIBUTE = ".jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
