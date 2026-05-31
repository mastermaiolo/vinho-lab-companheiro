/* Verificação rápida da lógica. Correr: bun scripts/smoke.ts */
import { convert } from "../lib/canonical";
import { validateRegime, exportVerdict, type Measurements } from "../lib/validate";
import { classifyPortSweetness, assessMolecularSo2 } from "../lib/chemistry";

let pass = 0;
let fail = 0;
function ok(name: string, cond: boolean, extra = "") {
  if (cond) {
    pass++;
  } else {
    fail++;
    console.log(`  ✗ ${name} ${extra}`);
  }
}
function near(a: number, b: number, tol = 1e-6) {
  return Math.abs(a - b) < tol;
}

// --- Conversões ---
ok("20 meq/L acético ≈ 1,201 g/L", near(convert(20, "meq/L (acético)", "g/L (acético)"), 1.20104, 1e-4),
  String(convert(20, "meq/L (acético)", "g/L (acético)")));
ok("1,2 g/L acético ≈ 19,98 meq/L", near(convert(1.2, "g/L (acético)", "meq/L (acético)"), 19.9827, 1e-3),
  String(convert(1.2, "g/L (acético)", "meq/L (acético)")));
ok("55 meq/L tartárico ≈ 4,127 g/L", near(convert(55, "meq/L (tartárico)", "g/L (tartárico)"), 4.12742, 1e-3));
ok("1 atm = 1,01325 bar", near(convert(1, "atm", "bar"), 1.01325));

// --- Validação BR (vinho fino tinto) com acidez introduzida em g/L ---
const m: Measurements = {
  tav_adquirido: { value: 13, unit: "% vol" },
  acidez_total: { value: 5.5, unit: "g/L (tartárico)" }, // ≈ 73 meq/L → dentro 55-130
  acidez_volatil: { value: 0.6, unit: "g/L (acético)" }, // ≈ 10 meq/L → dentro
  so2_total: { value: 120, unit: "mg/L" },
  metanol: { value: 100, unit: "mg/L" },
  cobre: { value: 0.3, unit: "mg/L" },
  chumbo: { value: 0.05, unit: "mg/L" },
  extrato_seco_reduzido: { value: 22, unit: "g/L" },
  cinzas: { value: 2, unit: "g/L" },
  sulfatos: { value: 0.5, unit: "g/L" },
  cloretos: { value: 0.1, unit: "g/L" },
  acucar: { value: 2, unit: "g/L" },
};
const br = validateRegime("BR", "vinho_fino_tinto", m);
ok("BR fino tinto: sem não-conformes", br.summary["Não conforme"] === 0,
  JSON.stringify(br.results.filter((r) => r.status === "Não conforme").map((r) => `${r.parameter}=${r.value}`)));
const relacao = br.results.find((r) => r.parameter.startsWith("Relação"));
ok("BR: relação álcool/extrato calculada", relacao !== undefined && relacao.value !== null);

// --- PT/UE tinto: SO₂ escalão por açúcar (açúcar=2 → usa o <5: max 150) ---
const pt = validateRegime("PT_EU", "vinho_tinto", m);
const so2pt = pt.results.filter((r) => r.parameter.includes("SO₂"));
ok("PT tinto: só 1 escalão SO₂ aplicável (açúcar<5)", so2pt.length === 1, JSON.stringify(so2pt.map((r) => r.parameter)));

// --- Exportabilidade ---
const v = exportVerdict(br, pt);
ok("export verdict tem campos", typeof v.exportPTtoBR === "boolean" && typeof v.exportBRtoPT === "boolean");

// --- Doçura do Porto (fronteiras) ---
// faixas inclusivas, 1.ª correspondência (fiel ao Python): 40→Extra-Seco, 65→Seco
ok("Porto 40 g/L = Extra-Seco", classifyPortSweetness(40) === "Extra-Seco", classifyPortSweetness(40));
ok("Porto 65 = Seco", classifyPortSweetness(65) === "Seco", classifyPortSweetness(65));
ok("Porto 130 = Doce", classifyPortSweetness(130) === "Doce", classifyPortSweetness(130));
ok("Porto 150 = Muito Doce", classifyPortSweetness(150).startsWith("Muito Doce"));

// --- SO₂ molecular reproduz alvo ---
const a = assessMolecularSo2(30, 3.5);
const need = a.so2LivreRecomendado["Controlo de Brettanomyces"];
const back = assessMolecularSo2(need, 3.5);
ok("SO₂ livre recomendado reproduz alvo 0,625", near(back.so2Molecular, 0.625, 1e-6), String(back.so2Molecular));

console.log(`\n${pass} passaram, ${fail} falharam`);
if (fail > 0) process.exit(1);
