"use client";

export function downloadMarkdown(md: string, lote: string): void {
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `boletim_${(lote || "vinho-lab").replace(/[^\w-]+/g, "_")}.md`;
  a.click();
  URL.revokeObjectURL(a.href);
}
