"use client";

import { cn } from "@/lib/utils";

interface RichTextContentProps {
  html: string;
  className?: string;
}

/** Renders stored rich-text HTML with helpdesk-friendly typography. */
export function RichTextContent({ html, className }: RichTextContentProps) {
  return (
    <div
      className={cn(
        "text-sm leading-relaxed [&_a]:text-primary [&_a]:underline",
        "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:my-1",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
