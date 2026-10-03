import { FileImage, FileText, FileType2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocumentKind } from "@/lib/documents/types";

const CONFIG: Record<DocumentKind, { icon: typeof FileText; className: string }> = {
  image: { icon: FileImage, className: "bg-info/10 text-info" },
  pdf: { icon: FileText, className: "bg-destructive/10 text-destructive" },
  word: { icon: FileType2, className: "bg-primary/10 text-primary" },
};

export function DocumentKindIcon({
  kind,
  className,
}: {
  kind: DocumentKind;
  className?: string;
}) {
  const { icon: Icon, className: tone } = CONFIG[kind];
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl",
        tone,
        className
      )}
    >
      <Icon className="size-[45%]" />
    </span>
  );
}
