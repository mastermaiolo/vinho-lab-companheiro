/**
 * Margens de erro analítico (incerteza de medição).
 *
 * NÃO se inventam valores: a incerteza é extraída do campo `precision` de cada
 * método em data/legal/methods.json (repetibilidade r / reprodutibilidade R do
 * OIV). Preferimos a reprodutibilidade R quando existe (é a margem entre
 * laboratórios); caímos para r quando R não está documentado.
 *
 * Usa-se para sinalizar uma "zona de incerteza" em torno dos limites legais:
 * um resultado a menos de R de um limite não pode ser declarado conforme (ou
 * não conforme) com confiança sem repetição da análise.
 */
import { methodForCanonical } from "./methods";

export interface PrecisionFigure {
  /** "R" (reprodutibilidade) ou "r" (repetibilidade). */
  kind: "R" | "r";
  /** Valor numérico da margem. */
  value: number;
  /** Unidade tal como no método; "%" indica margem relativa ao resultado. */
  unit: string;
  /** Qualificador opcional (ex.: "livre", "total"). */
  qualifier?: string;
}

/** Para parâmetros com vários valores de precisão, qual o qualificador a usar. */
const CANONICAL_QUALIFIER: Record<string, string> = {
  so2_total: "total",
  so2_livre: "livre",
};

// Captura "R ≤ 0,19 % vol", "r ≤ 5 mg/L (livre)", "r ≤ 20%", etc.
const RE = /\b(R|r)\s*≤\s*([\d.,]+)\s*(%(?:\s*vol)?|mg\/L|g\/L(?:\s*\([^)]*\))?|µg\/kg|mg\/kg|bar|atm)?\s*(?:\(([^)]+)\))?/gi;

/** Faz parse de uma string `precision` em zero ou mais figuras r/R. */
export function parsePrecision(precision: string): PrecisionFigure[] {
  const out: PrecisionFigure[] = [];
  if (!precision) return out;
  for (const m of precision.matchAll(RE)) {
    const kind = m[1] === "R" ? "R" : "r";
    const value = Number(m[2].replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(value)) continue;
    const unit = (m[3] ?? "").trim();
    if (!unit) continue; // sem unidade reconhecida (ex.: só LD/LQ) → ignora
    out.push({ kind, value, unit, qualifier: m[4]?.trim() });
  }
  return out;
}

/**
 * Melhor figura de incerteza para um parâmetro canónico, ou null se o método
 * não documentar uma margem utilizável (apenas LD/LQ, ou cálculo derivado).
 */
export function uncertaintyForCanonical(canonicalId: string): PrecisionFigure | null {
  const found = methodForCanonical(canonicalId);
  if (!found) return null;
  const figures = parsePrecision(found.method.precision);
  if (figures.length === 0) return null;

  const wantQualifier = CANONICAL_QUALIFIER[canonicalId];
  const pool = wantQualifier
    ? figures.filter((f) => f.qualifier === wantQualifier)
    : figures;
  const candidates = pool.length > 0 ? pool : figures;

  // Preferir reprodutibilidade (R); só depois repetibilidade (r).
  return candidates.find((f) => f.kind === "R") ?? candidates[0];
}
