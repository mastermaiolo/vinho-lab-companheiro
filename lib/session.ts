/**
 * Serialização da sessão de trabalho (exportar/importar como ficheiro .json).
 *
 * Captura todo o estado preenchido pelo utilizador para que uma análise possa
 * ser guardada, retomada mais tarde ou partilhada — tudo no browser, sem
 * servidor. Não inclui resultados derivados (validação, relatório): esses são
 * recalculados a partir destes dados de entrada.
 */
"use client";
import { Measurements } from "./validate";
import { SampleMeta } from "./report";
import { unifiedById } from "./categories";
import { LEGISLATION_BR, LEGISLATION_PT_EU } from "./legal";

export const SESSION_VERSION = 1;
export const SESSION_KIND = "vinho-lab/session";

export interface SessionData {
  kind: typeof SESSION_KIND;
  version: number;
  tipoId: string;
  brCat: string;
  ptCat: string;
  meta: SampleMeta;
  measurements: Measurements;
  scores: Record<string, number>;
  defeitos: string[];
  notas: string;
}

export function buildSession(s: Omit<SessionData, "kind" | "version">): SessionData {
  return { kind: SESSION_KIND, version: SESSION_VERSION, ...s };
}

/**
 * Filtra o mapa de medições importado, mantendo só entradas com a forma correta
 * (value: número|null, unit: string). Entradas malformadas são descartadas em
 * vez de partirem a validação a jusante.
 */
function sanitizeMeasurements(raw: unknown): Measurements {
  if (typeof raw !== "object" || raw === null) return {};
  const out: Measurements = {};
  for (const [id, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v !== "object" || v === null) continue;
    const m = v as Record<string, unknown>;
    const value =
      m.value === null || (typeof m.value === "number" && Number.isFinite(m.value))
        ? (m.value as number | null)
        : null;
    const unit = typeof m.unit === "string" ? m.unit : "—";
    const meas: Measurements[string] = { value, unit };
    // Preserva a memória de cálculo apenas se tiver a forma esperada.
    if (
      typeof m.calc === "object" &&
      m.calc !== null &&
      typeof (m.calc as Record<string, unknown>).method === "string" &&
      typeof (m.calc as Record<string, unknown>).formula === "string" &&
      typeof (m.calc as Record<string, unknown>).inputs === "object"
    ) {
      const c = m.calc as Record<string, unknown>;
      meas.calc = {
        method: c.method as string,
        formula: c.formula as string,
        inputs: c.inputs as Record<string, number | null>,
      };
    }
    out[id] = meas;
  }
  return out;
}

export function downloadSession(data: SessionData, name: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `vinho-lab_${(name || "sessao").replace(/[^\w-]+/g, "_")}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Valida e normaliza um objeto desconhecido vindo de um ficheiro importado. */
export function parseSession(raw: unknown): SessionData {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Ficheiro inválido: não é um objeto JSON.");
  }
  const o = raw as Record<string, unknown>;
  if (o.kind !== SESSION_KIND) {
    throw new Error("Ficheiro não reconhecido como uma sessão do Vinho Lab Comp.");
  }
  const meta = (o.meta ?? {}) as Partial<SampleMeta>;

  // Resolve as categorias contra os registos conhecidos. Um ficheiro antigo ou
  // corrompido nunca deve partir a aplicação: caímos para valores seguros.
  const tipo = (typeof o.tipoId === "string" && unifiedById(o.tipoId) ? o.tipoId : "tinto");
  const u = unifiedById(tipo)!;
  const brCat =
    typeof o.brCat === "string" && LEGISLATION_BR.categories[o.brCat]
      ? o.brCat
      : u.br ?? "vinho_fino_tinto";
  const ptCat =
    typeof o.ptCat === "string" && LEGISLATION_PT_EU.categories[o.ptCat]
      ? o.ptCat
      : u.ptEu ?? "vinho_tinto";

  return {
    kind: SESSION_KIND,
    version: typeof o.version === "number" ? o.version : SESSION_VERSION,
    tipoId: tipo,
    brCat,
    ptCat,
    meta: {
      amostra: meta.amostra ?? "",
      lote: meta.lote ?? "",
      data: meta.data ?? "",
      responsavel: meta.responsavel ?? "",
      observacoes: meta.observacoes ?? "",
    },
    measurements: sanitizeMeasurements(o.measurements),
    scores: (o.scores ?? {}) as Record<string, number>,
    defeitos: Array.isArray(o.defeitos) ? (o.defeitos as string[]) : [],
    notas: typeof o.notas === "string" ? o.notas : "",
  };
}
