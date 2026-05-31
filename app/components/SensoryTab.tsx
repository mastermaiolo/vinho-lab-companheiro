"use client";
import { SENSORY_OIV, DEFECTS, computeOivScore } from "@/lib/sensory";
import { useI18n } from "./I18nProvider";

interface Props {
  scores: Record<string, number>;
  setScore: (key: string, v: number) => void;
  defeitos: string[];
  toggleDefeito: (d: string) => void;
  notas: string;
  setNotas: (s: string) => void;
}

export default function SensoryTab({
  scores,
  setScore,
  defeitos,
  toggleDefeito,
  notas,
  setNotas,
}: Props) {
  const { t, td } = useI18n();
  const result = computeOivScore(scores);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg glass p-4">
        <div>
          <div className="text-sm text-[var(--muted)]">{t("sensory.oivScore")}</div>
          <div className="text-3xl font-bold text-[var(--primary)]">
            {result.total} <span className="text-lg font-normal text-[var(--muted)]">/ 100</span>
          </div>
        </div>
        <div className="rounded-lg bg-[var(--accent)] px-4 py-2 font-semibold text-white">
          {td(result.categoria)}
        </div>
      </div>

      {Object.entries(SENSORY_OIV).map(([sectionKey, section]) => (
        <div key={sectionKey} className="rounded-lg glass p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="font-semibold">{td(section.label)}</h3>
            <span className="text-sm text-[var(--muted)]">
              {result.seccoes[section.label].obtido} / {section.max_points} {t("sensory.pts")}
            </span>
          </div>
          <div className="space-y-3">
            {section.criteria.map((c) => {
              const key = `${sectionKey}.${c.key}`;
              const v = scores[key] ?? 0;
              return (
                <div key={key} className="grid grid-cols-[1fr_auto] items-center gap-3">
                  <div>
                    <label className="text-sm">{td(c.label)}</label>
                    <input
                      type="range"
                      min={0}
                      max={c.max}
                      step={1}
                      value={v}
                      onChange={(e) => setScore(key, Number(e.target.value))}
                      className="mt-1 w-full accent-[var(--primary)]"
                    />
                  </div>
                  <span className="w-14 text-right font-mono text-sm">
                    {v} / {c.max}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="rounded-lg glass p-4">
        <h3 className="mb-1 font-semibold">{t("sensory.defectsTitle")}</h3>
        <p className="mb-3 text-xs text-[var(--muted)]">{t("sensory.defectsHint")}</p>
        <div className="space-y-2">
          {Object.entries(DEFECTS).map(([name, info]) => {
            const checked = defeitos.includes(name);
            return (
              <label
                key={name}
                className={`block cursor-pointer rounded-md border p-2 text-sm transition-colors ${
                  checked ? "border-[var(--secondary)] bg-[var(--bad-bg)]" : "border-[var(--border)]"
                }`}
              >
                <span className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDefeito(name)}
                    className="mt-1 accent-[var(--primary)]"
                  />
                  <span>
                    <strong>{td(name)}</strong>
                    <span className="block text-xs text-[var(--muted)]">{td(info.descricao)}</span>
                    {checked && (
                      <span className="mt-1 block text-xs text-[var(--muted)]">
                        {t("sensory.compound")}: {td(info.compostos)} · {t("sensory.threshold")}: {td(info["limite_perceção"])} · {t("sensory.lab")}: {td(info["deteção_laboratorial"])}
                      </span>
                    )}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg glass p-4">
        <label className="text-sm font-medium">{t("sensory.tastingNotes")}</label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-2 py-1.5 text-sm"
          placeholder={t("sensory.tastingPlaceholder")}
        />
      </div>
    </div>
  );
}
