/**
 * Modelo consolidado do boletim — consumido pela UI de resultado e pelos
 * geradores de Markdown e PDF, garantindo coerência entre os três.
 */
import { Measurements, RegimeReport, ExportVerdict } from "./validate";
import { OivScore } from "./sensory";
import { MolecularSo2Assessment } from "./chemistry";

export interface SampleMeta {
  amostra: string;
  lote: string;
  data: string;
  responsavel: string;
  observacoes: string;
}

export interface SensoryBlock {
  enabled: boolean;
  tipoVinho: string; // tinto/branco/rosé/espumante — para descritores
  score: OivScore;
  defeitos: string[];
  notas: string;
}

export interface Report {
  meta: SampleMeta;
  tipoLabel: string;
  br: RegimeReport;
  pt: RegimeReport;
  verdict: ExportVerdict;
  measurements: Measurements;
  molecular?: MolecularSo2Assessment;
  doçura?: { tipo: string; classificacao: string; designacoes?: string[] };
  sensory?: SensoryBlock;
  geradoEm: string;
}

export function num(v: number | null | undefined, casas = 4): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  if (!Number.isFinite(v)) return "∞";
  return Number(v.toFixed(casas)).toLocaleString("pt-PT");
}

export function statusEmoji(status: string): string {
  switch (status) {
    case "Conforme":
      return "✅";
    case "Não conforme":
      return "❌";
    case "Sem limite":
      return "▫️";
    default:
      return "⬜";
  }
}
