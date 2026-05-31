"use client";
import { FieldSpec } from "@/lib/fields";
import { calculatorFor } from "@/lib/calculators";
import { Measurement, Measurements } from "@/lib/validate";
import { checkCalcInputs, checkPlausibility } from "@/lib/plausibility";
import MethodPanel from "./MethodPanel";
import { useI18n, Rich } from "./I18nProvider";

interface Props {
  fields: FieldSpec[];
  measurements: Measurements;
  setMeasurement: (id: string, m: Measurement) => void;
}

function fmt(v: number): string {
  return Number(v.toFixed(4)).toLocaleString("pt-PT");
}

export default function CalculatorTab({ fields, measurements, setMeasurement }: Props) {
  const { t, td } = useI18n();
  const calcFields = fields.filter((f) => calculatorFor(f.id));

  return (
    <div className="space-y-4">
      <p className="text-xs text-[var(--muted)]">
        <Rich text={t("calc.intro")} />
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {calcFields.map((field) => {
          const calc = calculatorFor(field.id)!;
          const stored = measurements[field.id]?.calc?.inputs;
          const inputs: Record<string, number | null> =
            stored ?? Object.fromEntries(calc.inputs.map((i) => [i.key, i.default ?? null]));
          const result = calc.compute(inputs);
          const inputWarnings = checkCalcInputs(inputs);
          const resultWarning = checkPlausibility(field.id, result, calc.outputUnit);

          const update = (key: string, raw: string) => {
            const next = { ...inputs, [key]: raw === "" ? null : Number(raw) };
            setMeasurement(field.id, {
              value: calc.compute(next),
              unit: calc.outputUnit,
              calc: { method: calc.method, formula: calc.formula, inputs: next },
            });
          };

          const tags: { key: string; label: string }[] = [];
          if (field.usedBy.br) tags.push({ key: "BR", label: "BR" });
          if (field.usedBy.pt) tags.push({ key: "PT/UE", label: "PT/UE" });
          if (field.auxiliary) tags.push({ key: "aux", label: t("field.auxiliar") });

          return (
            <div key={field.id} className="rounded-lg glass p-3">
              <div className="flex items-baseline justify-between gap-2">
                <label className="text-sm font-medium">{td(field.label)}</label>
                {tags.length > 0 && (
                  <span className="flex gap-1">
                    {tags.map((tg) => (
                      <span
                        key={tg.key}
                        className="rounded bg-[var(--input)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]"
                      >
                        {tg.label}
                      </span>
                    ))}
                  </span>
                )}
              </div>

              <div className="mt-2 space-y-1.5">
                {calc.inputs.map((i) => (
                  <div key={i.key} className="flex items-center gap-2">
                    <label className="flex-1 text-xs text-[var(--muted)]">{td(i.label)}</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="any"
                      value={inputs[i.key] ?? ""}
                      onChange={(e) => update(i.key, e.target.value)}
                      placeholder="—"
                      className="w-20 rounded-md border border-[var(--border)] bg-[var(--input)] px-2 py-1 text-right font-mono text-sm focus:border-[var(--secondary)] focus:outline-none"
                    />
                    {i.suffix && <span className="w-12 text-xs text-[var(--muted)]">{i.suffix}</span>}
                  </div>
                ))}
              </div>

              <div className="mt-2 rounded-md bg-[var(--input)] px-2 py-1.5">
                <div className="font-mono text-[10px] text-[var(--muted)]">{calc.formula}</div>
                <div className="mt-0.5 font-mono text-base font-semibold text-[var(--primary)]">
                  {result === null ? "—" : `${fmt(result)} ${calc.outputUnit}`}
                </div>
              </div>

              {(inputWarnings.length > 0 || resultWarning) && (
                <div className="mt-1 space-y-1">
                  {inputWarnings.map((w, i) => (
                    <p
                      key={i}
                      className="rounded bg-[var(--warn-bg)] px-2 py-1 text-xs text-[var(--warn-fg)]"
                    >
                      ⚠ {w}
                    </p>
                  ))}
                  {resultWarning && (
                    <p className="rounded bg-[var(--warn-bg)] px-2 py-1 text-xs text-[var(--warn-fg)]">
                      ⚠ {resultWarning}
                    </p>
                  )}
                </div>
              )}

              {calc.note && <p className="mt-1 text-xs text-[var(--muted)]">{td(calc.note)}</p>}
              <MethodPanel canonicalId={field.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
