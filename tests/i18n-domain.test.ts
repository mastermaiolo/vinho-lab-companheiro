/**
 * Cobertura de tradução de domínio: garante que TODAS as strings PT-PT mostradas
 * ao utilizador têm tradução en/es/zh. Apanha falhas silenciosas (chave divergente
 * por 1 carácter → fallback PT sem erro de build).
 *
 * Não traduzimos: valores legais, limites numéricos nem fórmulas. Por isso a
 * recolha abaixo só apanha rótulos/ajudas/notas/prosa efetivamente passados por td().
 */
import { test, expect, describe } from "bun:test";
import { hasDomainEntry } from "../lib/i18n-domain";
import { CANONICAL } from "../lib/canonical";
import { CALCULATORS } from "../lib/calculators";
import { UNIFIED_CATEGORIES } from "../lib/categories";
import { SENSORY_OIV, DEFECTS } from "../lib/sensory";
import brLeg from "../data/legal/legislation_br.json";
import ptLeg from "../data/legal/legislation_pt_eu.json";
import methodsJson from "../data/legal/methods.json";

type Item = { src: string; pt: string };
const items: Item[] = [];
const seen = new Set<string>();
function add(pt: unknown, src: string) {
  if (typeof pt !== "string") return;
  const s = pt.trim();
  if (!s) return;
  const k = src + "::" + s;
  if (seen.has(k)) return;
  seen.add(k);
  items.push({ src, pt: s });
}

// 1. Parâmetros canónicos: rótulo + ajuda
for (const def of Object.values(CANONICAL)) {
  add(def.label, "CANONICAL.label");
  add(def.help, "CANONICAL.help");
}

// 2. Calculadoras: nota + rótulos de inputs (NÃO fórmula/unidade)
for (const calc of Object.values(CALCULATORS)) {
  add(calc.note, "CALCULATORS.note");
  for (const i of calc.inputs) add(i.label, "CALCULATORS.input.label");
}

// 3. Categorias unificadas
for (const c of UNIFIED_CATEGORIES) add(c.label, "UNIFIED_CATEGORIES.label");

// 4. Legislação BR + PT/UE: rótulo de categoria + nome de parâmetro (coluna da tabela)
for (const [tag, leg] of [["BR", brLeg], ["PT", ptLeg]] as const) {
  const cats = (leg as { categories: Record<string, { label?: string; parameters?: { name?: string }[] }> }).categories;
  for (const cat of Object.values(cats)) {
    add(cat.label, `LEG_${tag}.category.label`);
    for (const p of cat.parameters ?? []) add(p.name, `LEG_${tag}.parameter.name`);
  }
}

// 5. Sensorial OIV: secções + critérios
for (const section of Object.values(SENSORY_OIV)) {
  add(section.label, "SENSORY_OIV.section.label");
  for (const c of section.criteria) add(c.label, "SENSORY_OIV.criterion.label");
}

// 6. Defeitos: nome + todos os campos descritivos renderizados
for (const [name, info] of Object.entries(DEFECTS)) {
  add(name, "DEFECTS.name");
  add(info.descricao, "DEFECTS.descricao");
  add(info.compostos, "DEFECTS.compostos");
  add(info["limite_perceção"], "DEFECTS.limite_perceção");
  add(info["deteção_laboratorial"], "DEFECTS.deteção_laboratorial");
}

// 7. Estados moleculares de SO₂ (literais em chemistry.ts) + medalhas OIV (sensory.ts)
for (const s of ["Proteção robusta", "Adequado (controla Brettanomyces)", "Proteção mínima", "Insuficiente"])
  add(s, "molecular.estado");
for (const s of ["Grande Medalha de Ouro", "Medalha de Ouro", "Medalha de Prata", "Medalha de Bronze", "Sem distinção"])
  add(s, "sensory.medalha");

// 8. Métodos OIV: name/principle/equipment/reagents/procedure/calculation/precision/regulatory_acceptance
const methods = methodsJson as unknown as Record<string, Record<string, unknown>>;
for (const m of Object.values(methods)) {
  add(m.name, "METHOD.name");
  add(m.principle, "METHOD.principle");
  add(m.calculation, "METHOD.calculation");
  add(m.precision, "METHOD.precision");
  add(m.regulatory_acceptance, "METHOD.regulatory_acceptance");
  for (const k of ["equipment", "reagents", "procedure"] as const) {
    const arr = m[k] as unknown;
    if (Array.isArray(arr)) for (const x of arr) add(x, `METHOD.${k}`);
  }
}

describe("cobertura de tradução de domínio (en/es/zh)", () => {
  test(`recolheu um número não-trivial de strings PT (${items.length})`, () => {
    expect(items.length).toBeGreaterThan(200);
  });

  for (const { src, pt } of items) {
    const preview = pt.length > 60 ? pt.slice(0, 57) + "…" : pt;
    test(`[${src}] ${preview}`, () => {
      expect(hasDomainEntry(pt)).toBe(true);
    });
  }
});
