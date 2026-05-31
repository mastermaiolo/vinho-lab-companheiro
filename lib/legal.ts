/**
 * Carregamento tipado dos dados legais exportados do projeto Python Vinho-Lab.
 *
 * Fonte única de verdade: os JSON em data/legal/ são gerados por
 * `tools/export_data.py` no repositório vinho-lab (Python). NÃO editar à mão —
 * para atualizar um limite legal, alterar o Python e re-exportar.
 */
import legislationBr from "@/data/legal/legislation_br.json";
import legislationPtEu from "@/data/legal/legislation_pt_eu.json";
import methods from "@/data/legal/methods.json";
import importExport from "@/data/legal/import_export.json";
import chemistryConstants from "@/data/legal/chemistry_constants.json";

export interface ParamDef {
  name: string;
  unit: string;
  min: number | null;
  max: number | null;
  method?: string;
  method_ref?: string;
  note?: string;
}

export interface CategoryDef {
  label: string;
  definition: string;
  parameters: ParamDef[];
}

export interface Legislation {
  regulator: string;
  regulatory_basis: string[];
  import_notes: string;
  categories: Record<string, CategoryDef>;
}

export const LEGISLATION_BR = legislationBr as unknown as Legislation;
export const LEGISLATION_PT_EU = legislationPtEu as unknown as Legislation;

export interface ImportExportRoute {
  rota: string;
  autoridade_destino: string;
  base_legal_destino: string[];
  [key: string]: unknown;
}

export const IMPORT_EXPORT = importExport as unknown as {
  PT_para_BR: ImportExportRoute;
  BR_para_PT_UE: ImportExportRoute;
};

export const METHODS = methods as unknown as Record<
  string,
  Record<string, unknown>
>;

export const CHEMISTRY = chemistryConstants as unknown as {
  PKA1_SULFUROUS: number;
  MOLECULAR_SO2_TARGETS: Record<string, number>;
  SPARKLING_SWEETNESS: {
    pt: string;
    outros?: string;
    min: number;
    max: number | null;
    nota?: string;
  }[];
  PORT_SWEETNESS: { pt: string; min: number; max: number | null }[];
  MADEIRA_STYLES: { casta: string; "doçura": string; perfil: string }[];
};

export type Regime = "BR" | "PT_EU";

export function legislationOf(regime: Regime): Legislation {
  return regime === "BR" ? LEGISLATION_BR : LEGISLATION_PT_EU;
}
