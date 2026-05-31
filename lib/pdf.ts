/**
 * Geração do boletim em PDF com pdfmake (no browser). Cores por estado de
 * conformidade. A fonte por defeito (Roboto) cobre acentos PT mas não os
 * subscritos químicos; por isso o texto do PDF é sanitizado (SO₂ → SO2 etc.).
 */
"use client";
import type { TDocumentDefinitions, Content, TableCell } from "pdfmake/interfaces";
import { Report, num } from "./report";
import { RegimeReport, Status } from "./validate";
import { CANONICAL } from "./canonical";
import { CALCULATORS } from "./calculators";

const PRIMARY = "#4a0e0e";
const SECONDARY = "#6b1414";

const SUB: Record<string, string> = {
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5",
  "₆": "6", "₇": "7", "₈": "8", "₉": "9",
  "²": "2", "³": "3", "µ": "u", "≥": ">=", "≤": "<=", "–": "-",
};
function s(text: string): string {
  return text.replace(/[₀-₉²³µ≥≤–]/g, (c) => SUB[c] ?? c);
}

function statusFill(status: Status): string | undefined {
  switch (status) {
    case "Conforme":
      return "#e7f5e9";
    case "Não conforme":
      return "#fdecec";
    case "Sem limite":
      return "#f2f2f2";
    default:
      return "#fafafa";
  }
}

function limitStr(min: number | null, max: number | null): string {
  if (min !== null && max !== null) return `${min} - ${max}`;
  if (min !== null) return `>= ${min}`;
  if (max !== null) return `<= ${max}`;
  return "-";
}

function regimeBlock(r: RegimeReport): Content {
  const title = r.regime === "BR" ? "Brasil (MAPA)" : "Portugal / Uniao Europeia (IVV)";
  const body: TableCell[][] = [
    [
      { text: "Parametro", style: "th" },
      { text: "Valor", style: "th" },
      { text: "Limite legal", style: "th" },
      { text: "Estado", style: "th" },
    ],
    ...r.results.map((x): TableCell[] => {
      const fill = statusFill(x.status);
      const margem = x.value !== null && x.uncertainty != null && x.uncertainty > 0 ? ` +/- ${num(x.uncertainty)}` : "";
      const val = x.value !== null ? `${num(x.value)}${margem} ${s(x.legalUnit)}` : "-";
      const estado = x.borderline ? `${x.status} (zona de incerteza)` : x.status;
      return [
        { text: s(x.parameter), fillColor: fill, fontSize: 8 },
        { text: s(val), fillColor: fill, fontSize: 8 },
        { text: s(limitStr(x.min, x.max)), fillColor: fill, fontSize: 8 },
        { text: s(estado), fillColor: fill, fontSize: 8 },
      ];
    }),
  ];
  const stack: Content[] = [
    { text: `${s(title)} - ${s(r.categoryLabel)}`, style: "h2", margin: [0, 10, 0, 2] },
    { text: `Veredicto: ${s(r.summary.overall)}`, italics: true, fontSize: 9, margin: [0, 0, 0, 4] },
    {
      table: { headerRows: 1, widths: ["*", "auto", "auto", "auto"], body },
      layout: { hLineWidth: () => 0.4, vLineWidth: () => 0.4, hLineColor: () => "#ddd", vLineColor: () => "#ddd" },
    },
  ];
  if (r.regulatoryBasis.length > 0) {
    stack.push({ text: s(`Base legal: ${r.regulatoryBasis.join(" | ")}`), fontSize: 7, color: "#666", margin: [0, 2, 0, 0] });
  }
  return { stack };
}

function buildDocDefinition(rep: Report): TDocumentDefinitions {
  const v = rep.verdict;
  const yn = (b: boolean) => (b ? "SIM" : "NAO");

  const content: Content[] = [
    { text: "Vinho-Lab - Boletim de analise consolidado", style: "h1" },
    { text: s(`Tipo de vinho: ${rep.tipoLabel}`), margin: [0, 0, 0, 8], fontSize: 10 },
    {
      table: {
        widths: ["auto", "*"],
        body: [
          [{ text: "Amostra", style: "tk" }, rep.meta.amostra || "-"],
          [{ text: "Lote", style: "tk" }, rep.meta.lote || "-"],
          [{ text: "Data", style: "tk" }, rep.meta.data || "-"],
          [{ text: "Responsavel", style: "tk" }, s(rep.meta.responsavel || "-")],
          [{ text: "Gerado em", style: "tk" }, rep.geradoEm],
        ],
      },
      layout: "noBorders",
      fontSize: 9,
      margin: [0, 0, 0, 10],
    },
    { text: "Veredicto de exportabilidade", style: "h2" },
    {
      ul: [
        `Conforme como vinho brasileiro (MAPA): ${yn(v.conformeBR)}`,
        `Conforme como vinho portugues/UE (IVV): ${yn(v.conformePT)}`,
        `Exportavel Portugal -> Brasil (limites BR): ${yn(v.exportPTtoBR)}` +
          (!v.exportPTtoBR && v.bloqueiosBR.length ? ` | Bloqueios: ${s(v.bloqueiosBR.join("; "))}` : ""),
        `Exportavel Brasil -> Portugal/UE (limites UE): ${yn(v.exportBRtoPT)}` +
          (!v.exportBRtoPT && v.bloqueiosPT.length ? ` | Bloqueios: ${s(v.bloqueiosPT.join("; "))}` : ""),
      ],
      fontSize: 9,
      margin: [0, 0, 0, 6],
    },
    {
      text: "A exportabilidade considera apenas limites fisico-quimicos. A colocacao no mercado exige documentacao, rotulagem e praticas enologicas conformes.",
      italics: true,
      fontSize: 8,
      color: "#666",
      margin: [0, 0, 0, 8],
    },
    { text: "Analise fisico-quimica", style: "h2" },
    regimeBlock(rep.br),
    regimeBlock(rep.pt),
  ];

  const memoria = Object.entries(rep.measurements).filter(([, m]) => m.calc);
  if (memoria.length) {
    content.push(
      { text: "Memoria de calculo", style: "h2", margin: [0, 10, 0, 2] },
      {
        ul: memoria.map(([id, m]) => {
          const calc = CALCULATORS[id];
          const label = CANONICAL[id]?.label ?? id;
          const leituras = (calc?.inputs ?? Object.keys(m.calc!.inputs).map((k) => ({ key: k, label: k, suffix: "" })))
            .map((i) => `${i.label} = ${m.calc!.inputs[i.key] ?? "-"}${i.suffix ? " " + i.suffix : ""}`)
            .join("; ");
          return s(`${label} (${m.calc!.method}): ${m.calc!.formula} | ${leituras} -> ${m.value !== null ? num(m.value) : "-"} ${m.unit}`);
        }),
        fontSize: 8,
      },
    );
  }

  if (rep.molecular) {
    const a = rep.molecular;
    content.push(
      { text: "SO2 molecular ativo", style: "h2", margin: [0, 10, 0, 2] },
      {
        text: `SO2 livre ${num(a.freeSo2)} mg/L | pH ${num(a.ph, 2)} | fracao ${num(a.fracaoMolecularPct, 3)}% | SO2 molecular ${num(a.so2Molecular, 4)} mg/L (${s(a.estado)})`,
        fontSize: 9,
      },
    );
  }

  if (rep.sensory?.enabled) {
    const sc = rep.sensory.score;
    content.push(
      { text: "Analise sensorial (OIV - 100 pontos)", style: "h2", margin: [0, 10, 0, 2] },
      { text: s(`Total: ${sc.total} / ${sc.maximo} - ${sc.categoria}`), bold: true, fontSize: 10 },
      {
        ul: Object.entries(sc.seccoes).map(([k, val]) => `${s(k)}: ${val.obtido} / ${val.maximo}`),
        fontSize: 9,
      },
    );
    if (rep.sensory.defeitos.length) {
      content.push({ text: "Defeitos assinalados: " + s(rep.sensory.defeitos.join("; ")), fontSize: 9, margin: [0, 4, 0, 0] });
    }
  }

  content.push({
    text: "Ferramenta de apoio a decisao. Nao substitui o boletim oficial de laboratorio autorizado.",
    italics: true,
    fontSize: 8,
    color: "#888",
    margin: [0, 16, 0, 0],
  });

  return {
    content,
    defaultStyle: { font: "Roboto", fontSize: 10, color: "#222" },
    styles: {
      h1: { fontSize: 18, bold: true, color: PRIMARY, margin: [0, 0, 0, 6] },
      h2: { fontSize: 13, bold: true, color: SECONDARY, margin: [0, 6, 0, 4] },
      th: { bold: true, fontSize: 8, color: "#fff", fillColor: PRIMARY },
      tk: { bold: true, color: SECONDARY },
    },
    pageMargins: [40, 40, 40, 40],
    info: { title: `Boletim ${rep.meta.lote || rep.meta.amostra || "Vinho-Lab"}` },
  };
}

export async function downloadPdf(rep: Report): Promise<void> {
  const pdfMakeMod = await import("pdfmake/build/pdfmake");
  const pdfFontsMod = await import("pdfmake/build/vfs_fonts");
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const pdfMake: any = (pdfMakeMod as any).default ?? pdfMakeMod;
  const fonts: any = (pdfFontsMod as any).default ?? pdfFontsMod;
  const vfs = fonts.vfs ?? fonts.pdfMake?.vfs ?? pdfMake.vfs;
  if (vfs) pdfMake.vfs = vfs;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const filename = `boletim_${(rep.meta.lote || rep.meta.amostra || "vinho-lab").replace(/[^\w-]+/g, "_")}.pdf`;
  pdfMake.createPdf(buildDocDefinition(rep)).download(filename);
}
