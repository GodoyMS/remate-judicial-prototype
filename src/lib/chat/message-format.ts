import { HUMAN_SUPPORT_CONTACTS } from "./platform-context";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export function isValidName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 2 && trimmed.length <= 80 && !EMAIL_REGEX.test(trimmed);
}

/**
 * Normalizes assistant output for the chat UI (plain text + **bold** + [links](url)).
 */
export function sanitizeAssistantMessage(content: string): string {
  let text = content.trim();

  // Convert markdown headers to plain text with line breaks
  text = text.replace(/^#{1,6}\s+/gm, "");

  // Normalize bullet markers
  text = text.replace(/^\s*[-*]\s+/gm, "• ");

  // Collapse excessive blank lines
  text = text.replace(/\n{3,}/g, "\n\n");

  // Replace raw WhatsApp numbers with markdown links when not already linked
  for (const contact of HUMAN_SUPPORT_CONTACTS) {
    const escapedDisplay = contact.display.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const linkText = `[${contact.label} (${contact.display})](${contact.whatsappUrl})`;
    text = text.replace(
      new RegExp(`(?<!\\])${escapedDisplay}(?!\\()`, "g"),
      linkText
    );
  }

  return text.trim();
}

type FormattedNode =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "link"; label: string; href: string }
  | { type: "break" };

export function parseMessageContent(content: string): FormattedNode[] {
  const normalized = content
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\r\n/g, "\n");

  const nodes: FormattedNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(...parsePlainText(normalized.slice(lastIndex, match.index)));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push({ type: "bold", value: token.slice(2, -2) });
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        nodes.push({ type: "link", label: linkMatch[1], href: linkMatch[2] });
      } else {
        nodes.push({ type: "text", value: token });
      }
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < normalized.length) {
    nodes.push(...parsePlainText(normalized.slice(lastIndex)));
  }

  return nodes;
}

function parsePlainText(text: string): FormattedNode[] {
  const nodes: FormattedNode[] = [];
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(...splitLines(text.slice(lastIndex, match.index)));
    }
    nodes.push({ type: "link", label: match[1], href: match[1] });
    lastIndex = urlPattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(...splitLines(text.slice(lastIndex)));
  }

  return nodes;
}

function splitLines(text: string): FormattedNode[] {
  const nodes: FormattedNode[] = [];
  const lines = text.split("\n");

  lines.forEach((line, index) => {
    if (line) nodes.push({ type: "text", value: line });
    if (index < lines.length - 1) nodes.push({ type: "break" });
  });

  return nodes;
}
