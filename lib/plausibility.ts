/**
 * Verificações de plausibilidade físico-química (sanity checks).
 *
 * ATENÇÃO — ESTES VALORES NÃO SÃO LIMITES LEGAIS. São faixas físico-químicas
 * típicas de vinhos correntes, usadas apenas para apanhar erros grosseiros de
 * digitação ou de unidade (ex.: pH 35 em vez de 3,5; acidez volátil 60 g/L em
 * vez de meq/L). Um aviso aqui NÃO significa não-conformidade — a conformidade
 * legal é decidida exclusivamente em validate.ts contra os limites dos JSON.
 *
 * As faixas são deliberadamente largas (cobrem vinhos fortificados, espumantes,
 * vinhos de sobrematuração). Servem só para sinalizar valores fisicamente
 * improváveis que quase de certeza são um engano de leitura.
 */
import { convert } from "./canonical";

export interface PlausibleRange {
  /** Mínimo físico típico (na unidade indicada). */
  min: number;
  /** Máximo físico típico (na unidade indicada). */
  max: number;
  /** Unidade em que a faixa é expressa (= unidade base canónica do parâmetro). */
  unit: string;
}

/** Faixas típicas por parâmetro canónico (NÃO são limites legais). */
const RANGES: Record<string, PlausibleRange> = {
  tav_adquirido: { min: 0, max: 22, unit: "% vol" },
  tav_total: { min: 0, max: 24, unit: "% vol" },
  acidez_total: { min: 1, max: 15, unit: "g/L (tartárico)" },
  acidez_volatil: { min: 0, max: 2.5, unit: "g/L (acético)" },
  acucar: { min: 0, max: 600, unit: "g/L" },
  so2_total: { min: 0, max: 500, unit: "mg/L" },
  so2_livre: { min: 0, max: 150, unit: "mg/L" },
  ph: { min: 2.5, max: 4.5, unit: "—" },
  sobrepressao_co2: { min: 0, max: 12, unit: "bar" },
  metanol: { min: 0, max: 600, unit: "mg/L" },
  cobre: { min: 0, max: 15, unit: "mg/L" },
  chumbo: { min: 0, max: 5, unit: "mg/L" },
  cadmio: { min: 0, max: 2, unit: "mg/L" },
  arsenio: { min: 0, max: 5, unit: "mg/L" },
  ferro: { min: 0, max: 50, unit: "mg/L" },
  ocratoxina: { min: 0, max: 50, unit: "µg/kg" },
  sulfatos: { min: 0, max: 6, unit: "g/L" },
  cloretos: { min: 0, max: 6, unit: "g/L" },
  cinzas: { min: 0, max: 12, unit: "g/L" },
  extrato_seco_reduzido: { min: 5, max: 80, unit: "g/L" },
  relacao_alcool_extrato: { min: 0, max: 12, unit: "—" },
};

/**
 * Avalia se um valor (na sua unidade de entrada) cai fora da faixa físico-química
 * típica. Devolve uma mensagem de aviso (PT-PT) ou null se estiver plausível.
 */
export function checkPlausibility(
  canonicalId: string,
  value: number | null,
  inputUnit: string,
): string | null {
  if (value === null || !Number.isFinite(value)) return null;
  const range = RANGES[canonicalId];
  if (!range) {
    // Sem faixa definida: só apanha negativos óbvios.
    return value < 0 ? "Valor negativo — verifique a leitura." : null;
  }
  // Converte para a unidade da faixa (pode lançar se a unidade for desconhecida).
  let v = value;
  if (inputUnit !== range.unit) {
    try {
      v = convert(value, inputUnit, range.unit);
    } catch {
      v = value; // unidades não conversíveis (ex.: "—"): compara em bruto
    }
  }
  if (v < range.min || v > range.max) {
    return (
      `Valor fora da faixa físico-química típica (${range.min}–${range.max} ${range.unit}). ` +
      "Confirme a leitura e a unidade — não é uma regra legal."
    );
  }
  return null;
}

/**
 * Avisos para as leituras brutas de uma calculadora (volume, concentração,
 * volume de amostra). Apanha o caso em que o volume de amostra é zero (que de
 * outro modo devolveria "—" silenciosamente) e valores negativos.
 */
export function checkCalcInputs(inputs: Record<string, number | null>): string[] {
  const out: string[] = [];
  const vam = inputs.Vam;
  if (vam !== null && vam !== undefined && vam <= 0) {
    out.push("O volume de amostra tem de ser maior que zero — o resultado não pode ser calculado.");
  }
  for (const [key, val] of Object.entries(inputs)) {
    if (val !== null && val !== undefined && Number.isFinite(val) && val < 0) {
      out.push(`Leitura negativa em "${key}" — verifique o valor introduzido.`);
    }
  }
  return out;
}
