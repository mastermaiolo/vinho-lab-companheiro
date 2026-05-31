/**
 * Tradução do conteúdo de DOMÍNIO (não-interface): nomes de parâmetros, ajudas,
 * etiquetas das calculadoras, categorias de vinho, critérios sensoriais,
 * defeitos, medalhas OIV e estados do SO₂ molecular — bem como o conteúdo dos
 * métodos OIV (importado de i18n-methods.ts).
 *
 * PRINCÍPIO: o português continua a ser a FONTE DE VERDADE. As traduções são
 * uma sobreposição aplicada APENAS no momento de renderizar. NUNCA se traduzem
 * valores legais, limites numéricos nem fórmulas — apenas texto descritivo.
 *
 * A chave de cada entrada é a string PT EXATA tal como aparece nos dados; se não
 * houver entrada (ou tradução para o idioma pedido), devolve-se o PT original.
 */
import { Locale, DEFAULT_LOCALE } from "./i18n";
import { METHOD_DOMAIN } from "./i18n-methods";

export interface DomainTr {
  en: string;
  es: string;
  zh: string;
}

const BASE: Record<string, DomainTr> = {
  // ───────────────────────── Parâmetros (lib/canonical.ts) ─────────────────
  "Título alcoométrico adquirido (TAV)": {
    en: "Actual alcoholic strength (ABV)",
    es: "Grado alcohólico adquirido (TAV)",
    zh: "实测酒精度（TAV）",
  },
  "Título alcoométrico total": {
    en: "Total alcoholic strength",
    es: "Grado alcohólico total",
    zh: "总酒精度",
  },
  "Acidez total": { en: "Total acidity", es: "Acidez total", zh: "总酸" },
  "pH": { en: "pH", es: "pH", zh: "pH 值" },
  "Acidez volátil": { en: "Volatile acidity", es: "Acidez volátil", zh: "挥发酸" },
  "Açúcares totais / residuais": {
    en: "Total / residual sugars",
    es: "Azúcares totales / residuales",
    zh: "总糖 / 残糖",
  },
  "SO₂ total": { en: "Total SO₂", es: "SO₂ total", zh: "总 SO₂" },
  "SO₂ livre": { en: "Free SO₂", es: "SO₂ libre", zh: "游离 SO₂" },
  "Sobrepressão / Pressão de CO₂": {
    en: "Overpressure / CO₂ pressure",
    es: "Sobrepresión / Presión de CO₂",
    zh: "CO₂ 超压 / 压力",
  },
  Metanol: { en: "Methanol", es: "Metanol", zh: "甲醇" },
  Cobre: { en: "Copper", es: "Cobre", zh: "铜" },
  Chumbo: { en: "Lead", es: "Plomo", zh: "铅" },
  "Cádmio": { en: "Cadmium", es: "Cadmio", zh: "镉" },
  "Arsénio": { en: "Arsenic", es: "Arsénico", zh: "砷" },
  Ferro: { en: "Iron", es: "Hierro", zh: "铁" },
  "Ocratoxina A": { en: "Ochratoxin A", es: "Ocratoxina A", zh: "赭曲霉毒素 A" },
  "Sulfatos totais (em K₂SO₄)": {
    en: "Total sulfates (as K₂SO₄)",
    es: "Sulfatos totales (en K₂SO₄)",
    zh: "总硫酸盐（以 K₂SO₄ 计）",
  },
  "Cloretos (em NaCl)": {
    en: "Chlorides (as NaCl)",
    es: "Cloruros (en NaCl)",
    zh: "氯化物（以 NaCl 计）",
  },
  Cinzas: { en: "Ash", es: "Cenizas", zh: "灰分" },
  "Extrato seco reduzido": {
    en: "Reduced dry extract",
    es: "Extracto seco reducido",
    zh: "还原干浸出物",
  },
  "Relação álcool em peso / extrato seco reduzido": {
    en: "Alcohol by weight / reduced dry extract ratio",
    es: "Relación alcohol en peso / extracto seco reducido",
    zh: "酒精重量 / 还原干浸出物比值",
  },
  "Resíduos de pesticidas sintéticos": {
    en: "Synthetic pesticide residues",
    es: "Residuos de pesticidas sintéticos",
    zh: "合成农药残留",
  },

  // ───────────────────────── Ajudas dos parâmetros ─────────────────────────
  "Álcool adquirido + potencial dos açúcares por fermentar.": {
    en: "Actual alcohol + potential from unfermented sugars.",
    es: "Alcohol adquirido + potencial de los azúcares sin fermentar.",
    zh: "实测酒精 + 未发酵糖的潜在酒精。",
  },
  "BR exprime em meq/L; PT/UE em g/L de ácido tartárico. Conversão automática.": {
    en: "BR uses meq/L; PT/EU uses g/L of tartaric acid. Automatic conversion.",
    es: "BR expresa en meq/L; PT/UE en g/L de ácido tartárico. Conversión automática.",
    zh: "巴西以 meq/L 表示；葡萄牙/欧盟以 g/L 酒石酸表示。自动换算。",
  },
  "BR exprime em meq/L; PT/UE em g/L de ácido acético. Conversão automática.": {
    en: "BR uses meq/L; PT/EU uses g/L of acetic acid. Automatic conversion.",
    es: "BR expresa en meq/L; PT/UE en g/L de ácido acético. Conversión automática.",
    zh: "巴西以 meq/L 表示；葡萄牙/欧盟以 g/L 乙酸表示。自动换算。",
  },
  "Usado para escolher o escalão de SO₂ aplicável e classificar a doçura.": {
    en: "Used to select the applicable SO₂ tier and classify sweetness.",
    es: "Se usa para elegir el escalón de SO₂ aplicable y clasificar el dulzor.",
    zh: "用于选择适用的 SO₂ 限值档位并判定甜度。",
  },
  "Não tem limite legal direto, mas é exigido no boletim UE (VI-1) e serve para o SO₂ molecular.":
    {
      en: "It has no direct legal limit, but is required on the EU certificate (VI-1) and feeds the molecular SO₂.",
      es: "No tiene límite legal directo, pero se exige en el boletín UE (VI-1) y sirve para el SO₂ molecular.",
      zh: "无直接法定限值，但欧盟证书（VI-1）要求填报，并用于计算分子态 SO₂。",
    },
  "Usado no cálculo do SO₂ molecular ativo.": {
    en: "Used in the active molecular SO₂ calculation.",
    es: "Se usa en el cálculo del SO₂ molecular activo.",
    zh: "用于计算活性分子态 SO₂。",
  },
  "BR exprime em atm; PT/UE em bar. Conversão automática.": {
    en: "BR uses atm; PT/EU uses bar. Automatic conversion.",
    es: "BR expresa en atm; PT/UE en bar. Conversión automática.",
    zh: "巴西以 atm 表示；葡萄牙/欧盟以 bar 表示。自动换算。",
  },
  "Calculada: álcool em peso (g/L) ÷ extrato seco reduzido (g/L). Marcador de diluição (BR ≤ 4,8).":
    {
      en: "Calculated: alcohol by weight (g/L) ÷ reduced dry extract (g/L). Dilution marker (BR ≤ 4.8).",
      es: "Calculada: alcohol en peso (g/L) ÷ extracto seco reducido (g/L). Marcador de dilución (BR ≤ 4,8).",
      zh: "计算值：酒精重量 (g/L) ÷ 还原干浸出物 (g/L)。稀释指标（巴西 ≤ 4,8）。",
    },
  "Em vinho orgânico/biológico a ausência é obrigatória.": {
    en: "Absence is mandatory in organic wine.",
    es: "En vino ecológico/orgánico la ausencia es obligatoria.",
    zh: "有机葡萄酒中必须为未检出。",
  },

  // ───────────────────── Etiquetas das calculadoras (lib/calculators.ts) ───
  "Volume de titulante gasto": {
    en: "Titrant volume used",
    es: "Volumen de titulante gastado",
    zh: "滴定剂用量",
  },
  "Concentração da NaOH": {
    en: "NaOH concentration",
    es: "Concentración de NaOH",
    zh: "NaOH 浓度",
  },
  "Volume de amostra": { en: "Sample volume", es: "Volumen de muestra", zh: "样品体积" },
  "V₁ — NaOH na titulação ácida": {
    en: "V₁ — NaOH in the acid titration",
    es: "V₁ — NaOH en la titulación ácida",
    zh: "V₁ — 酸滴定中的 NaOH",
  },
  "V₂ — iodo (SO₂ livre) · opcional": {
    en: "V₂ — iodine (free SO₂) · optional",
    es: "V₂ — yodo (SO₂ libre) · opcional",
    zh: "V₂ — 碘（游离 SO₂）· 可选",
  },
  "V₃ — iodo (SO₂ combinado) · opcional": {
    en: "V₃ — iodine (combined SO₂) · optional",
    es: "V₃ — yodo (SO₂ combinado) · opcional",
    zh: "V₃ — 碘（结合 SO₂）· 可选",
  },
  "Volume de AgNO₃ gasto": {
    en: "AgNO₃ volume used",
    es: "Volumen de AgNO₃ gastado",
    zh: "AgNO₃ 用量",
  },
  "Concentração da AgNO₃": {
    en: "AgNO₃ concentration",
    es: "Concentración de AgNO₃",
    zh: "AgNO₃ 浓度",
  },
  "Massa de cinzas": { en: "Mass of ash", es: "Masa de cenizas", zh: "灰分质量" },
  "Massa de BaSO₄": { en: "Mass of BaSO₄", es: "Masa de BaSO₄", zh: "BaSO₄ 质量" },
  "Leitura do aparelho": {
    en: "Instrument reading",
    es: "Lectura del aparato",
    zh: "仪器读数",
  },
  "Fator de diluição": { en: "Dilution factor", es: "Factor de dilución", zh: "稀释因子" },

  // ───────────────────────── Notas das calculadoras ───────────────────────
  "75 = ½ da massa molar do ácido tartárico. Resultado em g/L de ác. tartárico; a conversão para meq/L (BR) é automática.":
    {
      en: "75 = ½ the molar mass of tartaric acid. Result in g/L of tartaric acid; conversion to meq/L (BR) is automatic.",
      es: "75 = ½ de la masa molar del ácido tartárico. Resultado en g/L de ác. tartárico; la conversión a meq/L (BR) es automática.",
      zh: "75 = 酒石酸摩尔质量的 ½。结果以 g/L 酒石酸表示；换算为 meq/L（巴西）自动进行。",
    },
  "60 = massa molar do ác. acético; 32 = ½ M(SO₂). Preencha V₂ (SO₂ livre) e V₃ (SO₂ combinado) para a correção OIV completa; se vazios, devolve a acidez volátil bruta (válida para vinhos secos sem SO₂).":
    {
      en: "60 = molar mass of acetic acid; 32 = ½ M(SO₂). Fill in V₂ (free SO₂) and V₃ (combined SO₂) for the full OIV correction; if left empty, it returns the raw volatile acidity (valid for dry wines without SO₂).",
      es: "60 = masa molar del ác. acético; 32 = ½ M(SO₂). Rellene V₂ (SO₂ libre) y V₃ (SO₂ combinado) para la corrección OIV completa; si se dejan vacíos, devuelve la acidez volátil bruta (válida para vinos secos sin SO₂).",
      zh: "60 = 乙酸摩尔质量；32 = ½ M(SO₂)。填写 V₂（游离 SO₂）和 V₃（结合 SO₂）以进行完整的 OIV 校正；若留空，则返回未校正的挥发酸（适用于无 SO₂ 的干型葡萄酒）。",
    },
  "32 = ½ da massa molar do SO₂. Método de Paul (aspiração-titulação).": {
    en: "32 = ½ the molar mass of SO₂. Paul method (aspiration–titration).",
    es: "32 = ½ de la masa molar del SO₂. Método de Paul (aspiración-titulación).",
    zh: "32 = SO₂ 摩尔质量的 ½。Paul 法（吸气—滴定）。",
  },
  "32 = ½ da massa molar do SO₂. Aspiração a frio (fração livre).": {
    en: "32 = ½ the molar mass of SO₂. Cold aspiration (free fraction).",
    es: "32 = ½ de la masa molar del SO₂. Aspiración en frío (fracción libre).",
    zh: "32 = SO₂ 摩尔质量的 ½。冷吸气（游离部分）。",
  },
  "58,44 = massa molar do NaCl. Titulação potenciométrica (Mohr modificado).": {
    en: "58.44 = molar mass of NaCl. Potentiometric titration (modified Mohr).",
    es: "58,44 = masa molar del NaCl. Titulación potenciométrica (Mohr modificado).",
    zh: "58,44 = NaCl 摩尔质量。电位滴定法（改良 Mohr 法）。",
  },
  "Incineração. Com 20 mL de amostra, cinzas (g/L) = m × 50.": {
    en: "Incineration. With a 20 mL sample, ash (g/L) = m × 50.",
    es: "Incineración. Con 20 mL de muestra, cenizas (g/L) = m × 50.",
    zh: "灰化法。取 20 mL 样品时，灰分 (g/L) = m × 50。",
  },
  "Gravimetria. 0,7464 = fator de conversão BaSO₄ → K₂SO₄.": {
    en: "Gravimetry. 0.7464 = conversion factor BaSO₄ → K₂SO₄.",
    es: "Gravimetría. 0,7464 = factor de conversión BaSO₄ → K₂SO₄.",
    zh: "重量法。0,7464 = BaSO₄ → K₂SO₄ 换算系数。",
  },
  "Leitura instrumental corrigida pela diluição da amostra.": {
    en: "Instrument reading corrected for sample dilution.",
    es: "Lectura instrumental corregida por la dilución de la muestra.",
    zh: "仪器读数经样品稀释校正。",
  },

  // ─────────────── Categorias unificadas (lib/categories.ts) — labels ──────
  "Tinto tranquilo": { en: "Still red", es: "Tinto tranquilo", zh: "静止红葡萄酒" },
  "Branco / Rosé tranquilo": {
    en: "Still white / rosé",
    es: "Blanco / Rosado tranquilo",
    zh: "静止白 / 桃红葡萄酒",
  },
  "Tinto de mesa (uvas americanas/híbridas)": {
    en: "Table red (American/hybrid grapes)",
    es: "Tinto de mesa (uvas americanas/híbridas)",
    zh: "佐餐红葡萄酒（美洲种/杂交种葡萄）",
  },
  "Branco/Rosé de mesa (uvas americanas/híbridas)": {
    en: "Table white/rosé (American/hybrid grapes)",
    es: "Blanco/Rosado de mesa (uvas americanas/híbridas)",
    zh: "佐餐白/桃红葡萄酒（美洲种/杂交种葡萄）",
  },
  "Doce / Colheita tardia (açúcares > 45 g/L)": {
    en: "Sweet / late harvest (sugars > 45 g/L)",
    es: "Dulce / Vendimia tardía (azúcares > 45 g/L)",
    zh: "甜型 / 晚收（糖 > 45 g/L）",
  },
  "Espumante de qualidade": {
    en: "Quality sparkling",
    es: "Espumoso de calidad",
    zh: "优质起泡酒",
  },
  "Espumante (não-qualidade)": {
    en: "Sparkling (non-quality)",
    es: "Espumoso (no-calidad)",
    zh: "起泡酒（非优质）",
  },
  Frisante: { en: "Semi-sparkling", es: "De aguja", zh: "微起泡酒" },
  Licoroso: { en: "Fortified (liqueur wine)", es: "Licoroso", zh: "利口酒（强化酒）" },
  "Vinho do Porto (DOP)": {
    en: "Port wine (PDO)",
    es: "Vino de Oporto (DOP)",
    zh: "波特酒（DOP）",
  },
  "Madeira (DOP)": { en: "Madeira (PDO)", es: "Madeira (DOP)", zh: "马德拉酒（DOP）" },
  "Moscatel de Setúbal (DOP)": {
    en: "Moscatel de Setúbal (PDO)",
    es: "Moscatel de Setúbal (DOP)",
    zh: "塞图巴尔麝香（DOP）",
  },
  "Biológico / Orgânico tinto": {
    en: "Organic red",
    es: "Ecológico / Orgánico tinto",
    zh: "有机红葡萄酒",
  },
  "Biológico / Orgânico branco/rosé": {
    en: "Organic white/rosé",
    es: "Ecológico / Orgánico blanco/rosado",
    zh: "有机白/桃红葡萄酒",
  },

  // ─────────────── Categorias unificadas — notas ──────────────────────────
  'A UE não distingue "mesa"; valida-se contra os limites de vinho tinto tranquilo.': {
    en: 'The EU does not distinguish "table" wine; it is validated against still red wine limits.',
    es: "La UE no distingue «mesa»; se valida frente a los límites de vino tinto tranquilo.",
    zh: "欧盟不区分“佐餐”；按静止红葡萄酒限值校验。",
  },
  'A UE não distingue "mesa"; valida-se contra os limites de vinho branco/rosé tranquilo.':
    {
      en: 'The EU does not distinguish "table" wine; it is validated against still white/rosé limits.',
      es: "La UE no distingue «mesa»; se valida frente a los límites de vino blanco/rosado tranquilo.",
      zh: "欧盟不区分“佐餐”；按静止白/桃红葡萄酒限值校验。",
    },
  'O PIQ brasileiro não tem categoria "doce" autónoma; valida-se como vinho fino (ajustável).':
    {
      en: 'The Brazilian PIQ has no standalone "sweet" category; it is validated as a fine wine (adjustable).',
      es: "El PIQ brasileño no tiene categoría «dulce» autónoma; se valida como vino fino (ajustable).",
      zh: "巴西 PIQ 没有独立的“甜型”类别；按高级葡萄酒校验（可调整）。",
    },
  "No Brasil enquadra-se como vinho licoroso importado.": {
    en: "In Brazil it is classified as an imported liqueur wine.",
    es: "En Brasil se clasifica como vino licoroso importado.",
    zh: "在巴西归类为进口利口酒。",
  },

  // ─────────────── Categorias legais BR (legislation_br.json) ─────────────
  "Espumante / Champanha (natural)": {
    en: "Sparkling / Champagne (natural)",
    es: "Espumoso / Champaña (natural)",
    zh: "起泡酒 / 香槟（天然）",
  },
  "Vinho de mesa branco ou rosado": {
    en: "Table white or rosé wine",
    es: "Vino de mesa blanco o rosado",
    zh: "佐餐白或桃红葡萄酒",
  },
  "Vinho de mesa tinto": {
    en: "Table red wine",
    es: "Vino de mesa tinto",
    zh: "佐餐红葡萄酒",
  },
  "Vinho fino branco ou rosado (Vitis vinifera)": {
    en: "Fine white or rosé wine (Vitis vinifera)",
    es: "Vino fino blanco o rosado (Vitis vinifera)",
    zh: "高级白或桃红葡萄酒（酿酒葡萄）",
  },
  "Vinho fino tinto (Vitis vinifera)": {
    en: "Fine red wine (Vitis vinifera)",
    es: "Vino fino tinto (Vitis vinifera)",
    zh: "高级红葡萄酒（酿酒葡萄）",
  },
  "Vinho frisante": {
    en: "Semi-sparkling wine",
    es: "Vino de aguja",
    zh: "微起泡葡萄酒",
  },
  "Vinho licoroso": { en: "Liqueur wine", es: "Vino licoroso", zh: "利口葡萄酒" },
  "Vinho orgânico (Brasil)": {
    en: "Organic wine (Brazil)",
    es: "Vino orgánico (Brasil)",
    zh: "有机葡萄酒（巴西）",
  },

  // ─────────────── Categorias legais PT/UE (legislation_pt_eu.json) ────────
  "Vinho biológico branco ou rosé (Reg. UE 2018/848)": {
    en: "Organic white or rosé wine (EU Reg. 2018/848)",
    es: "Vino ecológico blanco o rosado (Reg. UE 2018/848)",
    zh: "有机白或桃红葡萄酒（欧盟法规 2018/848）",
  },
  "Vinho biológico tinto (Reg. UE 2018/848)": {
    en: "Organic red wine (EU Reg. 2018/848)",
    es: "Vino ecológico tinto (Reg. UE 2018/848)",
    zh: "有机红葡萄酒（欧盟法规 2018/848）",
  },
  "Vinho branco ou rosé tranquilo": {
    en: "Still white or rosé wine",
    es: "Vino blanco o rosado tranquilo",
    zh: "静止白或桃红葡萄酒",
  },
  "Vinho doce tranquilo (açúcares > 45 g/L)": {
    en: "Still sweet wine (sugars > 45 g/L)",
    es: "Vino dulce tranquilo (azúcares > 45 g/L)",
    zh: "静止甜葡萄酒（糖 > 45 g/L）",
  },
  "Vinho do Porto (DOP Porto)": {
    en: "Port wine (PDO Porto)",
    es: "Vino de Oporto (DOP Oporto)",
    zh: "波特酒（DOP Porto）",
  },
  "Vinho espumante de qualidade": {
    en: "Quality sparkling wine",
    es: "Vino espumoso de calidad",
    zh: "优质起泡葡萄酒",
  },
  "Vinho espumante (não-qualidade)": {
    en: "Sparkling wine (non-quality)",
    es: "Vino espumoso (no-calidad)",
    zh: "起泡葡萄酒（非优质）",
  },
  "Vinho licoroso (ex: Porto, Madeira, Moscatel)": {
    en: "Liqueur wine (e.g. Port, Madeira, Moscatel)",
    es: "Vino licoroso (ej.: Oporto, Madeira, Moscatel)",
    zh: "利口葡萄酒（如波特、马德拉、麝香）",
  },
  "Vinho Madeira (DOP Madeira)": {
    en: "Madeira wine (PDO Madeira)",
    es: "Vino de Madeira (DOP Madeira)",
    zh: "马德拉葡萄酒（DOP Madeira）",
  },
  "Vinho tinto tranquilo": {
    en: "Still red wine",
    es: "Vino tinto tranquilo",
    zh: "静止红葡萄酒",
  },

  // ─────────────── Secções sensoriais (data/legal/sensory.json) ───────────
  "Exame Visual": { en: "Visual examination", es: "Examen visual", zh: "外观检验" },
  "Exame Olfativo": {
    en: "Olfactory examination",
    es: "Examen olfativo",
    zh: "嗅觉检验",
  },
  "Exame Gustativo": {
    en: "Gustatory examination",
    es: "Examen gustativo",
    zh: "味觉检验",
  },
  "Harmonia / Impressão Geral": {
    en: "Harmony / Overall impression",
    es: "Armonía / Impresión general",
    zh: "协调性 / 总体印象",
  },

  // ─────────────── Critérios sensoriais ───────────────────────────────────
  Limpidez: { en: "Clarity", es: "Limpidez", zh: "澄清度" },
  "Aspecto / Cor": { en: "Appearance / Colour", es: "Aspecto / Color", zh: "外观 / 颜色" },
  Intensidade: { en: "Intensity", es: "Intensidad", zh: "强度" },
  "Qualidade / Genuinidade": {
    en: "Quality / Genuineness",
    es: "Calidad / Genuinidad",
    zh: "品质 / 典型性",
  },
  Franqueza: { en: "Frankness", es: "Franqueza", zh: "纯正度" },
  Complexidade: { en: "Complexity", es: "Complejidad", zh: "复杂度" },
  "Equilíbrio (ácido / álcool / corpo / taninos)": {
    en: "Balance (acid / alcohol / body / tannins)",
    es: "Equilibrio (ácido / alcohol / cuerpo / taninos)",
    zh: "平衡（酸 / 酒精 / 酒体 / 单宁）",
  },
  "Persistência / Final de boca": {
    en: "Persistence / Finish",
    es: "Persistencia / Final de boca",
    zh: "余味 / 收尾",
  },
  "Qualidade global gustativa": {
    en: "Overall gustatory quality",
    es: "Calidad global gustativa",
    zh: "味觉总体品质",
  },
  "Harmonia / juízo geral": {
    en: "Harmony / overall judgement",
    es: "Armonía / juicio general",
    zh: "协调性 / 总体评价",
  },

  // ─────────────── Nomes dos defeitos (data/legal/defects.json) ───────────
  "TCA / Cheiro a rolha": {
    en: "TCA / Cork taint",
    es: "TCA / Olor a corcho",
    zh: "TCA / 软木塞味",
  },
  "Brettanomyces / 4-EP, 4-EG": {
    en: "Brettanomyces / 4-EP, 4-EG",
    es: "Brettanomyces / 4-EP, 4-EG",
    zh: "酒香酵母 / 4-EP、4-EG",
  },
  "Acidez volátil / Picado acético": {
    en: "Volatile acidity / Acetic spoilage",
    es: "Acidez volátil / Picado acético",
    zh: "挥发酸 / 醋酸味",
  },
  "Oxidação": { en: "Oxidation", es: "Oxidación", zh: "氧化" },
  "Redução / Sulfuretos": {
    en: "Reduction / Sulfides",
    es: "Reducción / Sulfuros",
    zh: "还原 / 硫化物",
  },
  "Light strike / Vinho enjoado pela luz": {
    en: "Light strike / Light-struck wine",
    es: "Light strike / Vino afectado por la luz",
    zh: "光照变质 / 日光臭",
  },
  "Geosmina / Mofo": { en: "Geosmin / Mould", es: "Geosmina / Moho", zh: "土臭素 / 霉味" },
  "Acetato de etilo (excesso)": {
    en: "Ethyl acetate (excess)",
    es: "Acetato de etilo (exceso)",
    zh: "乙酸乙酯（过量）",
  },

  // ─────────────── Campos dos defeitos ────────────────────────────────────
  "2,4,6-tricloroanisol (TCA), 2,4,6-tribromoanisol": {
    en: "2,4,6-trichloroanisole (TCA), 2,4,6-tribromoanisole",
    es: "2,4,6-tricloroanisol (TCA), 2,4,6-tribromoanisol",
    zh: "2,4,6-三氯苯甲醚（TCA）、2,4,6-三溴苯甲醚",
  },
  "1,5–4 ng/L (limiar humano)": {
    en: "1.5–4 ng/L (human threshold)",
    es: "1,5–4 ng/L (umbral humano)",
    zh: "1,5–4 ng/L（人类阈值）",
  },
  "Cheiro a cartão molhado, cave húmida, jornal velho. Disfarça os aromas frutados.": {
    en: "Smell of wet cardboard, damp cellar, old newspaper. Masks fruity aromas.",
    es: "Olor a cartón mojado, bodega húmeda, periódico viejo. Enmascara los aromas frutales.",
    zh: "湿纸板、潮湿地窖、旧报纸的气味。掩盖果香。",
  },
  "Contaminação por rolha defeituosa ou ambiente da adega.": {
    en: "Contamination from a faulty cork or the cellar environment.",
    es: "Contaminación por corcho defectuoso o ambiente de la bodega.",
    zh: "由问题软木塞或酒窖环境污染所致。",
  },
  "SPME-GC-MS (limite 0,5 ng/L)": {
    en: "SPME-GC-MS (limit 0.5 ng/L)",
    es: "SPME-GC-MS (límite 0,5 ng/L)",
    zh: "SPME-GC-MS（限值 0,5 ng/L）",
  },
  "4-etilfenol (4-EP), 4-etilguaiacol (4-EG)": {
    en: "4-ethylphenol (4-EP), 4-ethylguaiacol (4-EG)",
    es: "4-etilfenol (4-EP), 4-etilguayacol (4-EG)",
    zh: "4-乙基苯酚（4-EP）、4-乙基愈创木酚（4-EG）",
  },
  "230 µg/L (4-EP em vinho tinto)": {
    en: "230 µg/L (4-EP in red wine)",
    es: "230 µg/L (4-EP en vino tinto)",
    zh: "230 µg/L（红葡萄酒中的 4-EP）",
  },
  "Suor de cavalo, cavalariça, especiarias farmacêuticas, plástico queimado.": {
    en: "Horse sweat, stable, pharmaceutical spices, burnt plastic.",
    es: "Sudor de caballo, cuadra, especias farmacéuticas, plástico quemado.",
    zh: "马汗、马厩、药味香料、焦塑料味。",
  },
  "Levedura Brettanomyces bruxellensis em barricas mal sanitizadas, vinhos com SO₂ livre baixo, pH > 3,7.":
    {
      en: "Brettanomyces bruxellensis yeast in poorly sanitised barrels, wines with low free SO₂, pH > 3.7.",
      es: "Levadura Brettanomyces bruxellensis en barricas mal higienizadas, vinos con SO₂ libre bajo, pH > 3,7.",
      zh: "卫生不良橡木桶中的布鲁塞尔酒香酵母，游离 SO₂ 低、pH > 3,7 的葡萄酒。",
    },
  "GC-MS para 4-EP/4-EG; qPCR para Brettanomyces.": {
    en: "GC-MS for 4-EP/4-EG; qPCR for Brettanomyces.",
    es: "GC-MS para 4-EP/4-EG; qPCR para Brettanomyces.",
    zh: "GC-MS 测 4-EP/4-EG；qPCR 测酒香酵母。",
  },
  "Ácido acético, acetato de etilo": {
    en: "Acetic acid, ethyl acetate",
    es: "Ácido acético, acetato de etilo",
    zh: "乙酸、乙酸乙酯",
  },
  "0,7–0,9 g/L de ácido acético": {
    en: "0.7–0.9 g/L of acetic acid",
    es: "0,7–0,9 g/L de ácido acético",
    zh: "0,7–0,9 g/L 乙酸",
  },
  "Cheiro a vinagre, esmalte de unhas (acetato de etilo).": {
    en: "Vinegar smell, nail polish (ethyl acetate).",
    es: "Olor a vinagre, esmalte de uñas (acetato de etilo).",
    zh: "醋味、指甲油味（乙酸乙酯）。",
  },
  "Bactérias acéticas (Acetobacter), oxidação excessiva, SO₂ livre baixo.": {
    en: "Acetic bacteria (Acetobacter), excessive oxidation, low free SO₂.",
    es: "Bacterias acéticas (Acetobacter), oxidación excesiva, SO₂ libre bajo.",
    zh: "醋酸菌（醋杆菌）、过度氧化、游离 SO₂ 低。",
  },
  "Método Cazenave-Ferré (OIV-MA-AS313-02).": {
    en: "Cazenave-Ferré method (OIV-MA-AS313-02).",
    es: "Método Cazenave-Ferré (OIV-MA-AS313-02).",
    zh: "Cazenave-Ferré 法（OIV-MA-AS313-02）。",
  },
  "Acetaldeído, sotolon": {
    en: "Acetaldehyde, sotolon",
    es: "Acetaldehído, sotolón",
    zh: "乙醛、葫芦巴内酯",
  },
  "100 mg/L acetaldeído": {
    en: "100 mg/L acetaldehyde",
    es: "100 mg/L acetaldehído",
    zh: "100 mg/L 乙醛",
  },
  "Em brancos: cor dourada/âmbar precoce, aromas a maçã madura, noz, caramelo. Em tintos: cor tijolada precoce, perda de fruta.":
    {
      en: "In whites: premature golden/amber colour, aromas of ripe apple, walnut, caramel. In reds: premature brick colour, loss of fruit.",
      es: "En blancos: color dorado/ámbar precoz, aromas a manzana madura, nuez, caramelo. En tintos: color teja precoz, pérdida de fruta.",
      zh: "白葡萄酒：过早呈金黄/琥珀色，熟苹果、核桃、焦糖香。红葡萄酒：过早呈砖红色，果香丧失。",
    },
  "Exposição prolongada ao oxigénio, SO₂ insuficiente.": {
    en: "Prolonged oxygen exposure, insufficient SO₂.",
    es: "Exposición prolongada al oxígeno, SO₂ insuficiente.",
    zh: "长时间暴露于氧气、SO₂ 不足。",
  },
  "Enzimático para acetaldeído; cor por CIELab.": {
    en: "Enzymatic for acetaldehyde; colour by CIELab.",
    es: "Enzimático para acetaldehído; color por CIELab.",
    zh: "乙醛用酶法；颜色用 CIELab。",
  },
  "H₂S, mercaptanos (metanotiol, etanotiol)": {
    en: "H₂S, mercaptans (methanethiol, ethanethiol)",
    es: "H₂S, mercaptanos (metanotiol, etanotiol)",
    zh: "H₂S、硫醇（甲硫醇、乙硫醇）",
  },
  "1,1 µg/L (H₂S), 0,5 µg/L (etanotiol)": {
    en: "1.1 µg/L (H₂S), 0.5 µg/L (ethanethiol)",
    es: "1,1 µg/L (H₂S), 0,5 µg/L (etanotiol)",
    zh: "1,1 µg/L（H₂S）、0,5 µg/L（乙硫醇）",
  },
  "Ovo podre, alho, cebola, borracha queimada, repolho.": {
    en: "Rotten egg, garlic, onion, burnt rubber, cabbage.",
    es: "Huevo podrido, ajo, cebolla, goma quemada, repollo.",
    zh: "臭鸡蛋、大蒜、洋葱、焦橡胶、卷心菜。",
  },
  "Stress da levedura por falta de azoto durante a fermentação, armazenamento sem oxigénio em garrafa.":
    {
      en: "Yeast stress from nitrogen deficiency during fermentation, oxygen-free storage in bottle.",
      es: "Estrés de la levadura por falta de nitrógeno durante la fermentación, almacenamiento sin oxígeno en botella.",
      zh: "发酵期间缺氮导致酵母应激、瓶中无氧贮存。",
    },
  "GC-PFPD, teste do cobre (CuSO₄ 1%).": {
    en: "GC-PFPD, copper test (CuSO₄ 1%).",
    es: "GC-PFPD, prueba del cobre (CuSO₄ 1%).",
    zh: "GC-PFPD、铜试验（1% CuSO₄）。",
  },
  "Dimetildissulfureto (DMDS), metanotiol": {
    en: "Dimethyl disulfide (DMDS), methanethiol",
    es: "Disulfuro de dimetilo (DMDS), metanotiol",
    zh: "二甲基二硫醚（DMDS）、甲硫醇",
  },
  Variável: { en: "Variable", es: "Variable", zh: "可变" },
  "Repolho cozido, lã molhada — aparece em brancos/espumantes expostos a luz UV em garrafa transparente.":
    {
      en: "Cooked cabbage, wet wool — appears in whites/sparkling exposed to UV light in clear bottles.",
      es: "Repollo cocido, lana mojada — aparece en blancos/espumosos expuestos a luz UV en botella transparente.",
      zh: "煮卷心菜、湿羊毛味——见于透明瓶装、受紫外光照射的白葡萄酒/起泡酒。",
    },
  "Fotodegradação de aminoácidos sulfurados; potenciada por riboflavina.": {
    en: "Photodegradation of sulfur amino acids; enhanced by riboflavin.",
    es: "Fotodegradación de aminoácidos azufrados; potenciada por riboflavina.",
    zh: "含硫氨基酸的光降解；核黄素会加剧。",
  },
  "GC-MS": { en: "GC-MS", es: "GC-MS", zh: "GC-MS" },
  "Geosmina, 2-metilisoborneol": {
    en: "Geosmin, 2-methylisoborneol",
    es: "Geosmina, 2-metilisoborneol",
    zh: "土臭素、2-甲基异莰醇",
  },
  "0,05 µg/L": { en: "0.05 µg/L", es: "0,05 µg/L", zh: "0,05 µg/L" },
  "Terra molhada, beterraba crua, mofo.": {
    en: "Wet earth, raw beetroot, mould.",
    es: "Tierra mojada, remolacha cruda, moho.",
    zh: "湿泥土、生甜菜、霉味。",
  },
  "Uvas com Botrytis ou Penicillium, ambiente fúngico na adega.": {
    en: "Grapes with Botrytis or Penicillium, fungal environment in the cellar.",
    es: "Uvas con Botrytis o Penicillium, ambiente fúngico en la bodega.",
    zh: "感染灰霉菌或青霉菌的葡萄、酒窖真菌环境。",
  },
  "SPME-GC-MS": { en: "SPME-GC-MS", es: "SPME-GC-MS", zh: "SPME-GC-MS" },
  "Acetato de etilo": { en: "Ethyl acetate", es: "Acetato de etilo", zh: "乙酸乙酯" },
  "150-200 mg/L": { en: "150-200 mg/L", es: "150-200 mg/L", zh: "150-200 mg/L" },
  "Verniz, solvente, cola.": {
    en: "Varnish, solvent, glue.",
    es: "Barniz, disolvente, pegamento.",
    zh: "清漆、溶剂、胶水味。",
  },
  "Bactérias acéticas, leveduras não-Saccharomyces.": {
    en: "Acetic bacteria, non-Saccharomyces yeasts.",
    es: "Bacterias acéticas, levaduras no-Saccharomyces.",
    zh: "醋酸菌、非酿酒酵母。",
  },
  "GC-FID": { en: "GC-FID", es: "GC-FID", zh: "GC-FID" },

  // ─────────────── Medalhas OIV (lib/sensory.ts) ──────────────────────────
  "Grande Medalha de Ouro": {
    en: "Grand Gold Medal",
    es: "Gran Medalla de Oro",
    zh: "大金奖",
  },
  "Medalha de Ouro": { en: "Gold Medal", es: "Medalla de Oro", zh: "金奖" },
  "Medalha de Prata": { en: "Silver Medal", es: "Medalla de Plata", zh: "银奖" },
  "Medalha de Bronze": { en: "Bronze Medal", es: "Medalla de Bronce", zh: "铜奖" },
  "Sem distinção": { en: "No award", es: "Sin distinción", zh: "无奖项" },

  // ─────────────── Estado do SO₂ molecular (lib/chemistry.ts) ─────────────
  "Proteção robusta": {
    en: "Robust protection",
    es: "Protección robusta",
    zh: "强效保护",
  },
  "Adequado (controla Brettanomyces)": {
    en: "Adequate (controls Brettanomyces)",
    es: "Adecuado (controla Brettanomyces)",
    zh: "适当（可抑制酒香酵母）",
  },
  "Proteção mínima": {
    en: "Minimal protection",
    es: "Protección mínima",
    zh: "最低保护",
  },
  Insuficiente: { en: "Insufficient", es: "Insuficiente", zh: "不足" },

  // ─────── Nomes legais dos parâmetros (tabela de resultados) ─────────────
  "Acidez total (em ácido tartárico)": {
    en: "Total acidity (as tartaric acid)",
    es: "Acidez total (en ácido tartárico)",
    zh: "总酸（以酒石酸计）",
  },
  "Acidez volátil (em ácido acético)": {
    en: "Volatile acidity (as acetic acid)",
    es: "Acidez volátil (en ácido acético)",
    zh: "挥发酸（以乙酸计）",
  },
  "Açúcar total (em glucose)": {
    en: "Total sugar (as glucose)",
    es: "Azúcar total (en glucosa)",
    zh: "总糖（以葡萄糖计）",
  },
  "Açúcares totais": { en: "Total sugars", es: "Azúcares totales", zh: "总糖" },
  "Graduação alcoólica (TAV)": {
    en: "Alcoholic strength (ABV)",
    es: "Graduación alcohólica (TAV)",
    zh: "酒精度（TAV）",
  },
  "Pressão a 20°C": { en: "Pressure at 20 °C", es: "Presión a 20 °C", zh: "20 °C 时的压力" },
  "Relação álcool em peso/extrato seco reduzido": {
    en: "Alcohol by weight / reduced dry extract ratio",
    es: "Relación alcohol en peso/extracto seco reducido",
    zh: "酒精重量 / 还原干浸出物比值",
  },
  "SO₂ total (açúcares < 5 g/L)": {
    en: "Total SO₂ (sugars < 5 g/L)",
    es: "SO₂ total (azúcares < 5 g/L)",
    zh: "总 SO₂（糖 < 5 g/L）",
  },
  "SO₂ total (açúcares ≥ 5 g/L)": {
    en: "Total SO₂ (sugars ≥ 5 g/L)",
    es: "SO₂ total (azúcares ≥ 5 g/L)",
    zh: "总 SO₂（糖 ≥ 5 g/L）",
  },
  "SO₂ total (orgânico)": {
    en: "Total SO₂ (organic)",
    es: "SO₂ total (orgánico)",
    zh: "总 SO₂（有机）",
  },
  "SO₂ total - branco/rosé bio (açúcares < 2 g/L)": {
    en: "Total SO₂ - organic white/rosé (sugars < 2 g/L)",
    es: "SO₂ total - blanco/rosado eco (azúcares < 2 g/L)",
    zh: "总 SO₂ - 有机白/桃红（糖 < 2 g/L）",
  },
  "SO₂ total - branco/rosé bio (açúcares ≥ 2 g/L)": {
    en: "Total SO₂ - organic white/rosé (sugars ≥ 2 g/L)",
    es: "SO₂ total - blanco/rosado eco (azúcares ≥ 2 g/L)",
    zh: "总 SO₂ - 有机白/桃红（糖 ≥ 2 g/L）",
  },
  "SO₂ total - tinto bio (açúcares < 2 g/L)": {
    en: "Total SO₂ - organic red (sugars < 2 g/L)",
    es: "SO₂ total - tinto eco (azúcares < 2 g/L)",
    zh: "总 SO₂ - 有机红（糖 < 2 g/L）",
  },
  "SO₂ total - tinto bio (açúcares ≥ 2 g/L)": {
    en: "Total SO₂ - organic red (sugars ≥ 2 g/L)",
    es: "SO₂ total - tinto eco (azúcares ≥ 2 g/L)",
    zh: "总 SO₂ - 有机红（糖 ≥ 2 g/L）",
  },
  "Sobrepressão a 20°C": {
    en: "Overpressure at 20 °C",
    es: "Sobrepresión a 20 °C",
    zh: "20 °C 时的超压",
  },
  "Sobrepressão de CO₂": {
    en: "CO₂ overpressure",
    es: "Sobrepresión de CO₂",
    zh: "CO₂ 超压",
  },
  "Título alcoométrico volúmico adquirido": {
    en: "Actual volumic alcoholic strength",
    es: "Grado alcohólico volumétrico adquirido",
    zh: "实测体积酒精度",
  },
  "Título alcoométrico volúmico total": {
    en: "Total volumic alcoholic strength",
    es: "Grado alcohólico volumétrico total",
    zh: "总体积酒精度",
  },
};

/** Dicionário de domínio completo: base (acima) + conteúdo dos métodos OIV. */
const DOMAIN: Record<string, DomainTr> = { ...BASE, ...METHOD_DOMAIN };

/**
 * Traduz uma string de DOMÍNIO (PT → idioma). Se o idioma for PT, ou não houver
 * tradução, devolve a string PT original (a fonte de verdade legal).
 */
export function translateDomain(locale: Locale, pt: string): string {
  if (locale === DEFAULT_LOCALE || !pt) return pt;
  const entry = DOMAIN[pt];
  if (!entry) return pt;
  return entry[locale as "en" | "es" | "zh"] ?? pt;
}

/** Existe uma entrada de tradução (en/es/zh não vazios) para esta string PT? Usado em testes de cobertura. */
export function hasDomainEntry(pt: string): boolean {
  const e = DOMAIN[pt];
  return !!e && !!e.en && !!e.es && !!e.zh;
}
