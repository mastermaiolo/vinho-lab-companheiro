/**
 * Internacionalização da INTERFACE (chrome) — cabeçalhos, separadores, botões,
 * instruções e avisos. Os dados de domínio (nomes de parâmetros, categorias,
 * critérios sensoriais, métodos, limites legais) vêm do JSON e NÃO são
 * traduzidos aqui: continuam a ser a referência legal em português.
 *
 * As traduções aceitam interpolação ({nome}) e ênfase com **negrito**.
 */
export type Locale = "pt" | "en" | "es" | "zh";

export interface LocaleMeta {
  code: Locale;
  flag: string;
  label: string;
}

export const LOCALES: LocaleMeta[] = [
  { code: "pt", flag: "🇵🇹", label: "Português" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
];

export const DEFAULT_LOCALE: Locale = "pt";

type Dict = Record<string, string>;

const pt: Dict = {
  "page.tagline":
    "Companheiro de laboratório — valida o mesmo vinho contra o Brasil (MAPA) e Portugal/UE (IVV) e indica a exportabilidade. Processamento 100 % no seu navegador.",
  "page.wineType": "Tipo de vinho",
  "page.hideEquiv": "Ocultar equivalências",
  "page.adjustEquiv": "Ajustar equivalências por regime",
  "page.catBR": "Categoria Brasil (MAPA)",
  "page.catPT": "Categoria Portugal/UE (IVV)",
  "page.sample": "Amostra / Vinho",
  "page.lot": "Lote",
  "page.responsible": "Responsável",
  "page.date": "Data da análise",
  "page.tabsLabel": "Secções da análise",
  "page.toolbarHint": "Guarde ou retome o trabalho — tudo no seu navegador, sem servidor.",
  "page.chemIntro":
    "Introduza os dados brutos. Onde os regimes usam unidades diferentes, escolha a unidade em que mediu — a conversão é automática. As etiquetas BR / PT-UE indicam que regimes usam cada parâmetro.",
  "page.footer":
    "Ferramenta de apoio à decisão · não substitui o boletim oficial de laboratório autorizado · limites legais provenientes do projeto Vinho-Lab (MAPA IN 14/2018 e Reg. UE 1308/2013, 2019/934, 2018/848).",

  "tab.quimica": "Análise química",
  "tab.calculadora": "Calculadora de resultados",
  "tab.sensorial": "Análise sensorial",
  "tab.resultado": "Resultado",

  "toolbar.export": "Exportar dados (.json)",
  "toolbar.import": "Importar dados",
  "toolbar.exported": "Sessão exportada.",
  "toolbar.imported": "Importado: {name}",
  "toolbar.importFail": "Falha ao importar o ficheiro.",

  "field.computed": "calculado",
  "field.auxiliar": "auxiliar",
  "field.unit": "unidade",
  "field.notEvaluated": "— não avaliado —",
  "field.absent": "Ausente",
  "field.present": "Presente",
  "field.calculatedTitle": "Valor obtido na aba Calculadora de resultados",
  "field.calculatedNote":
    "Calculado na aba **Calculadora de resultados**. Editar aqui substitui o valor.",

  "method.show": "Ver método OIV",
  "method.hide": "Ocultar método OIV",
  "method.principle": "Princípio",
  "method.equipment": "Equipamento",
  "method.reagents": "Reagentes",
  "method.procedure": "Procedimento",
  "method.calculation": "Cálculo",
  "method.precision": "Precisão",
  "method.acceptance": "Aceitação regulatória",

  "calc.intro":
    "Introduza as leituras brutas da bancada (volume de titulante gasto, concentração do reagente, volume de amostra…). O valor final é calculado pela fórmula oficial OIV e passa automaticamente para a aba **Análise química**, onde é validado contra os dois regimes.",

  "sensory.oivScore": "Pontuação OIV",
  "sensory.pts": "pts",
  "sensory.defectsTitle": "Defeitos sensoriais",
  "sensory.defectsHint":
    "Assinale defeitos percecionados. Cada um inclui composto responsável, limite de perceção e método de confirmação laboratorial.",
  "sensory.compound": "Composto",
  "sensory.threshold": "Limite",
  "sensory.lab": "Lab",
  "sensory.tastingNotes": "Notas de prova",
  "sensory.tastingPlaceholder": "Descritores, observações, harmonização…",

  "result.exportVerdict": "Veredicto de exportabilidade",
  "result.vConformeBR": "Conforme como vinho brasileiro (MAPA)",
  "result.vConformePT": "Conforme como vinho português/UE (IVV)",
  "result.vExportPTBR": "Exportável Portugal → Brasil",
  "result.vExportBRPT": "Exportável Brasil → Portugal/UE",
  "result.exportNote":
    "A exportabilidade considera apenas os limites físico-químicos. A colocação no mercado exige ainda documentação (certificado de origem, VI-1, boletim de laboratório autorizado), rotulagem e práticas enológicas conformes.",
  "result.blocks": "Bloqueios",
  "result.thParam": "Parâmetro",
  "result.thValue": "Valor",
  "result.thLimit": "Limite",
  "result.thStatus": "Estado",
  "result.legalBasis": "Base legal",
  "result.borderline": "zona de incerteza",
  "result.borderlineTitle":
    "A ±{unc} {unit} do limite legal (margem {kind} OIV). Confirmar com repetição da análise.",
  "result.kindR": "de reprodutibilidade R",
  "result.kindr": "de repetibilidade r",
  "result.marginNote":
    "**± margem de erro:** incerteza analítica do método OIV (reprodutibilidade R, ou repetibilidade r quando R não está documentada). Um valor assinalado como «zona de incerteza» está a menos de uma margem de erro do limite legal: a conformidade não deve ser declarada sem repetir a análise.",
  "result.molecularTitle": "SO₂ molecular ativo",
  "result.molecularLine": "SO₂ molecular: **{v} mg/L** ({estado}) · fração {frac} % · pH {ph}",
  "result.sensoryTitle": "Análise sensorial (OIV)",
  "result.defects": "Defeitos",
  "result.downloadMd": "Descarregar Markdown (.md)",
  "result.downloadPdf": "Descarregar PDF",
  "result.generatingPdf": "A gerar PDF…",
  "result.pdfError": "Não foi possível gerar o PDF: {msg}",

  "status.Conforme": "Conforme",
  "status.Não conforme": "Não conforme",
  "status.Sem limite": "Sem limite",
  "status.Não medido": "Não medido",
  "status.overall.conformeNm": "Conforme (com parâmetros não medidos)",

  "modal.title": "Vinho-Lab — primeira versão",
  "modal.intro": "Bem-vindo ao **Vinho-Lab**, o seu companheiro de laboratório. Antes de começar:",
  "modal.b1": "É a **primeira versão**, ainda em evolução, e um projeto **open source**.",
  "modal.b2": "**Não são recolhidas métricas** nem dados pessoais — em respeito pelo **RGPD/GDPR**.",
  "modal.b3":
    "**Todo o cálculo corre no seu navegador**: os valores que introduz são processados no seu dispositivo e **nada é enviado ou guardado**.",
  "modal.b4": "Ao fechar a página, **nada permanece**.",
  "modal.support":
    "Ferramenta de **apoio à decisão**: não substitui o boletim oficial de um laboratório autorizado.",
  "modal.button": "Compreendi e quero continuar",

  "lang.label": "Idioma",
};

const en: Dict = {
  "page.tagline":
    "Your lab companion — validates the same wine against Brazil (MAPA) and Portugal/EU (IVV) and indicates exportability. 100% processed in your browser.",
  "page.wineType": "Wine type",
  "page.hideEquiv": "Hide equivalences",
  "page.adjustEquiv": "Adjust equivalences per regime",
  "page.catBR": "Brazil category (MAPA)",
  "page.catPT": "Portugal/EU category (IVV)",
  "page.sample": "Sample / Wine",
  "page.lot": "Lot",
  "page.responsible": "Analyst",
  "page.date": "Analysis date",
  "page.tabsLabel": "Analysis sections",
  "page.toolbarHint": "Save or resume your work — all in your browser, no server.",
  "page.chemIntro":
    "Enter the raw data. Where the regimes use different units, choose the unit you measured in — conversion is automatic. The BR / PT-EU tags show which regimes use each parameter.",
  "page.footer":
    "Decision-support tool · does not replace the official report from an accredited laboratory · legal limits from the Vinho-Lab project (MAPA IN 14/2018 and EU Reg. 1308/2013, 2019/934, 2018/848).",

  "tab.quimica": "Chemical analysis",
  "tab.calculadora": "Results calculator",
  "tab.sensorial": "Sensory analysis",
  "tab.resultado": "Result",

  "toolbar.export": "Export data (.json)",
  "toolbar.import": "Import data",
  "toolbar.exported": "Session exported.",
  "toolbar.imported": "Imported: {name}",
  "toolbar.importFail": "Failed to import the file.",

  "field.computed": "calculated",
  "field.auxiliar": "auxiliary",
  "field.unit": "unit",
  "field.notEvaluated": "— not assessed —",
  "field.absent": "Absent",
  "field.present": "Present",
  "field.calculatedTitle": "Value obtained in the Results calculator tab",
  "field.calculatedNote":
    "Calculated in the **Results calculator** tab. Editing here overrides the value.",

  "method.show": "View OIV method",
  "method.hide": "Hide OIV method",
  "method.principle": "Principle",
  "method.equipment": "Equipment",
  "method.reagents": "Reagents",
  "method.procedure": "Procedure",
  "method.calculation": "Calculation",
  "method.precision": "Precision",
  "method.acceptance": "Regulatory acceptance",

  "calc.intro":
    "Enter the raw bench readings (titrant volume used, reagent concentration, sample volume…). The final value is computed with the official OIV formula and is carried automatically to the **Chemical analysis** tab, where it is validated against both regimes.",

  "sensory.oivScore": "OIV score",
  "sensory.pts": "pts",
  "sensory.defectsTitle": "Sensory defects",
  "sensory.defectsHint":
    "Tick the defects perceived. Each lists the responsible compound, perception threshold and laboratory confirmation method.",
  "sensory.compound": "Compound",
  "sensory.threshold": "Threshold",
  "sensory.lab": "Lab",
  "sensory.tastingNotes": "Tasting notes",
  "sensory.tastingPlaceholder": "Descriptors, observations, food pairing…",

  "result.exportVerdict": "Exportability verdict",
  "result.vConformeBR": "Compliant as a Brazilian wine (MAPA)",
  "result.vConformePT": "Compliant as a Portuguese/EU wine (IVV)",
  "result.vExportPTBR": "Exportable Portugal → Brazil",
  "result.vExportBRPT": "Exportable Brazil → Portugal/EU",
  "result.exportNote":
    "Exportability considers only the physico-chemical limits. Placing on the market still requires documentation (certificate of origin, VI-1, accredited laboratory report), labelling and compliant oenological practices.",
  "result.blocks": "Blockers",
  "result.thParam": "Parameter",
  "result.thValue": "Value",
  "result.thLimit": "Limit",
  "result.thStatus": "Status",
  "result.legalBasis": "Legal basis",
  "result.borderline": "uncertainty zone",
  "result.borderlineTitle":
    "Within ±{unc} {unit} of the legal limit (OIV {kind} margin). Confirm by repeating the analysis.",
  "result.kindR": "reproducibility R",
  "result.kindr": "repeatability r",
  "result.marginNote":
    "**± margin of error:** analytical uncertainty of the OIV method (reproducibility R, or repeatability r where R is not documented). A value flagged as «uncertainty zone» is within one margin of error of the legal limit: compliance should not be declared without repeating the analysis.",
  "result.molecularTitle": "Active molecular SO₂",
  "result.molecularLine": "Molecular SO₂: **{v} mg/L** ({estado}) · fraction {frac} % · pH {ph}",
  "result.sensoryTitle": "Sensory analysis (OIV)",
  "result.defects": "Defects",
  "result.downloadMd": "Download Markdown (.md)",
  "result.downloadPdf": "Download PDF",
  "result.generatingPdf": "Generating PDF…",
  "result.pdfError": "Could not generate the PDF: {msg}",

  "status.Conforme": "Compliant",
  "status.Não conforme": "Non-compliant",
  "status.Sem limite": "No limit",
  "status.Não medido": "Not measured",
  "status.overall.conformeNm": "Compliant (with unmeasured parameters)",

  "modal.title": "Vinho-Lab — first version",
  "modal.intro": "Welcome to **Vinho-Lab**, your lab companion. Before you start:",
  "modal.b1": "This is the **first version**, still evolving, and an **open source** project.",
  "modal.b2": "**No metrics** or personal data are collected — in respect of the **GDPR**.",
  "modal.b3":
    "**All computation runs in your browser**: the values you enter are processed on your device and **nothing is sent or stored**.",
  "modal.b4": "When you close the page, **nothing remains**.",
  "modal.support":
    "A **decision-support** tool: it does not replace the official report of an accredited laboratory.",
  "modal.button": "I understand and want to continue",

  "lang.label": "Language",
};

const es: Dict = {
  "page.tagline":
    "Compañero de laboratorio — valida el mismo vino frente a Brasil (MAPA) y Portugal/UE (IVV) e indica la exportabilidad. Procesamiento 100 % en su navegador.",
  "page.wineType": "Tipo de vino",
  "page.hideEquiv": "Ocultar equivalencias",
  "page.adjustEquiv": "Ajustar equivalencias por régimen",
  "page.catBR": "Categoría Brasil (MAPA)",
  "page.catPT": "Categoría Portugal/UE (IVV)",
  "page.sample": "Muestra / Vino",
  "page.lot": "Lote",
  "page.responsible": "Responsable",
  "page.date": "Fecha del análisis",
  "page.tabsLabel": "Secciones del análisis",
  "page.toolbarHint": "Guarde o retome el trabajo — todo en su navegador, sin servidor.",
  "page.chemIntro":
    "Introduzca los datos brutos. Donde los regímenes usan unidades distintas, elija la unidad en que midió — la conversión es automática. Las etiquetas BR / PT-UE indican qué regímenes usan cada parámetro.",
  "page.footer":
    "Herramienta de apoyo a la decisión · no sustituye el boletín oficial de un laboratorio autorizado · límites legales provenientes del proyecto Vinho-Lab (MAPA IN 14/2018 y Reg. UE 1308/2013, 2019/934, 2018/848).",

  "tab.quimica": "Análisis químico",
  "tab.calculadora": "Calculadora de resultados",
  "tab.sensorial": "Análisis sensorial",
  "tab.resultado": "Resultado",

  "toolbar.export": "Exportar datos (.json)",
  "toolbar.import": "Importar datos",
  "toolbar.exported": "Sesión exportada.",
  "toolbar.imported": "Importado: {name}",
  "toolbar.importFail": "Error al importar el archivo.",

  "field.computed": "calculado",
  "field.auxiliar": "auxiliar",
  "field.unit": "unidad",
  "field.notEvaluated": "— no evaluado —",
  "field.absent": "Ausente",
  "field.present": "Presente",
  "field.calculatedTitle": "Valor obtenido en la pestaña Calculadora de resultados",
  "field.calculatedNote":
    "Calculado en la pestaña **Calculadora de resultados**. Editar aquí sustituye el valor.",

  "method.show": "Ver método OIV",
  "method.hide": "Ocultar método OIV",
  "method.principle": "Principio",
  "method.equipment": "Equipo",
  "method.reagents": "Reactivos",
  "method.procedure": "Procedimiento",
  "method.calculation": "Cálculo",
  "method.precision": "Precisión",
  "method.acceptance": "Aceptación regulatoria",

  "calc.intro":
    "Introduzca las lecturas brutas de la mesa de trabajo (volumen de titulante gastado, concentración del reactivo, volumen de muestra…). El valor final se calcula con la fórmula oficial OIV y pasa automáticamente a la pestaña **Análisis químico**, donde se valida frente a ambos regímenes.",

  "sensory.oivScore": "Puntuación OIV",
  "sensory.pts": "pts",
  "sensory.defectsTitle": "Defectos sensoriales",
  "sensory.defectsHint":
    "Marque los defectos percibidos. Cada uno incluye compuesto responsable, umbral de percepción y método de confirmación de laboratorio.",
  "sensory.compound": "Compuesto",
  "sensory.threshold": "Umbral",
  "sensory.lab": "Lab",
  "sensory.tastingNotes": "Notas de cata",
  "sensory.tastingPlaceholder": "Descriptores, observaciones, maridaje…",

  "result.exportVerdict": "Veredicto de exportabilidad",
  "result.vConformeBR": "Conforme como vino brasileño (MAPA)",
  "result.vConformePT": "Conforme como vino portugués/UE (IVV)",
  "result.vExportPTBR": "Exportable Portugal → Brasil",
  "result.vExportBRPT": "Exportable Brasil → Portugal/UE",
  "result.exportNote":
    "La exportabilidad considera solo los límites físico-químicos. La comercialización exige además documentación (certificado de origen, VI-1, boletín de laboratorio autorizado), etiquetado y prácticas enológicas conformes.",
  "result.blocks": "Bloqueos",
  "result.thParam": "Parámetro",
  "result.thValue": "Valor",
  "result.thLimit": "Límite",
  "result.thStatus": "Estado",
  "result.legalBasis": "Base legal",
  "result.borderline": "zona de incertidumbre",
  "result.borderlineTitle":
    "A ±{unc} {unit} del límite legal (margen {kind} OIV). Confirmar repitiendo el análisis.",
  "result.kindR": "de reproducibilidad R",
  "result.kindr": "de repetibilidad r",
  "result.marginNote":
    "**± margen de error:** incertidumbre analítica del método OIV (reproducibilidad R, o repetibilidad r cuando R no está documentada). Un valor señalado como «zona de incertidumbre» está a menos de un margen de error del límite legal: la conformidad no debe declararse sin repetir el análisis.",
  "result.molecularTitle": "SO₂ molecular activo",
  "result.molecularLine": "SO₂ molecular: **{v} mg/L** ({estado}) · fracción {frac} % · pH {ph}",
  "result.sensoryTitle": "Análisis sensorial (OIV)",
  "result.defects": "Defectos",
  "result.downloadMd": "Descargar Markdown (.md)",
  "result.downloadPdf": "Descargar PDF",
  "result.generatingPdf": "Generando PDF…",
  "result.pdfError": "No se pudo generar el PDF: {msg}",

  "status.Conforme": "Conforme",
  "status.Não conforme": "No conforme",
  "status.Sem limite": "Sin límite",
  "status.Não medido": "No medido",
  "status.overall.conformeNm": "Conforme (con parámetros no medidos)",

  "modal.title": "Vinho-Lab — primera versión",
  "modal.intro": "Bienvenido a **Vinho-Lab**, su compañero de laboratorio. Antes de empezar:",
  "modal.b1": "Es la **primera versión**, aún en evolución, y un proyecto **open source**.",
  "modal.b2": "**No se recogen métricas** ni datos personales — en respeto al **RGPD/GDPR**.",
  "modal.b3":
    "**Todo el cálculo se ejecuta en su navegador**: los valores que introduce se procesan en su dispositivo y **nada se envía ni se guarda**.",
  "modal.b4": "Al cerrar la página, **nada permanece**.",
  "modal.support":
    "Herramienta de **apoyo a la decisión**: no sustituye el boletín oficial de un laboratorio autorizado.",
  "modal.button": "Entendido, quiero continuar",

  "lang.label": "Idioma",
};

const zh: Dict = {
  "page.tagline":
    "您的实验室助手——以巴西（MAPA）和葡萄牙/欧盟（IVV）法规校验同一款葡萄酒并判断可出口性。100% 在您的浏览器中处理。",
  "page.wineType": "葡萄酒类型",
  "page.hideEquiv": "隐藏对应类别",
  "page.adjustEquiv": "按法规调整对应类别",
  "page.catBR": "巴西类别（MAPA）",
  "page.catPT": "葡萄牙/欧盟类别（IVV）",
  "page.sample": "样品 / 葡萄酒",
  "page.lot": "批次",
  "page.responsible": "负责人",
  "page.date": "分析日期",
  "page.tabsLabel": "分析板块",
  "page.toolbarHint": "保存或继续您的工作——全部在浏览器中，无需服务器。",
  "page.chemIntro":
    "请输入原始数据。当各法规使用不同单位时，选择您测量所用的单位——系统会自动换算。BR / PT-UE 标签表示各法规使用哪些参数。",
  "page.footer":
    "决策辅助工具 · 不能替代授权实验室的官方报告 · 法定限值来自 Vinho-Lab 项目（MAPA IN 14/2018 以及欧盟法规 1308/2013、2019/934、2018/848）。",

  "tab.quimica": "化学分析",
  "tab.calculadora": "结果计算器",
  "tab.sensorial": "感官分析",
  "tab.resultado": "结果",

  "toolbar.export": "导出数据 (.json)",
  "toolbar.import": "导入数据",
  "toolbar.exported": "会话已导出。",
  "toolbar.imported": "已导入：{name}",
  "toolbar.importFail": "导入文件失败。",

  "field.computed": "已计算",
  "field.auxiliar": "辅助",
  "field.unit": "单位",
  "field.notEvaluated": "— 未评估 —",
  "field.absent": "无",
  "field.present": "有",
  "field.calculatedTitle": "该值取自“结果计算器”选项卡",
  "field.calculatedNote": "在 **结果计算器** 选项卡中计算。在此编辑将覆盖该值。",

  "method.show": "查看 OIV 方法",
  "method.hide": "隐藏 OIV 方法",
  "method.principle": "原理",
  "method.equipment": "设备",
  "method.reagents": "试剂",
  "method.procedure": "步骤",
  "method.calculation": "计算",
  "method.precision": "精密度",
  "method.acceptance": "法规认可",

  "calc.intro":
    "请输入台面原始读数（滴定剂用量、试剂浓度、样品体积……）。最终值按 OIV 官方公式计算，并自动传送到 **化学分析** 选项卡，在那里针对两套法规进行校验。",

  "sensory.oivScore": "OIV 评分",
  "sensory.pts": "分",
  "sensory.defectsTitle": "感官缺陷",
  "sensory.defectsHint":
    "请勾选所感知的缺陷。每项均列出相关化合物、感知阈值和实验室确认方法。",
  "sensory.compound": "化合物",
  "sensory.threshold": "阈值",
  "sensory.lab": "实验室",
  "sensory.tastingNotes": "品评记录",
  "sensory.tastingPlaceholder": "描述、观察、餐酒搭配……",

  "result.exportVerdict": "可出口性判定",
  "result.vConformeBR": "作为巴西葡萄酒合规（MAPA）",
  "result.vConformePT": "作为葡萄牙/欧盟葡萄酒合规（IVV）",
  "result.vExportPTBR": "可出口 葡萄牙 → 巴西",
  "result.vExportBRPT": "可出口 巴西 → 葡萄牙/欧盟",
  "result.exportNote":
    "可出口性仅考虑理化限值。投放市场还需文件（原产地证书、VI-1、授权实验室报告）、标签以及合规的酿造工艺。",
  "result.blocks": "不合规项",
  "result.thParam": "参数",
  "result.thValue": "数值",
  "result.thLimit": "限值",
  "result.thStatus": "状态",
  "result.legalBasis": "法律依据",
  "result.borderline": "不确定区",
  "result.borderlineTitle":
    "距法定限值 ±{unc} {unit} 以内（OIV {kind} 余量）。请重复分析以确认。",
  "result.kindR": "再现性 R",
  "result.kindr": "重复性 r",
  "result.marginNote":
    "**± 误差余量：** OIV 方法的分析不确定度（再现性 R，若无 R 记录则用重复性 r）。被标记为「不确定区」的数值距法定限值不足一个误差余量：未重复分析前不应判定为合规。",
  "result.molecularTitle": "活性分子态 SO₂",
  "result.molecularLine": "分子态 SO₂：**{v} mg/L**（{estado}）· 比例 {frac} % · pH {ph}",
  "result.sensoryTitle": "感官分析（OIV）",
  "result.defects": "缺陷",
  "result.downloadMd": "下载 Markdown (.md)",
  "result.downloadPdf": "下载 PDF",
  "result.generatingPdf": "正在生成 PDF……",
  "result.pdfError": "无法生成 PDF：{msg}",

  "status.Conforme": "合规",
  "status.Não conforme": "不合规",
  "status.Sem limite": "无限值",
  "status.Não medido": "未测量",
  "status.overall.conformeNm": "合规（部分参数未测量）",

  "modal.title": "Vinho-Lab — 首个版本",
  "modal.intro": "欢迎使用 **Vinho-Lab**，您的实验室助手。开始之前：",
  "modal.b1": "这是 **首个版本**，仍在不断完善，是一个 **开源** 项目。",
  "modal.b2": "**不收集任何统计数据** 或个人资料——遵循 **GDPR**。",
  "modal.b3":
    "**所有计算都在您的浏览器中运行**：您输入的数值在本机处理，**不会上传或保存**。",
  "modal.b4": "关闭页面后，**不留下任何数据**。",
  "modal.support": "一款 **决策辅助** 工具：不能替代授权实验室的官方报告。",
  "modal.button": "我已了解，继续使用",

  "lang.label": "语言",
};

const DICT: Record<Locale, Dict> = { pt, en, es, zh };

/** Traduz uma chave para o idioma dado, com interpolação de {variáveis}. */
export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const table = DICT[locale] ?? DICT[DEFAULT_LOCALE];
  let s = table[key] ?? DICT[DEFAULT_LOCALE][key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}

/** Traduz um estado de validação (mapeia o texto canónico PT do motor). */
export function translateStatus(locale: Locale, status: string): string {
  if (status === "Conforme (com parâmetros não medidos)") {
    return translate(locale, "status.overall.conformeNm");
  }
  return translate(locale, `status.${status}`);
}
