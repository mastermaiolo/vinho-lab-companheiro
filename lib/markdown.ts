/**
 * Geração do boletim em Markdown a partir do modelo Report.
 */
import { Report, num, statusEmoji } from "./report";
import { RegimeReport } from "./validate";
import { CANONICAL } from "./canonical";
import { CALCULATORS } from "./calculators";

function memoriaCalculo(rep: Report): string[] {
  const blocks: string[] = [];
  for (const [id, m] of Object.entries(rep.measurements)) {
    if (!m.calc) continue;
    const calc = CALCULATORS[id];
    const label = CANONICAL[id]?.label ?? id;
    const leituras = (calc?.inputs ?? Object.keys(m.calc.inputs).map((k) => ({ key: k, label: k, suffix: "" })))
      .map((i) => {
        const v = m.calc!.inputs[i.key];
        return `${i.label} = ${v ?? "—"}${i.suffix ? " " + i.suffix : ""}`;
      })
      .join("; ");
    blocks.push(
      `- **${label}** (${m.calc.method}): \`${m.calc.formula}\` · ${leituras} → **${m.value !== null ? num(m.value) : "—"} ${m.unit}**`,
    );
  }
  if (blocks.length === 0) return [];
  return ["## Memória de cálculo", "", ...blocks, ""];
}

function regimeTable(r: RegimeReport): string {
  const rows = r.results.map((x) => {
    const lim =
      x.min !== null && x.max !== null
        ? `${x.min} – ${x.max}`
        : x.min !== null
          ? `≥ ${x.min}`
          : x.max !== null
            ? `≤ ${x.max}`
            : "—";
    const margem = x.value !== null && x.uncertainty != null && x.uncertainty > 0 ? ` ± ${num(x.uncertainty)}` : "";
    const val = x.value !== null ? `${num(x.value)}${margem}` : "—";
    const orig =
      x.inputUnit && x.inputUnit !== x.legalUnit && x.inputValue !== null
        ? ` _(introduzido: ${num(x.inputValue)} ${x.inputUnit})_`
        : "";
    const flag = x.borderline ? " ⚠️ _zona de incerteza_" : "";
    return `| ${statusEmoji(x.status)} ${x.parameter} | ${val} ${x.legalUnit}${orig}${flag} | ${lim} | ${x.method} |`;
  });
  const base = r.regulatoryBasis.length > 0 ? [`**Base legal:** ${r.regulatoryBasis.join(" · ")}`, ""] : [];
  return [
    `### ${r.regime === "BR" ? "🇧🇷 Brasil (MAPA)" : "🇵🇹🇪🇺 Portugal / União Europeia"} — ${r.categoryLabel}`,
    "",
    `**Veredicto:** ${r.summary.overall}`,
    "",
    "| Parâmetro | Valor | Limite legal | Método |",
    "|---|---|---|---|",
    ...rows,
    "",
    ...base,
  ].join("\n");
}

export function renderMarkdown(rep: Report): string {
  const L: string[] = [];
  L.push("# 🍷 Vinho-Lab — Boletim de análise consolidado");
  L.push("");
  L.push(`**Tipo de vinho:** ${rep.tipoLabel}`);
  L.push("");
  L.push("## Identificação");
  L.push("");
  L.push("| Campo | Valor |");
  L.push("|---|---|");
  L.push(`| Amostra | ${rep.meta.amostra || "—"} |`);
  L.push(`| Lote | ${rep.meta.lote || "—"} |`);
  L.push(`| Data | ${rep.meta.data || "—"} |`);
  L.push(`| Responsável | ${rep.meta.responsavel || "—"} |`);
  L.push(`| Gerado em | ${rep.geradoEm} |`);
  if (rep.meta.observacoes) {
    L.push("");
    L.push(`> ${rep.meta.observacoes}`);
  }
  L.push("");

  L.push("## Veredicto de exportabilidade");
  L.push("");
  L.push(`- **Conforme como vinho brasileiro (MAPA):** ${rep.verdict.conformeBR ? "✅ Sim" : "❌ Não"}`);
  L.push(`- **Conforme como vinho português/UE (IVV):** ${rep.verdict.conformePT ? "✅ Sim" : "❌ Não"}`);
  L.push(`- **Exportável Portugal → Brasil:** ${rep.verdict.exportPTtoBR ? "✅ Cumpre limites BR" : "❌ Bloqueado"}`);
  if (!rep.verdict.exportPTtoBR && rep.verdict.bloqueiosBR.length) {
    L.push(`  - Bloqueios (BR): ${rep.verdict.bloqueiosBR.join("; ")}`);
  }
  L.push(`- **Exportável Brasil → Portugal/UE:** ${rep.verdict.exportBRtoPT ? "✅ Cumpre limites UE" : "❌ Bloqueado"}`);
  if (!rep.verdict.exportBRtoPT && rep.verdict.bloqueiosPT.length) {
    L.push(`  - Bloqueios (UE): ${rep.verdict.bloqueiosPT.join("; ")}`);
  }
  L.push("");
  L.push(
    "> A exportabilidade aqui considera apenas os limites físico-químicos. " +
      "A colocação no mercado exige também documentação (certificado de origem, VI-1, boletim de laboratório autorizado), rotulagem e práticas enológicas conformes.",
  );
  L.push("");

  L.push("## Análise físico-química");
  L.push("");
  L.push(regimeTable(rep.br));
  L.push(regimeTable(rep.pt));
  L.push(
    "> **± margem de erro:** incerteza analítica do método OIV (reprodutibilidade R, ou repetibilidade r " +
      "quando R não está documentada). Parâmetros marcados com ⚠️ _zona de incerteza_ estão a menos de uma " +
      "margem de erro do limite legal — confirmar com repetição da análise antes de declarar conformidade.",
  );
  L.push("");

  L.push(...memoriaCalculo(rep));

  if (rep.molecular) {
    const a = rep.molecular;
    L.push("## SO₂ molecular ativo");
    L.push("");
    L.push(`- SO₂ livre: ${num(a.freeSo2)} mg/L · pH: ${num(a.ph, 2)}`);
    L.push(`- Fração molecular: ${num(a.fracaoMolecularPct, 3)} %`);
    L.push(`- SO₂ molecular: **${num(a.so2Molecular, 4)} mg/L** → _${a.estado}_`);
    L.push("");
    L.push("SO₂ livre necessário por alvo:");
    for (const [k, v] of Object.entries(a.so2LivreRecomendado)) {
      L.push(`- ${k}: ${num(v, 2)} mg/L`);
    }
    L.push("");
  }

  if (rep["doçura"]) {
    L.push("## Doçura");
    L.push("");
    L.push(`- ${rep["doçura"]!.tipo}: **${rep["doçura"]!.classificacao}**`);
    if (rep["doçura"]!.designacoes?.length) {
      L.push(`- Designações permitidas: ${rep["doçura"]!.designacoes!.join(", ")}`);
    }
    L.push("");
  }

  if (rep.sensory?.enabled) {
    const s = rep.sensory.score;
    L.push("## Análise sensorial (OIV — 100 pontos)");
    L.push("");
    L.push(`**Pontuação total: ${s.total} / ${s.maximo} — ${s.categoria}**`);
    L.push("");
    L.push("| Secção | Pontos |");
    L.push("|---|---|");
    for (const [sec, v] of Object.entries(s.seccoes)) {
      L.push(`| ${sec} | ${v.obtido} / ${v.maximo} |`);
    }
    L.push("");
    if (rep.sensory.defeitos.length) {
      L.push("### Defeitos assinalados");
      L.push("");
      for (const d of rep.sensory.defeitos) L.push(`- ${d}`);
      L.push("");
    }
    if (rep.sensory.notas) {
      L.push(`> ${rep.sensory.notas}`);
      L.push("");
    }
  }

  L.push("---");
  L.push("");
  L.push(
    "_Ferramenta de apoio à decisão. Não substitui o boletim oficial emitido por laboratório autorizado. " +
      "Limites legais: MAPA (IN 14/2018 e alt.) e Reg. UE 1308/2013, 2019/934, 2018/848 (via IVV)._",
  );

  return L.join("\n");
}
