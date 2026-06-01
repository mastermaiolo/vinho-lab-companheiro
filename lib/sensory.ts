/**
 * Análise sensorial OIV (100 pontos) — porta de data/sensory.py.
 */
import sensoryJson from "@/data/legal/sensory.json";
import defectsJson from "@/data/legal/defects.json";

export interface OivCriterion {
  key: string;
  label: string;
  max: number;
  scale?: Record<string, number>;
  [k: string]: unknown;
}
export interface OivSection {
  label: string;
  max_points: number;
  criteria: OivCriterion[];
  [k: string]: unknown;
}

export const SENSORY_OIV = sensoryJson as unknown as Record<string, OivSection>;

export interface DefectInfo {
  compostos: string;
  "limite_perceção": string;
  descricao: string;
  origem: string;
  "deteção_laboratorial": string;
}
export const DEFECTS = defectsJson as unknown as Record<string, DefectInfo>;

export interface OivScore {
  total: number;
  maximo: number;
  categoria: string;
  seccoes: Record<string, { obtido: number; maximo: number }>;
  detalhe: Record<string, Record<string, { obtido: number; maximo: number }>>;
}

/** scores: { "visual.limpidez": 4, ... } */
export function computeOivScore(scores: Record<string, number>): OivScore {
  const seccoes: OivScore["seccoes"] = {};
  const detalhe: OivScore["detalhe"] = {};

  for (const [sectionKey, section] of Object.entries(SENSORY_OIV)) {
    let total = 0;
    const sectionDetail: Record<string, { obtido: number; maximo: number }> = {};
    for (const c of section.criteria) {
      const k = `${sectionKey}.${c.key}`;
      let v = scores[k] ?? 0;
      // Limita a [0, c.max]: protege contra sessões importadas com valores
      // negativos ou acima do máximo (os sliders já têm min=0, mas o JSON não).
      v = Math.max(0, Math.min(v, c.max));
      total += v;
      sectionDetail[c.label] = { obtido: v, maximo: c.max };
    }
    seccoes[section.label] = { obtido: total, maximo: section.max_points };
    detalhe[section.label] = sectionDetail;
  }

  const grandTotal = Object.values(seccoes).reduce((a, s) => a + s.obtido, 0);

  let categoria: string;
  if (grandTotal >= 92) categoria = "Grande Medalha de Ouro";
  else if (grandTotal >= 85) categoria = "Medalha de Ouro";
  else if (grandTotal >= 82) categoria = "Medalha de Prata";
  else if (grandTotal >= 78) categoria = "Medalha de Bronze";
  else categoria = "Sem distinção";

  return { total: grandTotal, maximo: 100, categoria, seccoes, detalhe };
}
