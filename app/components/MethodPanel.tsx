"use client";
import { useState } from "react";
import { methodForCanonical } from "@/lib/methods";
import { useI18n } from "./I18nProvider";

function Para({ title, text, mono }: { title: string; text: string; mono?: boolean }) {
  if (!text) return null;
  return (
    <div>
      <div className="font-medium text-[var(--foreground)]">{title}</div>
      {text.split("\n").map((line, i) => (
        <p key={i} className={mono ? "font-mono text-[11px] text-[var(--muted)]" : "text-[var(--muted)]"}>
          {line}
        </p>
      ))}
    </div>
  );
}

function List({ title, items, ordered }: { title: string; items: string[]; ordered?: boolean }) {
  if (!items || items.length === 0) return null;
  const cls = "ml-4 list-outside text-[var(--muted)]";
  return (
    <div>
      <div className="font-medium text-[var(--foreground)]">{title}</div>
      {ordered ? (
        <ol className={`${cls} list-decimal`}>
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      ) : (
        <ul className={`${cls} list-disc`}>
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function MethodPanel({ canonicalId }: { canonicalId: string }) {
  const { t, td } = useI18n();
  const [open, setOpen] = useState(false);
  const found = methodForCanonical(canonicalId);
  if (!found) return null;
  const { code, method } = found;

  return (
    <div className="mt-1.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-[var(--secondary)] underline"
        aria-expanded={open}
      >
        {open ? t("method.hide") : t("method.show")}
      </button>
      {open && (
        <div className="mt-2 space-y-2 rounded-md border border-[var(--border)] bg-[var(--input)] p-2 text-xs">
          <div className="font-semibold text-[var(--foreground)]">
            {td(method.name)} <span className="font-normal text-[var(--muted)]">· {code}</span>
          </div>
          <Para title={t("method.principle")} text={td(method.principle)} />
          <List title={t("method.equipment")} items={method.equipment.map(td)} />
          <List title={t("method.reagents")} items={method.reagents.map(td)} />
          <List title={t("method.procedure")} items={method.procedure.map(td)} ordered />
          <Para title={t("method.calculation")} text={td(method.calculation)} mono />
          <Para title={t("method.precision")} text={td(method.precision)} />
          <Para title={t("method.acceptance")} text={td(method.regulatory_acceptance)} />
        </div>
      )}
    </div>
  );
}
