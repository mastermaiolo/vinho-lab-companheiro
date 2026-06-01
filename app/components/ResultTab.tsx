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
      return "bg-[var(--ok-bg)] text-[var(--ok-fg)]";
    case "Não conforme":
      return "bg-[var(--bad-bg)] text-[var(--bad-fg)]";
    case "Sem limite":
      return "bg-[var(--input)] text-[var(--muted)]";
    default:
      return "bg-[var(--warn-bg)] text-[var(--warn-fg)]";
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
  return (
    <div className="rounded-lg glass p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{flag}</h3>
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${
            r.summary.conforme ? "bg-[var(--ok-bg)] text-[var(--ok-fg)]" : "bg-[var(--bad-bg)] text-[var(--bad-fg)]"
          }`}
        >
          {tStatus(r.summary.overall)}
        </span>
      </div>
      <p className="mb-2 text-xs text-[var(--muted)]">{td(r.categoryLabel)}</p>
      <div className="-mx-1 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[var(--muted)]">
            <tr>
              <th className="py-1 pr-2 font-medium">{t("result.thParam")}</th>
              <th className="py-1 pr-2 font-medium">{t("result.thValue")}</th>
              <th className="py-1 pr-2 font-medium">{t("result.thLimit")}</th>
              <th className="py-1 font-medium">{t("result.thStatus")}</th>
            </tr>
          </thead>
          <tbody>
            {r.results.map((x, i) => (
              <tr key={i} className="border-t border-[var(--border)]">
                <td className="py-1 pr-2">{td(x.parameter)}</td>
                <td className="py-1 pr-2 font-mono">
                  {x.value !== null ? (
                    <>
                      {num(x.value)}
                      {x.uncertainty != null && x.uncertainty > 0 && (
                        <span className="text-[var(--muted)]"> ± {num(x.uncertainty)}</span>
                      )}{" "}
                      {x.legalUnit}
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-1 pr-2">{limitStr(x.min, x.max)}</td>
                <td className="py-1">
                  <span className={`rounded px-1.5 py-0.5 ${statusClasses(x.status)}`}>{tStatus(x.status)}</span>
                  {x.borderline && (
                    <span
                      className="ml-1 rounded bg-[var(--warn-bg)] px-1.5 py-0.5 text-[var(--warn-fg)]"
                      title={t("result.borderlineTitle", {
                        unc: num(x.uncertainty ?? 0),
                        unit: x.legalUnit,
                        kind: x.uncertaintyKind === "R" ? t("result.kindR") : t("result.kindr"),
                      })}
                    >
                      {t("result.borderline")}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {r.regulatoryBasis.length > 0 && (
        <p className="mt-2 border-t border-[var(--border)] pt-2 text-[10px] text-[var(--muted)]">
          <strong>{t("result.legalBasis")}:</strong> {r.regulatoryBasis.join(" · ")}
        </p>
      )}
    </div>
  );
}

function Verdict({ label, ok, blocks }: { label: string; ok: boolean; blocks?: string[] }) {
  const { t } = useI18n();
  return (
    <div
      className={`rounded-lg border p-3 ${
        ok ? "border-[var(--ok-fg)]/30 bg-[var(--ok-bg)]" : "border-[var(--bad-fg)]/30 bg-[var(--bad-bg)]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{ok ? "✅" : "❌"}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {!ok && blocks && blocks.length > 0 && (
        <p className="mt-1 text-xs text-[var(--bad-fg)]">{t("result.blocks")}: {blocks.join("; ")}</p>
      )}
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
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-lg font-semibold">{t("result.exportVerdict")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Verdict label={t("result.vConformeBR")} ok={v.conformeBR} blocks={v.bloqueiosBR} />
          <Verdict label={t("result.vConformePT")} ok={v.conformePT} blocks={v.bloqueiosPT} />
          <Verdict label={t("result.vExportPTBR")} ok={v.exportPTtoBR} blocks={v.bloqueiosBR} />
          <Verdict label={t("result.vExportBRPT")} ok={v.exportBRtoPT} blocks={v.bloqueiosPT} />
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">{t("result.exportNote")}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RegimeCard r={report.br} />
        <RegimeCard r={report.pt} />
      </div>

      <p className="text-xs text-[var(--muted)]">
        <Rich text={t("result.marginNote")} />
      </p>

      {report.molecular && (
        <div className="rounded-lg glass p-4">
          <h3 className="mb-1 font-semibold">{t("result.molecularTitle")}</h3>
          <p className="text-sm">
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
      )}

      {report.sensory?.enabled && (
        <div className="rounded-lg glass p-4">
          <h3 className="mb-1 font-semibold">{t("result.sensoryTitle")}</h3>
          <p className="text-sm">
            {report.sensory.score.total} / 100 — <strong>{td(report.sensory.score.categoria)}</strong>
            {report.sensory.defeitos.length > 0 && (
              <span className="block text-xs text-[var(--bad-fg)]">
                {t("result.defects")}: {report.sensory.defeitos.join("; ")}
              </span>
            )}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => downloadMarkdown(renderMarkdown(report), report.meta.lote || report.meta.amostra)}
          className="rounded-lg bg-[var(--accent)] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          ⬇ {t("result.downloadMd")}
        </button>
        <button
          onClick={handlePdf}
          disabled={busy}
          className="rounded-lg border border-[var(--primary)] px-4 py-2.5 font-medium text-[var(--primary)] transition-colors hover:bg-[var(--accent)] hover:text-white disabled:opacity-50"
        >
          {busy ? t("result.generatingPdf") : `⬇ ${t("result.downloadPdf")}`}
        </button>
      </div>
    </div>
  );
}
