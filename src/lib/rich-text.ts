/** Strip HTML tags and collapse whitespace for validation / previews. */
export function stripHtml(html: string): string {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent ?? div.innerText ?? "").replace(/\s+/g, " ").trim();
}

export function isRichTextEmpty(html: string): boolean {
  return stripHtml(html).length === 0;
}
