"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  RemoveFormatting,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { focusRing, formControlBase, transitionInteractive } from "@/lib/ui-styles";
import { isRichTextEmpty } from "@/lib/rich-text";

type FormatCommand =
  | "bold"
  | "italic"
  | "underline"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "createLink"
  | "removeFormat";

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  minHeight?: string;
  disabled?: boolean;
}

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "size-8 rounded-md text-muted-foreground hover:text-foreground",
        active && "bg-muted text-foreground"
      )}
    >
      {children}
    </Button>
  );
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Escribe tu respuesta...",
  id,
  className,
  minHeight = "180px",
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = React.useState<Set<string>>(new Set());

  const syncValue = React.useCallback(() => {
    const html = editorRef.current?.innerHTML ?? "";
    onChange?.(html);
    updateActiveFormats();
  }, [onChange]);

  const updateActiveFormats = React.useCallback(() => {
    const formats = new Set<string>();
    try {
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("underline")) formats.add("underline");
      if (document.queryCommandState("insertUnorderedList")) formats.add("ul");
      if (document.queryCommandState("insertOrderedList")) formats.add("ol");
    } catch {
      /* ignore unsupported commands */
    }
    setActiveFormats(formats);
  }, []);

  React.useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const runCommand = (command: FormatCommand, valueArg?: string) => {
    if (disabled) return;
    editorRef.current?.focus();

    if (command === "createLink") {
      const url = window.prompt("URL del enlace:", "https://");
      if (!url) return;
      document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false, valueArg);
    }

    syncValue();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    syncValue();
  };

  const showPlaceholder = isRichTextEmpty(value);

  return (
    <div
      data-slot="rich-text-editor"
      className={cn(
        "overflow-hidden rounded-xl border border-input bg-card shadow-xs",
        transitionInteractive,
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/40",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border/60 bg-muted/30 px-2 py-1.5">
        <ToolbarButton
          label="Negrita"
          active={activeFormats.has("bold")}
          onClick={() => runCommand("bold")}
        >
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Cursiva"
          active={activeFormats.has("italic")}
          onClick={() => runCommand("italic")}
        >
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Subrayado"
          active={activeFormats.has("underline")}
          onClick={() => runCommand("underline")}
        >
          <Underline className="size-3.5" />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-border/80" aria-hidden />

        <ToolbarButton
          label="Lista con viñetas"
          active={activeFormats.has("ul")}
          onClick={() => runCommand("insertUnorderedList")}
        >
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Lista numerada"
          active={activeFormats.has("ol")}
          onClick={() => runCommand("insertOrderedList")}
        >
          <ListOrdered className="size-3.5" />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-border/80" aria-hidden />

        <ToolbarButton label="Insertar enlace" onClick={() => runCommand("createLink")}>
          <Link2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Quitar formato" onClick={() => runCommand("removeFormat")}>
          <RemoveFormatting className="size-3.5" />
        </ToolbarButton>
      </div>

      <div className="relative">
        {showPlaceholder && (
          <p className="pointer-events-none absolute left-3 top-3 text-sm text-muted-foreground/60">
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          id={id}
          role="textbox"
          aria-multiline
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={syncValue}
          onBlur={syncValue}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onPaste={handlePaste}
          className={cn(
            formControlBase,
            focusRing,
            "min-w-0 border-0 bg-transparent px-3 py-3 text-sm leading-relaxed shadow-none",
            "outline-none [&_a]:text-primary [&_a]:underline [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
            "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:my-1"
          )}
          style={{ minHeight }}
        />
      </div>
    </div>
  );
}
