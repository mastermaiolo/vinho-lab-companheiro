/**
 * Calculadoras "leituras brutas → valor final".
 *
 * Cada calculadora reproduz FIELMENTE a fórmula oficial documentada em
 * data/legal/methods.json (métodos OIV). Não se inventa nenhum coeficiente:
 * os fatores (75 = ½ massa molar tartárico, 60 = massa molar acético, 32 = ½
 * massa molar SO₂, 58,44 = NaCl, 0,7464 = BaSO₄→K₂SO₄) vêm desses métodos.
 *
 * O resultado é expresso na UNIDADE BASE canónica do parâmetro (a 1.ª unidade
 * de entrada do CANONICAL), de modo que a camada de conversão/validação trata
 * o resto. O utilizador introduz o volume gasto diretamente (mL), mais a
 * concentração do titulante e o volume de amostra (pré-preenchidos com os
 * valores do método, mas editáveis).
 */

export interface CalcInputDef {
  key: string;
  label: string;
  default?: number;
  suffix?: string;
}

export interface Calculator {
  /** Código do método OIV (data/legal/methods.json). */
  method: string;
  /** Fórmula legível, para mostrar e imprimir no boletim. */
  formula: string;
  /** Unidade em que o resultado é devolvido (= 1.ª unidade do CANONICAL). */
  outputUnit: string;
  inputs: CalcInputDef[];
  compute: (v: Record<string, number | null>) => number | null;
  note?: string;
}

const num = (x: number | null | undefined): number | null =>
  x === null || x === undefined || Number.isNaN(x) ? null : x;

/** Titulação genérica: resultado = (V × N × fator) / V_amostra. */
function titration(fator: number): Calculator["compute"] {
  return (v) => {
    const V = num(v.V);
    const N = num(v.N);
    const Vam = num(v.Vam);
    if (V === null || N === null || Vam === null || Vam === 0) return null;
    return (V * N * fator) / Vam;
  };
}

const VOL = { key: "V", label: "Volume de titulante gasto", suffix: "mL" };

export const CALCULATORS: Record<string, Calculator> = {
  acidez_total: {
    method: "OIV-MA-AS313-01",
    formula: "(V × N × 75) ÷ V_amostra",
    outputUnit: "g/L (tartárico)",
    inputs: [
      VOL,
      { key: "N", label: "Concentração da NaOH", default: 0.1, suffix: "mol/L" },
      { key: "Vam", label: "Volume de amostra", default: 10, suffix: "mL" },
    ],
    compute: titration(75),
    note: "75 = ½ da massa molar do ácido tartárico. Resultado em g/L de ác. tartárico; a conversão para meq/L (BR) é automática.",
  },
  acidez_volatil: {
    method: "OIV-MA-AS313-02",
    formula: "(V₁×N×60 ÷ Vam) − (0,1×V₂×32 ÷ Vam ×0,001) − (0,05×V₃×32 ÷ Vam ×0,001)",
    outputUnit: "g/L (acético)",
    inputs: [
      { key: "V", label: "V₁ — NaOH na titulação ácida", suffix: "mL" },
      { key: "N", label: "Concentração da NaOH", default: 0.1, suffix: "mol/L" },
      { key: "Vam", label: "Volume de amostra", default: 20, suffix: "mL" },
      { key: "V2", label: "V₂ — iodo (SO₂ livre) · opcional", suffix: "mL" },
      { key: "V3", label: "V₃ — iodo (SO₂ combinado) · opcional", suffix: "mL" },
    ],
    compute: (v) => {
      const V1 = num(v.V);
      const N = num(v.N);
      const Vam = num(v.Vam);
      if (V1 === null || N === null || Vam === null || Vam === 0) return null;
      // Termo principal (ác. acético). Com N=0,1 e Vam=20 → V₁×0,30.
      const base = (V1 * N * 60) / Vam;
      // Correção do SO₂ destilado (OIV-MA-AS313-02), verbatim do methods.json.
      // V₂/V₃ opcionais: se vazios, devolve o valor sem correção (vinhos secos).
      const V2 = num(v.V2);
      const V3 = num(v.V3);
      const corrLivre = V2 !== null ? ((0.1 * V2 * 32) / Vam) * 0.001 : 0;
      const corrComb = V3 !== null ? ((0.05 * V3 * 32) / Vam) * 0.001 : 0;
      return base - corrLivre - corrComb;
    },
    note: "60 = massa molar do ác. acético; 32 = ½ M(SO₂). Preencha V₂ (SO₂ livre) e V₃ (SO₂ combinado) para a correção OIV completa; se vazios, devolve a acidez volátil bruta (válida para vinhos secos sem SO₂).",
  },
  so2_total: {
    method: "OIV-MA-AS323-04B",
    formula: "(V × N × 32 × 1000) ÷ V_amostra",
    outputUnit: "mg/L",
    inputs: [
      VOL,
      { key: "N", label: "Concentração da NaOH", default: 0.01, suffix: "mol/L" },
      { key: "Vam", label: "Volume de amostra", default: 20, suffix: "mL" },
    ],
    compute: titration(32 * 1000),
    note: "32 = ½ da massa molar do SO₂. Método de Paul (aspiração-titulação).",
  },
  so2_livre: {
    method: "OIV-MA-AS323-04B",
    formula: "(V × N × 32 × 1000) ÷ V_amostra",
    outputUnit: "mg/L",
    inputs: [
      VOL,
      { key: "N", label: "Concentração da NaOH", default: 0.01, suffix: "mol/L" },
      { key: "Vam", label: "Volume de amostra", default: 20, suffix: "mL" },
    ],
    compute: titration(32 * 1000),
    note: "32 = ½ da massa molar do SO₂. Aspiração a frio (fração livre).",
  },
  cloretos: {
    method: "OIV-MA-AS321-02",
    formula: "(V × N × 58,44) ÷ V_amostra",
    outputUnit: "g/L",
    inputs: [
      { key: "V", label: "Volume de AgNO₃ gasto", suffix: "mL" },
      { key: "N", label: "Concentração da AgNO₃", default: 0.1, suffix: "mol/L" },
      { key: "Vam", label: "Volume de amostra", default: 10, suffix: "mL" },
    ],
    compute: titration(58.44),
    note: "58,44 = massa molar do NaCl. Titulação potenciométrica (Mohr modificado).",
  },
  cinzas: {
    method: "OIV-MA-AS2-04",
    formula: "(m_cinzas ÷ V_amostra) × 1000",
    outputUnit: "g/L",
    inputs: [
      { key: "m", label: "Massa de cinzas", suffix: "g" },
      { key: "Vam", label: "Volume de amostra", default: 20, suffix: "mL" },
    ],
    compute: (v) => {
      const m = num(v.m);
      const Vam = num(v.Vam);
      if (m === null || Vam === null || Vam === 0) return null;
      return (m / Vam) * 1000;
    },
    note: "Incineração. Com 20 mL de amostra, cinzas (g/L) = m × 50.",
  },
  sulfatos: {
    method: "OIV-MA-AS321-05A",
    formula: "(m_BaSO₄ × 0,7464 ÷ V_amostra) × 1000",
    outputUnit: "g/L",
    inputs: [
      { key: "m", label: "Massa de BaSO₄", suffix: "g" },
      { key: "Vam", label: "Volume de amostra", default: 100, suffix: "mL" },
    ],
    compute: (v) => {
      const m = num(v.m);
      const Vam = num(v.Vam);
      if (m === null || Vam === null || Vam === 0) return null;
      return ((m * 0.7464) / Vam) * 1000;
    },
    note: "Gravimetria. 0,7464 = fator de conversão BaSO₄ → K₂SO₄.",
  },
  // Instrumentais: leitura do aparelho × fator de diluição.
  metanol: instrumental("OIV-MA-AS312-03A", "mg/L"),
  cobre: instrumental("OIV-MA-AS322-06", "mg/L"),
  chumbo: instrumental("OIV-MA-AS322-12", "mg/L"),
  ferro: instrumental("OIV-MA-AS322-05", "mg/L"),
  cadmio: instrumental("OIV-MA-AS322-07", "mg/L"),
  arsenio: instrumental("OIV-MA-AS323-01", "mg/L"),
  ocratoxina: instrumental("OIV-MA-AS315-10", "µg/kg"),
};

function instrumental(method: string, outputUnit: string): Calculator {
  return {
    method,
    formula: "leitura × fator de diluição",
    outputUnit,
    inputs: [
      { key: "leitura", label: "Leitura do aparelho", suffix: outputUnit },
      { key: "fator", label: "Fator de diluição", default: 1 },
    ],
    compute: (v) => {
      const l = num(v.leitura);
      const f = num(v.fator);
      if (l === null || f === null) return null;
      return l * f;
    },
    note: "Leitura instrumental corrigida pela diluição da amostra.",
  };
}

export function calculatorFor(canonicalId: string): Calculator | undefined {
  return CALCULATORS[canonicalId];
}
