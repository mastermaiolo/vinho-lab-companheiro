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
    <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
      {/* Resumo da Pontuação Sensorial OIV */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl glass p-6 border border-[var(--border)] relative overflow-hidden bg-gradient-to-r from-black/40 via-[var(--card)] to-black/40">
        <div className="absolute top-0 right-0 h-32 w-32 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="text-center sm:text-left">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] font-bold mb-1">{t("sensory.oivScore")}</div>
          <div className="flex items-baseline justify-center sm:justify-start gap-1">
            <span className="text-5xl font-serif font-extrabold text-[var(--primary)]">{result.total}</span>
            <span className="text-sm font-semibold text-[var(--muted)]">/ 100 {t("sensory.pts")}</span>
          </div>
        </div>
        <div className="rounded-xl bg-[var(--accent)] border border-[var(--border)] px-5 py-3 font-semibold text-white tracking-wide text-sm shadow-md shadow-black/20">
          ✨ {td(result.categoria)}
        </div>
      </div>

      {/* Grelha de Critérios OIV */}
      <div className="space-y-4">
        {Object.entries(SENSORY_OIV).map(([sectionKey, section]) => (
          <div key={sectionKey} className="rounded-2xl glass p-5 border border-[var(--border)]">
            <div className="mb-4 flex items-baseline justify-between border-b border-white/5 pb-2">
              <h3 className="text-sm font-serif font-bold text-[var(--primary)] uppercase tracking-wider">{td(section.label)}</h3>
              <span className="text-xs font-semibold text-[var(--muted)] bg-white/5 px-2 py-0.5 rounded-full">
                {result.seccoes[section.label].obtido} / {section.max_points} {t("sensory.pts")}
              </span>
            </div>
            <div className="space-y-4">
              {section.criteria.map((c) => {
                const key = `${sectionKey}.${c.key}`;
                const v = scores[key] ?? 0;
                return (
                  <div key={key} className="grid grid-cols-1 md:grid-cols-[1fr_200px_60px] items-center gap-4 border-b border-white/[0.02] pb-3 last:border-0 last:pb-0">
                    <div>
                      <label className="text-xs font-semibold text-[var(--foreground)]">{td(c.label)}</label>
                      {typeof c.help === "string" && <p className="text-[10px] text-[var(--muted)] mt-0.5">{td(c.help)}</p>}
                    </div>
                    <div className="flex items-center">
                      <input
                        type="range"
                        aria-label={td(c.label)}
                        aria-valuetext={`${v} / ${c.max}`}
                        min={0}
                        max={c.max}
                        step={1}
                        value={v}
                        onChange={(e) => setScore(key, Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--secondary)] focus:outline-none"
                      />
                    </div>
                    <span className="text-right font-mono text-xs font-bold text-[var(--secondary)] whitespace-nowrap bg-white/5 py-1 px-2 rounded">
                      {v} / {c.max}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Painel de Defeitos Sensoriais */}
      <div className="rounded-2xl glass p-5 border border-[var(--border)]">
        <h3 className="mb-1 font-serif font-bold text-base text-[var(--primary)]">{t("sensory.defectsTitle")}</h3>
        <p className="mb-4 text-xs text-[var(--muted)]">{t("sensory.defectsHint")}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(DEFECTS).map(([name, info]) => {
            const checked = defeitos.includes(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggleDefeito(name)}
                className={`block text-left cursor-pointer rounded-xl border p-3 transition-all duration-300 ${
                  checked
                    ? "border-[var(--secondary)] bg-[var(--bad-bg)]/80 shadow-md scale-[1.01]"
                    : "border-[var(--border)] bg-transparent hover:bg-white/5 hover:border-white/20"
                }`}
              >
                <span className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                    className="mt-1 h-3.5 w-3.5 accent-[var(--secondary)] pointer-events-none"
                  />
                  <span className="flex-1">
                    <strong className="text-xs font-semibold text-[var(--foreground)] block">{td(name)}</strong>
                    <span className="block text-[10px] text-[var(--muted)] mt-0.5 leading-relaxed">{td(info.descricao)}</span>
                    {checked && (
                      <span className="mt-3.5 pt-2 border-t border-[var(--secondary)]/10 block text-[9px] text-[var(--muted)] leading-relaxed space-y-1">
                        <span className="block">🧪 <strong>{t("sensory.compound")}:</strong> <span className="text-[var(--primary)]">{td(info.compostos)}</span></span>
                        <span className="block">🎯 <strong>{t("sensory.threshold")}:</strong> <span className="text-[var(--primary)]">{td(info["limite_perceção"])}</span></span>
                        <span className="block">🔬 <strong>{t("sensory.lab")}:</strong> <span className="text-[var(--primary)]">{td(info["deteção_laboratorial"])}</span></span>
                      </span>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notas de Prova */}
      <div className="rounded-2xl glass p-5 border border-[var(--border)]">
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] block mb-2">{t("sensory.tastingNotes")}</label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none placeholder-white/20 leading-relaxed"
          placeholder={t("sensory.tastingPlaceholder")}
        />
      </div>
    </div>
  );
}
