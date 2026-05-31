/**
 * Registo canónico de medições e conversão de unidades.
 *
 * O utilizador introduz cada medição UMA vez, na unidade em que a obteve. Para
 * validar contra cada regime (BR e PT/UE), convertemos o valor para a unidade
 * em que esse regime exprime o limite legal.
 *
 * IMPORTANTE — fatores de conversão (química padrão, NÃO são limites legais):
 *  - Acidez total (ácido tartárico): ácido diprótico, massa molar 150,087 g/mol,
 *    massa equivalente 75,044 g/mol → 1 meq/L = 0,075044 g/L. (OIV exprime a
 *    acidez total em g/L de ácido tartárico ou em meq/L; fator ≈ 0,075.)
 *  - Acidez volátil (ácido acético): monoprótico, massa molar 60,052 g/mol →
 *    1 meq/L = 0,060052 g/L. (OIV-MA-AS313-02.)
 *  - Pressão: 1 atm = 1,01325 bar.
 *  - Álcool em peso (para a relação BR álcool/extrato): 1 % vol = 10 mL/L de
 *    etanol; densidade do etanol a 20 °C = 0,78934 g/mL → álcool em peso (g/L)
 *    = TAV(% vol) × 7,8934.
 *
 * Os limites legais vêm SEMPRE dos JSON exportados do Python; aqui só se
 * convertem unidades. Nenhum valor é arredondado nesta camada.
 */

export type Dimension =
  | "alcohol"
  | "acidity_tartaric"
  | "acidity_acetic"
  | "pressure"
  | "mass_mg_l"
  | "mass_g_l"
  | "conc_ug_kg"
  | "ratio"
  | "boolean";

/** Fatores para a unidade base de cada dimensão (valor_base = valor × fator). */
const UNIT_FACTORS: Record<string, { dim: Dimension; toBase: number }> = {
  // alcohol — base: % vol
  "% vol": { dim: "alcohol", toBase: 1 },
  "% vol a 20°C": { dim: "alcohol", toBase: 1 },
  "% v/v a 20°C": { dim: "alcohol", toBase: 1 },
  // acidez total — base: g/L (ácido tartárico)
  "g/L (tartárico)": { dim: "acidity_tartaric", toBase: 1 },
  "meq/L (tartárico)": { dim: "acidity_tartaric", toBase: 0.075044 },
  // acidez volátil — base: g/L (ácido acético)
  "g/L (acético)": { dim: "acidity_acetic", toBase: 1 },
  "meq/L (acético)": { dim: "acidity_acetic", toBase: 0.060052 },
  // pressão — base: bar
  bar: { dim: "pressure", toBase: 1 },
  atm: { dim: "pressure", toBase: 1.01325 },
  // massa/concentração
  "mg/L": { dim: "mass_mg_l", toBase: 1 },
  "g/L": { dim: "mass_g_l", toBase: 1 },
  "µg/kg": { dim: "conc_ug_kg", toBase: 1 },
};

export const ETHANOL_WEIGHT_FACTOR = 7.8934; // g/L por % vol

/** Converte um valor entre unidades da mesma dimensão. Sem arredondamento. */
export function convert(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;
  const f = UNIT_FACTORS[fromUnit];
  const t = UNIT_FACTORS[toUnit];
  if (!f || !t) {
    throw new Error(`Unidade desconhecida: ${fromUnit} → ${toUnit}`);
  }
  if (f.dim !== t.dim) {
    throw new Error(`Dimensões incompatíveis: ${fromUnit} → ${toUnit}`);
  }
  return (value * f.toBase) / t.toBase;
}

export interface CanonicalDef {
  id: string;
  label: string;
  dimension: Dimension;
  /** Unidades oferecidas no formulário (a 1.ª é o default). */
  inputUnits: string[];
  help?: string;
  /** Calculado a partir de outras medições; não tem campo de entrada direto. */
  computed?: boolean;
  /** Medição auxiliar (não validada contra limites; usada em cálculos). */
  auxiliary?: boolean;
}

export const CANONICAL: Record<string, CanonicalDef> = {
  tav_adquirido: {
    id: "tav_adquirido",
    label: "Título alcoométrico adquirido (TAV)",
    dimension: "alcohol",
    inputUnits: ["% vol"],
  },
  tav_total: {
    id: "tav_total",
    label: "Título alcoométrico total",
    dimension: "alcohol",
    inputUnits: ["% vol"],
    help: "Álcool adquirido + potencial dos açúcares por fermentar.",
  },
  acidez_total: {
    id: "acidez_total",
    label: "Acidez total",
    dimension: "acidity_tartaric",
    inputUnits: ["g/L (tartárico)", "meq/L (tartárico)"],
    help: "BR exprime em meq/L; PT/UE em g/L de ácido tartárico. Conversão automática.",
  },
  acidez_volatil: {
    id: "acidez_volatil",
    label: "Acidez volátil",
    dimension: "acidity_acetic",
    inputUnits: ["g/L (acético)", "meq/L (acético)"],
    help: "BR exprime em meq/L; PT/UE em g/L de ácido acético. Conversão automática.",
  },
  acucar: {
    id: "acucar",
    label: "Açúcares totais / residuais",
    dimension: "mass_g_l",
    inputUnits: ["g/L"],
    help: "Usado para escolher o escalão de SO₂ aplicável e classificar a doçura.",
  },
  so2_total: {
    id: "so2_total",
    label: "SO₂ total",
    dimension: "mass_mg_l",
    inputUnits: ["mg/L"],
  },
  so2_livre: {
    id: "so2_livre",
    label: "SO₂ livre",
    dimension: "mass_mg_l",
    inputUnits: ["mg/L"],
    auxiliary: true,
    help: "Não tem limite legal direto, mas é exigido no boletim UE (VI-1) e serve para o SO₂ molecular.",
  },
  ph: {
    id: "ph",
    label: "pH",
    dimension: "ratio",
    inputUnits: ["—"],
    auxiliary: true,
    help: "Usado no cálculo do SO₂ molecular ativo.",
  },
  sobrepressao_co2: {
    id: "sobrepressao_co2",
    label: "Sobrepressão / Pressão de CO₂",
    dimension: "pressure",
    inputUnits: ["bar", "atm"],
    help: "BR exprime em atm; PT/UE em bar. Conversão automática.",
  },
  metanol: {
    id: "metanol",
    label: "Metanol",
    dimension: "mass_mg_l",
    inputUnits: ["mg/L"],
  },
  cobre: {
    id: "cobre",
    label: "Cobre",
    dimension: "mass_mg_l",
    inputUnits: ["mg/L"],
  },
  chumbo: {
    id: "chumbo",
    label: "Chumbo",
    dimension: "mass_mg_l",
    inputUnits: ["mg/L"],
  },
  cadmio: {
    id: "cadmio",
    label: "Cádmio",
    dimension: "mass_mg_l",
    inputUnits: ["mg/L"],
  },
  arsenio: {
    id: "arsenio",
    label: "Arsénio",
    dimension: "mass_mg_l",
    inputUnits: ["mg/L"],
  },
  ferro: {
    id: "ferro",
    label: "Ferro",
    dimension: "mass_mg_l",
    inputUnits: ["mg/L"],
  },
  ocratoxina: {
    id: "ocratoxina",
    label: "Ocratoxina A",
    dimension: "conc_ug_kg",
    inputUnits: ["µg/kg"],
  },
  sulfatos: {
    id: "sulfatos",
    label: "Sulfatos totais (em K₂SO₄)",
    dimension: "mass_g_l",
    inputUnits: ["g/L"],
  },
  cloretos: {
    id: "cloretos",
    label: "Cloretos (em NaCl)",
    dimension: "mass_g_l",
    inputUnits: ["g/L"],
  },
  cinzas: {
    id: "cinzas",
    label: "Cinzas",
    dimension: "mass_g_l",
    inputUnits: ["g/L"],
  },
  extrato_seco_reduzido: {
    id: "extrato_seco_reduzido",
    label: "Extrato seco reduzido",
    dimension: "mass_g_l",
    inputUnits: ["g/L"],
  },
  relacao_alcool_extrato: {
    id: "relacao_alcool_extrato",
    label: "Relação álcool em peso / extrato seco reduzido",
    dimension: "ratio",
    inputUnits: ["—"],
    computed: true,
    help: "Calculada: álcool em peso (g/L) ÷ extrato seco reduzido (g/L). Marcador de diluição (BR ≤ 4,8).",
  },
  pesticidas: {
    id: "pesticidas",
    label: "Resíduos de pesticidas sintéticos",
    dimension: "boolean",
    inputUnits: ["ausente/presente"],
    help: "Em vinho orgânico/biológico a ausência é obrigatória.",
  },
};

/**
 * Mapa nome-do-parâmetro-legal → canónico.
 * A chave é o nome EXATO como aparece nos JSON legais.
 * `sugarTier`: para escalões de SO₂ que dependem do açúcar residual.
 */
export interface ParamMapping {
  canonical: string;
  /** Unidade em que ESTE parâmetro legal exprime o limite. */
  legalUnit: string;
  sugarTier?: { threshold: number; op: "lt" | "gte" };
}

export const PARAM_TO_CANONICAL: Record<string, ParamMapping> = {
  // ---- Álcool
  "Título alcoométrico volúmico adquirido": { canonical: "tav_adquirido", legalUnit: "% vol" },
  "Título alcoométrico volúmico total": { canonical: "tav_total", legalUnit: "% vol" },
  "Graduação alcoólica (TAV)": { canonical: "tav_adquirido", legalUnit: "% vol" },
  // ---- Acidez
  "Acidez total (em ácido tartárico)": { canonical: "acidez_total", legalUnit: "g/L (tartárico)" },
  "Acidez total": { canonical: "acidez_total", legalUnit: "meq/L (tartárico)" },
  "Acidez volátil (em ácido acético)": { canonical: "acidez_volatil", legalUnit: "g/L (acético)" },
  "Acidez volátil": { canonical: "acidez_volatil", legalUnit: "meq/L (acético)" },
  // ---- Açúcar
  "Açúcares totais": { canonical: "acucar", legalUnit: "g/L" },
  "Açúcar total (em glucose)": { canonical: "acucar", legalUnit: "g/L" },
  // ---- SO₂ (escalões por açúcar)
  "SO₂ total": { canonical: "so2_total", legalUnit: "mg/L" },
  "SO₂ total (orgânico)": { canonical: "so2_total", legalUnit: "mg/L" },
  "SO₂ total (açúcares < 5 g/L)": { canonical: "so2_total", legalUnit: "mg/L", sugarTier: { threshold: 5, op: "lt" } },
  "SO₂ total (açúcares ≥ 5 g/L)": { canonical: "so2_total", legalUnit: "mg/L", sugarTier: { threshold: 5, op: "gte" } },
  "SO₂ total - tinto bio (açúcares < 2 g/L)": { canonical: "so2_total", legalUnit: "mg/L", sugarTier: { threshold: 2, op: "lt" } },
  "SO₂ total - tinto bio (açúcares ≥ 2 g/L)": { canonical: "so2_total", legalUnit: "mg/L", sugarTier: { threshold: 2, op: "gte" } },
  "SO₂ total - branco/rosé bio (açúcares < 2 g/L)": { canonical: "so2_total", legalUnit: "mg/L", sugarTier: { threshold: 2, op: "lt" } },
  "SO₂ total - branco/rosé bio (açúcares ≥ 2 g/L)": { canonical: "so2_total", legalUnit: "mg/L", sugarTier: { threshold: 2, op: "gte" } },
  // ---- Pressão
  "Sobrepressão de CO₂": { canonical: "sobrepressao_co2", legalUnit: "bar" },
  "Sobrepressão a 20°C": { canonical: "sobrepressao_co2", legalUnit: "bar" },
  "Pressão a 20°C": { canonical: "sobrepressao_co2", legalUnit: "atm" },
  // ---- Outros físico-químicos
  Metanol: { canonical: "metanol", legalUnit: "mg/L" },
  Cobre: { canonical: "cobre", legalUnit: "mg/L" },
  Chumbo: { canonical: "chumbo", legalUnit: "mg/L" },
  "Cádmio": { canonical: "cadmio", legalUnit: "mg/L" },
  "Arsénio": { canonical: "arsenio", legalUnit: "mg/L" },
  Ferro: { canonical: "ferro", legalUnit: "mg/L" },
  "Ocratoxina A": { canonical: "ocratoxina", legalUnit: "µg/kg" },
  "Sulfatos totais (em K₂SO₄)": { canonical: "sulfatos", legalUnit: "g/L" },
  "Cloretos (em NaCl)": { canonical: "cloretos", legalUnit: "g/L" },
  Cinzas: { canonical: "cinzas", legalUnit: "g/L" },
  "Extrato seco reduzido": { canonical: "extrato_seco_reduzido", legalUnit: "g/L" },
  "Relação álcool em peso/extrato seco reduzido": { canonical: "relacao_alcool_extrato", legalUnit: "—" },
  "Resíduos de pesticidas sintéticos": { canonical: "pesticidas", legalUnit: "ausente/presente" },
};

/** O escalão de SO₂ (dependente do açúcar) aplica-se ao valor de açúcar dado? */
export function sugarTierApplies(
  tier: ParamMapping["sugarTier"],
  acucar: number | null,
): boolean {
  if (!tier) return true;
  if (acucar === null || acucar === undefined) return true; // aplica ambos; assinala-se nota
  return tier.op === "lt" ? acucar < tier.threshold : acucar >= tier.threshold;
}
