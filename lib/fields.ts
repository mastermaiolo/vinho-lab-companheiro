/**
 * Determina, para o par de categorias selecionado (BR + PT/UE), o conjunto
 * ordenado de medições canónicas a apresentar no formulário, e em que regimes
 * cada uma é usada (para mostrar etiquetas/limites de referência).
 */
import { legislationOf } from "./legal";
import { CANONICAL, PARAM_TO_CANONICAL } from "./canonical";

const ORDER = [
  "tav_adquirido",
  "tav_total",
  "acucar",
  "acidez_total",
  "acidez_volatil",
  "so2_total",
  "so2_livre",
  "ph",
  "sobrepressao_co2",
  "extrato_seco_reduzido",
  "cinzas",
  "sulfatos",
  "cloretos",
  "metanol",
  "relacao_alcool_extrato",
  "cobre",
  "ferro",
  "chumbo",
  "cadmio",
  "arsenio",
  "ocratoxina",
  "pesticidas",
];

export interface FieldSpec {
  id: string;
  label: string;
  units: string[];
  help?: string;
  computed?: boolean;
  auxiliary?: boolean;
  dimension: string;
  usedBy: { br: boolean; pt: boolean };
}

export function fieldsFor(brCat: string | null, ptCat: string | null): FieldSpec[] {
  const used = new Map<string, { br: boolean; pt: boolean }>();

  const collect = (catKey: string | null, regime: "br" | "pt") => {
    if (!catKey) return;
    const leg = regime === "br" ? legislationOf("BR") : legislationOf("PT_EU");
    const cat = leg.categories[catKey];
    if (!cat) return;
    for (const p of cat.parameters) {
      const map = PARAM_TO_CANONICAL[p.name];
      if (!map) continue;
      const cur = used.get(map.canonical) ?? { br: false, pt: false };
      cur[regime] = true;
      used.set(map.canonical, cur);
    }
  };
  collect(brCat, "br");
  collect(ptCat, "pt");

  // Auxiliares sempre úteis: açúcar (escalão SO₂ + doçura), SO₂ livre e pH (molecular).
  for (const aux of ["acucar", "so2_livre", "ph"]) {
    if (!used.has(aux)) used.set(aux, { br: false, pt: false });
  }

  const ids = [...used.keys()].sort(
    (a, b) => (ORDER.indexOf(a) === -1 ? 99 : ORDER.indexOf(a)) - (ORDER.indexOf(b) === -1 ? 99 : ORDER.indexOf(b)),
  );

  return ids.map((id) => {
    const c = CANONICAL[id];
    return {
      id,
      label: c.label,
      units: c.inputUnits,
      help: c.help,
      computed: c.computed,
      auxiliary: c.auxiliary,
      dimension: c.dimension,
      usedBy: used.get(id)!,
    };
  });
}
