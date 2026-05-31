/**
 * Acesso tipado aos métodos analíticos OIV (data/legal/methods.json) e
 * mapeamento de cada medição canónica para o respetivo método.
 *
 * Fonte única de verdade: o JSON é gerado pelo projeto Python. Não editar à mão.
 */
import methodsJson from "@/data/legal/methods.json";

export interface OivMethod {
  name: string;
  principle: string;
  equipment: string[];
  reagents: string[];
  procedure: string[];
  calculation: string;
  precision: string;
  regulatory_acceptance: string;
}

const METHODS = methodsJson as unknown as Record<string, OivMethod>;

/** canonical id → código do método em methods.json. */
export const CANONICAL_TO_METHOD: Record<string, string> = {
  tav_adquirido: "OIV-MA-AS312-01A",
  tav_total: "OIV-MA-AS312-01A",
  acucar: "OIV-MA-AS311-01A",
  acidez_total: "OIV-MA-AS313-01",
  acidez_volatil: "OIV-MA-AS313-02",
  so2_total: "OIV-MA-AS323-04B",
  so2_livre: "OIV-MA-AS323-04B",
  sobrepressao_co2: "OIV-MA-AS314-01",
  extrato_seco_reduzido: "OIV-MA-AS2-03B",
  cinzas: "OIV-MA-AS2-04",
  sulfatos: "OIV-MA-AS321-05A",
  cloretos: "OIV-MA-AS321-02",
  metanol: "OIV-MA-AS312-03A",
  relacao_alcool_extrato: "Cálculo",
  cobre: "OIV-MA-AS322-06",
  ferro: "OIV-MA-AS322-05",
  chumbo: "OIV-MA-AS322-12",
  cadmio: "OIV-MA-AS322-07",
  arsenio: "OIV-MA-AS323-01",
  ocratoxina: "OIV-MA-AS315-10",
  pesticidas: "Multirresíduos GC-MS/MS, LC-MS/MS",
  // ph: sem método dedicado em methods.json (potenciometria direta).
};

export function methodByCode(code: string): OivMethod | undefined {
  return METHODS[code];
}

export function methodForCanonical(
  id: string,
): { code: string; method: OivMethod } | undefined {
  const code = CANONICAL_TO_METHOD[id];
  if (!code) return undefined;
  const method = METHODS[code];
  if (!method) return undefined;
  return { code, method };
}
