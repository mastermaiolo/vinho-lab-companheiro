"use client";
import { useEffect, useRef, useState } from "react";
import { SessionData, downloadSession, parseSession } from "@/lib/session";
import { useI18n } from "./I18nProvider";

interface Props {
  data: SessionData;
  onImport: (d: SessionData) => void;
}

export default function DataToolbar({ data, onImport }: Props) {
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // A mensagem de estado desaparece sozinha (não fica colada para sempre).
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 5000);
    return () => clearTimeout(t);
  }, [msg]);

  const handleExport = () => {
    downloadSession(data, data.meta.lote || data.meta.amostra);
    setMsg({ kind: "ok", text: t("toolbar.exported") });
  };

  const handleFile = async (file: File) => {
    try {
      const parsed = parseSession(JSON.parse(await file.text()));
      onImport(parsed);
      setMsg({
        kind: "ok",
        text: t("toolbar.imported", { name: parsed.meta.amostra || parsed.meta.lote || file.name }),
      });
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : t("toolbar.importFail") });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleExport}
        className="rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--secondary)]"
      >
        ⬇ {t("toolbar.export")}
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        className="rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--secondary)]"
      >
        ⬆ {t("toolbar.import")}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      {msg && (
        <span className={`text-xs ${msg.kind === "ok" ? "text-[var(--ok-fg)]" : "text-[var(--bad-fg)]"}`}>
          {msg.text}
        </span>
      )}
    </div>
  );
}
