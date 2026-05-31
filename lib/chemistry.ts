/**
 * Cálculos enológicos auxiliares — porta de data/chemistry.py.
 * Sem arredondamento nos valores devolvidos; a formatação faz-se na UI.
 */
import { CHEMISTRY } from "./legal";

const PKA1 = CHEMISTRY.PKA1_SULFUROUS;

/** Fração (0-1) de SO₂ livre na forma molecular ativa, em função do pH. */
export function molecularSo2Fraction(ph: number): number {
  return 1.0 / (1.0 + Math.pow(10, ph - PKA1));
}

export function molecularSo2(freeSo2: number, ph: number): number {
  return freeSo2 * molecularSo2Fraction(ph);
}

export function freeSo2Needed(targetMolecular: number, ph: number): number {
  const frac = molecularSo2Fraction(ph);
  return frac === 0 ? Infinity : targetMolecular / frac;
}

export interface MolecularSo2Assessment {
  freeSo2: number;
  ph: number;
  fracaoMolecular: number;
  fracaoMolecularPct: number;
  so2Molecular: number;
  estado: string;
  so2LivreRecomendado: Record<string, number>;
}

export function assessMolecularSo2(
  freeSo2: number,
  ph: number,
): MolecularSo2Assessment {
  const mol = molecularSo2(freeSo2, ph);
  const frac = molecularSo2Fraction(ph);
  const targets = CHEMISTRY.MOLECULAR_SO2_TARGETS;

  let estado: string;
  if (mol >= targets["Proteção robusta (doces / guarda)"]) estado = "Proteção robusta";
  else if (mol >= targets["Controlo de Brettanomyces"]) estado = "Adequado (controla Brettanomyces)";
  else if (mol >= targets["Proteção mínima"]) estado = "Proteção mínima";
  else estado = "Insuficiente";

  const recomendado: Record<string, number> = {};
  for (const [nome, alvo] of Object.entries(targets)) {
    recomendado[nome] = freeSo2Needed(alvo, ph);
  }

  return {
    freeSo2,
    ph,
    fracaoMolecular: frac,
    fracaoMolecularPct: frac * 100,
    so2Molecular: mol,
    estado,
    so2LivreRecomendado: recomendado,
  };
}

export interface SparklingSweetness {
  residualSugar: number;
  designacaoPrincipal: string;
  designacoesPermitidas: string[];
}

/** Classifica espumante pela doçura (g/L), com tolerância de ±3 g/L. */
export function classifySparklingSweetness(rs: number): SparklingSweetness {
  const bands = CHEMISTRY.SPARKLING_SWEETNESS;
  const permitidas: string[] = [];
  for (const b of bands) {
    const lo = b.min;
    const hi = b.max === null ? Infinity : b.max;
    if (lo <= rs && rs <= hi + 3.0) permitidas.push(b.pt);
  }
  let principal: string | null = null;
  for (const b of bands) {
    const lo = b.min;
    const hi = b.max === null ? Infinity : b.max;
    if (lo <= rs && rs <= hi) {
      principal = b.pt;
      break;
    }
  }
  return {
    residualSugar: rs,
    designacaoPrincipal: principal ?? (permitidas.length ? permitidas[permitidas.length - 1] : "—"),
    designacoesPermitidas: permitidas,
  };
}

/** Classifica Vinho do Porto pela doçura (g/L), segundo o IVDP. */
export function classifyPortSweetness(rs: number): string {
  const bands = CHEMISTRY.PORT_SWEETNESS;
  for (const b of bands) {
    const lo = b.min;
    const hi = b.max === null ? Infinity : b.max;
    if (lo <= rs && rs <= hi) return b.pt;
  }
  if (rs < bands[0].min) return `Abaixo de Extra-Seco (< ${bands[0].min} g/L)`;
  return "Muito Doce (Lágrima)";
}
