"use client";
import { FieldSpec } from "@/lib/fields";
import { Measurement } from "@/lib/validate";
import { checkPlausibility } from "@/lib/plausibility";
import MethodPanel from "./MethodPanel";
import { useI18n, Rich } from "./I18nProvider";

interface Props {
  field: FieldSpec;
  value: Measurement | undefined;
  onChange: (m: Measurement) => void;
  computedValue?: number | null;
}

export default function Field({ field, value, onChange, computedValue }: Props) {
  const { t, td } = useI18n();
  const unit = value?.unit ?? field.units[0];
  const val = value?.value ?? null;
  const fromCalc = !!value?.calc;
  const warn = checkPlausibility(field.id, val, unit);

  const tags: { key: string; label: string }[] = [];
  if (field.usedBy.br) tags.push({ key: "BR", label: "BR" });
  if (field.usedBy.pt) tags.push({ key: "PT/UE", label: "PT/UE" });
  if (field.auxiliary) tags.push({ key: "aux", label: t("field.auxiliar") });

  if (field.computed) {
    return (
      <div className="rounded-lg glass p-3">
        <div className="flex items-baseline justify-between gap-2">
          <label className="text-sm font-medium">{td(field.label)}</label>
          <span className="text-xs text-[var(--muted)]">{t("field.computed")}</span>
        </div>
        <div className="mt-1 font-mono text-lg">
          {computedValue === null || computedValue === undefined
            ? "—"
            : Number(computedValue.toFixed(4)).toLocaleString("pt-PT")}
        </div>
        {field.help && <p className="mt-1 text-xs text-[var(--muted)]">{td(field.help)}</p>}
        <MethodPanel canonicalId={field.id} />
      </div>
    );
  }

  if (field.dimension === "boolean") {
    return (
      <div className="rounded-lg glass p-3">
        <label className="text-sm font-medium">{td(field.label)}</label>
        <select
          aria-label={td(field.label)}
          value={val === null ? "" : String(val)}
          onChange={(e) => onChange({ value: e.target.value === "" ? null : Number(e.target.value), unit })}
          className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-2 py-1.5 text-sm"
        >
          <option value="">{t("field.notEvaluated")}</option>
          <option value="0">{t("field.absent")}</option>
          <option value="1">{t("field.present")}</option>
        </select>
        {field.help && <p className="mt-1 text-xs text-[var(--muted)]">{td(field.help)}</p>}
        <MethodPanel canonicalId={field.id} />
      </div>
    );
  }

  return (
    <div className="rounded-lg glass p-3">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-sm font-medium">{td(field.label)}</label>
        <span className="flex items-center gap-1">
          {fromCalc && (
            <span
              className="rounded bg-[var(--ok-bg)] px-1.5 py-0.5 text-[10px] text-[var(--ok-fg)]"
              title={t("field.calculatedTitle")}
            >
              {t("field.computed")}
            </span>
          )}
          {tags.map((tg) => (
            <span
              key={tg.key}
              className="rounded bg-[var(--input)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]"
            >
              {tg.label}
            </span>
          ))}
        </span>
      </div>
      <div className="mt-1 flex gap-2">
        <input
          type="number"
          aria-label={`${td(field.label)}${unit && unit !== "—" ? ` (${unit})` : ""}`}
          inputMode="decimal"
          step="any"
          value={val === null ? "" : val}
          onChange={(e) => onChange({ value: e.target.value === "" ? null : Number(e.target.value), unit })}
          placeholder="—"
          className="w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-2 py-1.5 font-mono text-sm focus:border-[var(--secondary)] focus:outline-none"
        />
        {field.units.length > 1 ? (
          <select
            aria-label={`${td(field.label)} — ${t("field.unit")}`}
            value={unit}
            onChange={(e) => onChange({ value: val, unit: e.target.value })}
            className="rounded-md border border-[var(--border)] bg-[var(--input)] px-2 py-1.5 text-xs"
          >
            {field.units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        ) : (
          <span className="flex items-center px-1 text-xs text-[var(--muted)] whitespace-nowrap">
            {field.units[0] !== "—" ? field.units[0] : ""}
          </span>
        )}
      </div>
      {warn && (
        <p className="mt-1 rounded bg-[var(--warn-bg)] px-2 py-1 text-xs text-[var(--warn-fg)]">
          ⚠ {warn}
        </p>
      )}
      {fromCalc && (
        <p className="mt-1 text-xs text-[var(--muted)]">
          <Rich text={t("field.calculatedNote")} />
        </p>
      )}
      {!fromCalc && field.help && <p className="mt-1 text-xs text-[var(--muted)]">{td(field.help)}</p>}
      <MethodPanel canonicalId={field.id} />
    </div>
  );
}
