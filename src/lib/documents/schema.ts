import { z } from "zod";
import { MAX_DOCUMENT_SIZE, getDocumentKind } from "./types";

export const uploadDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(120, "El título no puede superar los 120 caracteres"),
  description: z
    .string()
    .trim()
    .max(500, "La descripción no puede superar los 500 caracteres")
    .optional(),
  file: z
    .custom<File>(
      (v) => typeof File !== "undefined" && v instanceof File,
      "Selecciona un documento para subir"
    )
    .refine((f) => f.size > 0, "El archivo está vacío")
    .refine((f) => f.size <= MAX_DOCUMENT_SIZE, "El archivo supera el máximo de 20 MB")
    .refine(
      (f) => getDocumentKind(f) !== null,
      "Formato no permitido. Usa imagen (JPG, PNG, WEBP), PDF o Word (DOC, DOCX)"
    ),
});

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
