"use client";
import { useState } from "react";
import { Report, num } from "@/lib/report";
import { RegimeReport } from "@/lib/validate";
import { renderMarkdown } from "@/lib/markdown";
import { downloadMarkdown } from "@/lib/download";
import { downloadPdf } from "@/lib/pdf";
import { useI18n, Rich } from "./I18nProvider";

function statusClasses(status: string): string {
  switch (status) {
    case "Conforme":
      return "bg-[var(--ok-bg)] text-[var(--ok-fg)] border border-[var(--ok-fg)]/20";
    case "Não conforme":
      return "bg-[var(--bad-bg)] text-[var(--bad-fg)] border border-[var(--bad-fg)]/20";
    case "Sem limite":
      return "bg-white/5 text-[var(--muted)] border border-transparent";
    default:
      return "bg-[var(--warn-bg)] text-[var(--warn-fg)] border border-[var(--warn-fg)]/20";
  }
}

function limitStr(min: number | null, max: number | null): string {
  if (min !== null && max !== null) return `${min} – ${max}`;
  if (min !== null) return `≥ ${min}`;
  if (max !== null) return `≤ ${max}`;
  return "—";
}

function RegimeCard({ r }: { r: RegimeReport }) {
  const { t, tStatus, td } = useI18n();
  const flag = r.regime === "BR" ? "🇧🇷 Brasil (MAPA)" : "🇵🇹🇪🇺 Portugal / UE (IVV)";
  const conforme = r.summary.conforme;
  return (
    <div className="rounded-2xl glass p-5 border border-[var(--border)] flex flex-col justify-between">
      <div>
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
          <h3 className="font-serif text-lg font-bold text-[var(--primary)]">{flag}</h3>
          <span
            className={`rounded-full px-3 py-0.5 text-xs font-bold ${
              conforme ? "bg-[var(--ok-bg)] text-[var(--ok-fg)] border border-[var(--ok-fg)]/20" : "bg-[var(--bad-bg)] text-[var(--bad-fg)] border border-[var(--bad-fg)]/20"
            }`}
          >
            {tStatus(r.summary.overall)}
          </span>
        </div>
        <p className="mb-4 text-xs font-medium text-[var(--muted)] italic">{td(r.categoryLabel)}</p>
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)] text-[10px] uppercase tracking-wider font-semibold">
                <th className="py-2 pr-3 font-semibold">{t("result.thParam")}</th>
                <th className="py-2 pr-3 font-semibold text-right">{t("result.thValue")}</th>
                <th className="py-2 pr-3 font-semibold">{t("result.thLimit")}</th>
                <th className="py-2 font-semibold text-center">{t("result.thStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {r.results.map((x, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 pr-3 font-medium text-[var(--foreground)]">{td(x.parameter)}</td>
                  <td className="py-2.5 pr-3 text-right font-mono font-medium text-[var(--primary)] whitespace-nowrap">
                    {x.value !== null ? (
                      <>
                        {num(x.value)}
                        {x.uncertainty != null && x.uncertainty > 0 && (
                          <span className="text-[var(--muted)] text-[10px]"> ± {num(x.uncertainty)}</span>
                        )}{" "}
                        <span className="text-xs text-[var(--muted)]">{x.legalUnit}</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-[var(--muted)] whitespace-nowrap">{limitStr(x.min, x.max)}</td>
                  <td className="py-2.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClasses(x.status)}`}>
                        {tStatus(x.status)}
                      </span>
                      {x.borderline && (
                        <span
                          className="rounded-full bg-[var(--warn-bg)] border border-[var(--warn-fg)]/25 px-2 py-0.5 text-[9px] font-bold text-[var(--warn-fg)] cursor-help select-none"
                          title={t("result.borderlineTitle", {
                            unc: num(x.uncertainty ?? 0),
                            unit: x.legalUnit,
                            kind: x.uncertaintyKind === "R" ? t("result.kindR") : t("result.kindr"),
                          })}
                        >
                          ⚠️ {t("result.borderline")}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {r.regulatoryBasis.length > 0 && (
        <div className="mt-4 border-t border-[var(--border)] pt-3 text-[10px] text-[var(--muted)] leading-relaxed">
          <strong>{t("result.legalBasis")}:</strong> {r.regulatoryBasis.join(" · ")}
        </div>
      )}
    </div>
  );
}

function Verdict({ label, ok, blocks }: { label: string; ok: boolean; blocks?: string[] }) {
  const { t } = useI18n();
  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
        ok
          ? "border-[var(--ok-fg)]/20 bg-[var(--ok-bg)] shadow-[0_4px_20px_rgba(26,94,43,0.1)] hover:scale-[1.01]"
          : "border-[var(--bad-fg)]/20 bg-[var(--bad-bg)] shadow-[0_4px_20px_rgba(142,21,33,0.1)] hover:scale-[1.01]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5 select-none">{ok ? "🟢" : "🔴"}</span>
        <div>
          <h4 className="text-sm font-semibold text-[var(--foreground)] leading-snug">{label}</h4>
          {!ok && blocks && blocks.length > 0 && (
            <p className="mt-2 text-xs text-[var(--bad-fg)] font-medium leading-relaxed">
              <strong>{t("result.blocks")}:</strong> {blocks.join("; ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResultTab({ report }: { report: Report }) {
  const { t, td } = useI18n();
  const [busy, setBusy] = useState(false);
  const v = report.verdict;

  const handlePdf = async () => {
    setBusy(true);
    try {
      await downloadPdf(report);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      alert(t("result.pdfError", { msg }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
      <div>
        <h2 className="mb-4 text-xl font-serif font-bold text-[var(--primary)]">{t("result.exportVerdict")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Verdict label={t("result.vConformeBR")} ok={v.conformeBR} blocks={v.bloqueiosBR} />
          <Verdict label={t("result.vConformePT")} ok={v.conformePT} blocks={v.bloqueiosPT} />
          <Verdict label={t("result.vExportPTBR")} ok={v.exportPTtoBR} blocks={v.bloqueiosBR} />
          <Verdict label={t("result.vExportBRPT")} ok={v.exportBRtoPT} blocks={v.bloqueiosPT} />
        </div>
        <p className="mt-3 text-xs text-[var(--muted)] leading-relaxed italic">{t("result.exportNote")}</p>

        <div className="mt-4 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => downloadMarkdown(renderMarkdown(report), report.meta.lote || report.meta.amostra)}
            className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-all shadow-[0_4px_16px_rgba(139,28,43,0.3)] hover:bg-[var(--accent-hover)] hover:scale-[1.01] cursor-pointer flex items-center gap-2"
          >
            <span>⬇</span> {t("result.downloadMd")}
          </button>
          <button
            type="button"
            onClick={handlePdf}
            disabled={busy}
            className="rounded-xl border border-[var(--secondary)] text-[var(--secondary)] px-5 py-3 font-semibold transition-all hover:bg-[var(--accent)] hover:text-white hover:border-transparent hover:scale-[1.01] cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {busy ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                <span>{t("result.generatingPdf")}</span>
              </>
            ) : (
              <>
                <span>⬇</span>
                <span>{t("result.downloadPdf")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RegimeCard r={report.br} />
        <RegimeCard r={report.pt} />
      </div>

      <p className="text-xs text-[var(--muted)] leading-relaxed border-l-2 border-[var(--border)] pl-3 italic">
        <Rich text={t("result.marginNote")} />
      </p>

      {(report.molecular || (report.sensory && report.sensory.enabled)) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {report.molecular && (
            <div className="rounded-2xl glass p-5 border border-[var(--border)] flex flex-col justify-between">
              <div>
                <h3 className="mb-2 font-serif font-bold text-sm text-[var(--primary)] uppercase tracking-wider">{t("result.molecularTitle")}</h3>
                <p className="text-sm text-[var(--foreground)] leading-relaxed">
                  <Rich
                    text={t("result.molecularLine", {
                      v: num(report.molecular.so2Molecular, 4),
                      estado: td(report.molecular.estado),
                      frac: num(report.molecular.fracaoMolecularPct, 3),
                      ph: num(report.molecular.ph, 2),
                    })}
                  />
                </p>
              </div>
            </div>
          )}

          {report.sensory?.enabled && (
            <div className="rounded-2xl glass p-5 border border-[var(--border)] flex flex-col justify-between">
              <div>
                <h3 className="mb-2 font-serif font-bold text-sm text-[var(--primary)] uppercase tracking-wider">{t("result.sensoryTitle")}</h3>
                <p className="text-sm text-[var(--foreground)] leading-relaxed">
                  Pontuação total: <strong className="text-[var(--secondary)]">{report.sensory.score.total} / 100</strong> — Categoria: <strong className="text-[var(--primary)]">{td(report.sensory.score.categoria)}</strong>
                  {report.sensory.defeitos.length > 0 && (
                    <span className="block mt-2 text-xs text-[var(--bad-fg)] font-semibold">
                      ⚠️ {t("result.defects")}: {report.sensory.defeitos.map(d => td(d)).join("; ")}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
