/**
 * Validação de conformidade contra cada regime + lógica de exportabilidade.
 * Porta (e estende) modules/validators.py: a comparação usa valores exatos.
 */
import { CategoryDef, legislationOf, Regime } from "./legal";
import {
  CANONICAL,
  convert,
  ETHANOL_WEIGHT_FACTOR,
  PARAM_TO_CANONICAL,
  sugarTierApplies,
} from "./canonical";
import { uncertaintyForCanonical } from "./precision";

export type Status = "Conforme" | "Não conforme" | "Sem limite" | "Não medido";

export interface Measurement {
  value: number | null;
  unit: string;
  /** Leituras brutas, quando o valor foi obtido por calculadora (memória de cálculo). */
  calc?: { method: string; formula: string; inputs: Record<string, number | null> };
}
/** Estado do formulário: canonicalId → medição. */
export type Measurements = Record<string, Measurement>;

export interface ValidationResult {
  parameter: string;
  legalUnit: string;
  /** Valor convertido para a unidade legal (o que é comparado). */
  value: number | null;
  /** Valor tal como introduzido pelo utilizador. */
  inputValue: number | null;
  inputUnit: string | null;
  min: number | null;
  max: number | null;
  status: Status;
  message: string;
  method: string;
  note?: string;
  /** Margem de erro (na unidade legal), da reprodutibilidade/repetibilidade OIV. */
  uncertainty?: number | null;
  /** Tipo de margem usada: "R" (reprodutibilidade) ou "r" (repetibilidade). */
  uncertaintyKind?: "R" | "r";
  /** O valor cai dentro da margem de erro de um limite legal (zona de incerteza). */
  borderline?: boolean;
}

export interface RegimeReport {
  regime: Regime;
  categoryKey: string;
  categoryLabel: string;
  /** Diplomas legais que sustentam os limites (de legislation_*.json). */
  regulatoryBasis: string[];
  results: ValidationResult[];
  summary: {
    Conforme: number;
    "Não conforme": number;
    "Sem limite": number;
    "Não medido": number;
    total: number;
    overall: string;
    conforme: boolean; // sem nenhuma não-conformidade
  };
}

function baseValue(
  m: Measurements,
  id: string,
  targetUnit: string,
): number | null {
  const meas = m[id];
  if (!meas || meas.value === null || Number.isNaN(meas.value)) return null;
  return convert(meas.value, meas.unit, targetUnit);
}

function evaluate(
  paramName: string,
  legalUnit: string,
  value: number | null,
  input: Measurement | null,
  min: number | null,
  max: number | null,
  method: string,
  note?: string,
): ValidationResult {
  const base = {
    parameter: paramName,
    legalUnit,
    value,
    inputValue: input?.value ?? null,
    inputUnit: input?.unit ?? null,
    min,
    max,
    method,
    note,
  };
  if (value === null) {
    return { ...base, status: "Não medido", message: "Parâmetro não medido." };
  }
  if (min !== null && value < min) {
    return {
      ...base,
      status: "Não conforme",
      message: `Valor ${fmt(value)} ${legalUnit} abaixo do mínimo legal (${min} ${legalUnit}).`,
    };
  }
  if (max !== null && value > max) {
    return {
      ...base,
      status: "Não conforme",
      message: `Valor ${fmt(value)} ${legalUnit} acima do máximo legal (${max} ${legalUnit}).`,
    };
  }
  if (min === null && max === null) {
    return { ...base, status: "Sem limite", message: "Parâmetro sem limite legal definido." };
  }
  return { ...base, status: "Conforme", message: "Dentro dos limites legais." };
}

function fmt(v: number): string {
  if (!Number.isFinite(v)) return String(v);
  return Number(v.toFixed(4)).toString();
}

/**
 * A precisão OIV exprime a acidez em "g/L (em ácido acético)" / "g/L (expresso
 * em ácido tartárico)" — um "g/L" sem a etiqueta dimensionada que o conversor
 * usa. Mapeia esse "g/L (...)" para a unidade base canónica do parâmetro (ex.:
 * "g/L (acético)"), para que a conversão para meq/L funcione. Unidades já
 * dimensionadas (mg/L, % vol, "g/L" simples de sulfatos/cinzas) passam intactas.
 */
function resolvePrecisionUnit(figUnit: string, canonicalId: string): string {
  if (/^g\/L/.test(figUnit)) {
    const base = CANONICAL[canonicalId]?.inputUnits?.[0];
    if (base && /^g\/L/.test(base)) return base;
  }
  return figUnit;
}

/** Margem de erro do parâmetro, convertida para a unidade legal (ou null). */
function uncertaintyInUnit(
  canonicalId: string,
  legalUnit: string,
  value: number | null,
): { value: number; kind: "R" | "r" } | null {
  if (value === null || !Number.isFinite(value)) return null;
  const fig = uncertaintyForCanonical(canonicalId);
  if (!fig) return null;
  if (fig.unit === "%") {
    // Margem relativa ao resultado (ex.: r ≤ 5 %).
    return { value: Math.abs(value) * (fig.value / 100), kind: fig.kind };
  }
  try {
    const fromUnit = resolvePrecisionUnit(fig.unit, canonicalId);
    return { value: convert(fig.value, fromUnit, legalUnit), kind: fig.kind };
  } catch {
    return null;
  }
}

/** O valor cai a menos de uma margem de erro de algum limite legal? */
function isBorderline(
  value: number | null,
  min: number | null,
  max: number | null,
  unc: number | null,
): boolean {
  if (value === null || unc === null || unc <= 0) return false;
  if (max !== null && Math.abs(value - max) <= unc) return true;
  if (min !== null && Math.abs(value - min) <= unc) return true;
  return false;
}

export function validateRegime(
  regime: Regime,
  categoryKey: string,
  m: Measurements,
): RegimeReport {
  const leg = legislationOf(regime);
  const cat: CategoryDef = leg.categories[categoryKey];
  const acucar = baseValue(m, "acucar", "g/L");
  const results: ValidationResult[] = [];

  for (const p of cat.parameters) {
    const mapping = PARAM_TO_CANONICAL[p.name];
    const method = p.method ?? p.method_ref ?? "—";

    if (!mapping) {
      results.push(
        evaluate(p.name, p.unit, null, null, p.min, p.max, method, "Parâmetro sem mapeamento — introduza manualmente."),
      );
      continue;
    }

    // Escalões de SO₂ dependentes do açúcar: salta os que não se aplicam.
    if (mapping.sugarTier) {
      if (acucar !== null && !sugarTierApplies(mapping.sugarTier, acucar)) continue;
    }

    const canon = CANONICAL[mapping.canonical];
    let value: number | null;
    let input: Measurement | null = m[mapping.canonical] ?? null;

    if (mapping.canonical === "relacao_alcool_extrato") {
      const tav = baseValue(m, "tav_adquirido", "% vol");
      const esr = baseValue(m, "extrato_seco_reduzido", "g/L");
      value = tav !== null && esr !== null && esr !== 0 ? (tav * ETHANOL_WEIGHT_FACTOR) / esr : null;
      input = value !== null ? { value, unit: "—" } : null;
    } else if (canon?.dimension === "boolean") {
      const meas = m[mapping.canonical];
      value = meas && meas.value !== null ? meas.value : null;
    } else {
      value = baseValue(m, mapping.canonical, mapping.legalUnit);
    }

    let note = p.note;
    if (mapping.sugarTier && acucar === null) {
      note = [note, "Escalão depende do açúcar residual (não medido)."].filter(Boolean).join(" ");
    }

    const res = evaluate(p.name, p.unit, value, input, p.min, p.max, method, note);
    if (canon?.dimension !== "boolean" && mapping.canonical !== "relacao_alcool_extrato") {
      const unc = uncertaintyInUnit(mapping.canonical, mapping.legalUnit, res.value);
      if (unc) {
        res.uncertainty = unc.value;
        res.uncertaintyKind = unc.kind;
        res.borderline = isBorderline(res.value, p.min, p.max, unc.value);
      }
    }
    results.push(res);
  }

  const summary = summarize(results);
  return {
    regime,
    categoryKey,
    categoryLabel: cat.label,
    regulatoryBasis: leg.regulatory_basis ?? [],
    results,
    summary,
  };
}

export function summarize(results: ValidationResult[]) {
  const s = {
    Conforme: 0,
    "Não conforme": 0,
    "Sem limite": 0,
    "Não medido": 0,
    total: results.length,
    overall: "Conforme",
    conforme: true,
  };
  for (const r of results) s[r.status] += 1;
  s.conforme = s["Não conforme"] === 0;
  s.overall = s["Não conforme"] > 0
    ? "Não conforme"
    : s["Não medido"] > 0
      ? "Conforme (com parâmetros não medidos)"
      : "Conforme";
  return s;
}

export interface ExportVerdict {
  /** Conforme como vinho do regime de origem. */
  conformeBR: boolean;
  conformePT: boolean;
  /** Vinho português pode entrar no Brasil (cumpre limites BR). */
  exportPTtoBR: boolean;
  /** Vinho brasileiro pode entrar na UE (cumpre limites UE). */
  exportBRtoPT: boolean;
  bloqueiosBR: string[]; // parâmetros não conformes no regime BR
  bloqueiosPT: string[];
}

export function exportVerdict(br: RegimeReport, pt: RegimeReport): ExportVerdict {
  const blocks = (r: RegimeReport) =>
    r.results.filter((x) => x.status === "Não conforme").map((x) => x.parameter);
  return {
    conformeBR: br.summary.conforme,
    conformePT: pt.summary.conforme,
    exportPTtoBR: br.summary.conforme,
    exportBRtoPT: pt.summary.conforme,
    bloqueiosBR: blocks(br),
    bloqueiosPT: blocks(pt),
  };
}
