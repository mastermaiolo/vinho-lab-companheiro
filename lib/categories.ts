/**
 * Categorias unificadas: o utilizador escolhe UM "tipo de vinho" que mapeia para
 * a categoria correspondente em cada regime (BR e PT/UE). As equivalências podem
 * ser ajustadas manualmente na UI, já que "vinho de mesa" / "vinho fino" (BR) e
 * as DOP portuguesas não têm correspondência 1:1.
 *
 * `br: null` ou `ptEu: null` => o tipo não tem categoria específica prevista
 * nesse regime (valida-se pela categoria genérica mais próxima, ajustável).
 */
export interface UnifiedCategory {
  id: string;
  label: string;
  br: string | null;
  ptEu: string | null;
  nota?: string;
}

export const UNIFIED_CATEGORIES: UnifiedCategory[] = [
  { id: "tinto", label: "Tinto tranquilo", br: "vinho_fino_tinto", ptEu: "vinho_tinto" },
  { id: "branco_rose", label: "Branco / Rosé tranquilo", br: "vinho_fino_branco_rose", ptEu: "vinho_branco_rose" },
  {
    id: "mesa_tinto",
    label: "Tinto de mesa (uvas americanas/híbridas)",
    br: "vinho_mesa_tinto",
    ptEu: "vinho_tinto",
    nota: "A UE não distingue \"mesa\"; valida-se contra os limites de vinho tinto tranquilo.",
  },
  {
    id: "mesa_branco_rose",
    label: "Branco/Rosé de mesa (uvas americanas/híbridas)",
    br: "vinho_mesa_branco_rose",
    ptEu: "vinho_branco_rose",
    nota: "A UE não distingue \"mesa\"; valida-se contra os limites de vinho branco/rosé tranquilo.",
  },
  {
    id: "doce",
    label: "Doce / Colheita tardia (açúcares > 45 g/L)",
    br: "vinho_fino_branco_rose",
    ptEu: "vinho_doce",
    nota: "O PIQ brasileiro não tem categoria \"doce\" autónoma; valida-se como vinho fino (ajustável).",
  },
  { id: "espumante", label: "Espumante de qualidade", br: "espumante", ptEu: "espumante_qualidade" },
  { id: "espumante_nq", label: "Espumante (não-qualidade)", br: "espumante", ptEu: "espumante" },
  { id: "frisante", label: "Frisante", br: "vinho_frisante", ptEu: "frisante" },
  { id: "licoroso", label: "Licoroso", br: "vinho_licoroso", ptEu: "licoroso" },
  {
    id: "porto",
    label: "Vinho do Porto (DOP)",
    br: "vinho_licoroso",
    ptEu: "porto",
    nota: "No Brasil enquadra-se como vinho licoroso importado.",
  },
  {
    id: "madeira",
    label: "Madeira (DOP)",
    br: "vinho_licoroso",
    ptEu: "madeira",
    nota: "No Brasil enquadra-se como vinho licoroso importado.",
  },
  {
    id: "moscatel",
    label: "Moscatel de Setúbal (DOP)",
    br: "vinho_licoroso",
    ptEu: "moscatel_setubal",
    nota: "No Brasil enquadra-se como vinho licoroso importado.",
  },
  { id: "bio_tinto", label: "Biológico / Orgânico tinto", br: "vinho_organico", ptEu: "biologico_tinto" },
  { id: "bio_branco_rose", label: "Biológico / Orgânico branco/rosé", br: "vinho_organico", ptEu: "biologico_branco_rose" },
];

export function unifiedById(id: string): UnifiedCategory | undefined {
  return UNIFIED_CATEGORIES.find((c) => c.id === id);
}
