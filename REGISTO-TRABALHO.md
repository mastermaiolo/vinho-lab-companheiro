# Vinho Lab Comp — Registo do trabalho

> Companheiro de laboratório que valida **o mesmo vinho** contra dois regimes —
> **Brasil (MAPA, IN 14/2018)** e **Portugal/UE (IVV, Reg. UE 1308/2013, 2019/934,
> 2018/848)** — e indica a **exportabilidade**. Processamento **100 % no navegador**:
> sem servidor, sem analítica, coerente com o RGPD.

- **Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · pnpm.
- **Idioma da interface:** Português europeu (PT-PT).
- **Tema:** `--primary #4a0e0e`, `--secondary #6b1414`.

---

## Princípio inviolável

**Nunca inventar valores legais nem fórmulas.** Todos os limites e fórmulas
analíticas vêm de JSON exportado do projeto Python (`data/legal/*.json`):

- Limites por categoria/regime → validação.
- Fórmulas dos métodos OIV (`data/legal/methods.json`) → calculadoras e painéis.

Onde a OIV usa **tabelas de densidade** sem fórmula fechada (TAV, extrato seco
reduzido, açúcares por Luff-Schoorl), **não** foi criada calculadora — manteve-se
a entrada direta do valor, por não existir fonte autorizada para transcrever
essas tabelas.

---

## Funcionalidades implementadas nesta fase

### 1. Calculadoras "leituras brutas → valor final"
Em vez de só converter unidades, a app calcula o **valor final** a partir das
leituras de bancada (volume de titulante, concentração do reagente, volume de
amostra). O resultado flui automaticamente para a aba **Análise química**, onde é
validado contra os dois regimes.

Parâmetros com calculadora (fórmula OIV verbatim):

| Parâmetro | Método OIV | Fórmula | Saída |
|---|---|---|---|
| Acidez total | OIV-MA-AS313-01 | (V × N × 75) ÷ V_amostra | g/L (tartárico) |
| Acidez volátil | OIV-MA-AS313-02 | (V × N × 60) ÷ V_amostra | g/L (acético) |
| SO₂ total | OIV-MA-AS323-04B | (V × N × 32 × 1000) ÷ V_amostra | mg/L |
| SO₂ livre | OIV-MA-AS323-04B | (V × N × 32 × 1000) ÷ V_amostra | mg/L |
| Cloretos | OIV-MA-AS321-02 | (V × N × 58,44) ÷ V_amostra | g/L |
| Cinzas | OIV-MA-AS2-04 | (m ÷ V_amostra) × 1000 | g/L |
| Sulfatos | OIV-MA-AS321-05A | (m_BaSO₄ × 0,7464 ÷ V_amostra) × 1000 | g/L |
| Metanol, Cu, Pb, Fe, Cd, As, Ocratoxina | (instrumentais) | leitura × fator de diluição | mg/L · µg/kg |

Os coeficientes não são inventados: `75 = ½ M(tartárico)`, `60 = M(acético)`,
`32 = ½ M(SO₂)`, `58,44 = M(NaCl)`, `0,7464 = BaSO₄→K₂SO₄`.

### 2. Painel "Ver método OIV"
Em cada parâmetro, um painel expansível mostra o método completo (princípio,
equipamento, reagentes, procedimento, cálculo, precisão, aceitação regulatória),
lido de `data/legal/methods.json`.

### 3. Quarta aba — "Calculadora de resultados"
Aba dedicada que agrupa todas as calculadoras. As leituras ficam guardadas no
estado partilhado (`measurements`), pelo que sobrevivem à troca de abas. O valor
final aparece na Análise química com um *badge* verde "calculado".

### 4. Importar / Exportar sessão (em todas as abas)
Barra fixa acima dos separadores (visível nas 4 abas) que exporta toda a sessão
para `.json` e a reimporta mais tarde — tudo no navegador.

### 5. Memória de cálculo nos relatórios
Os relatórios **Markdown** e **PDF** passaram a incluir uma secção "Memória de
cálculo": para cada parâmetro calculado, lista método, fórmula, leituras e
resultado.

---

## Mapa de ficheiros

| Ficheiro | Estado | Papel |
|---|---|---|
| `lib/calculators.ts` | criado | Calculadoras OIV (fórmula + inputs + `compute`). |
| `lib/methods.ts` | criado | Acesso tipado a `methods.json`; mapa canónico→método. |
| `lib/session.ts` | criado | Serialização da sessão (export/import) com validação. |
| `app/components/MethodPanel.tsx` | criado | Painel expansível "Ver método OIV". |
| `app/components/CalculatorTab.tsx` | criado | UI da aba Calculadora de resultados. |
| `app/components/DataToolbar.tsx` | criado | Botões Exportar/Importar + estado. |
| `lib/validate.ts` | alterado | `Measurement.calc?` (método/fórmula/inputs). |
| `app/components/Field.tsx` | alterado | Entrada direta + badge "calculado" + MethodPanel. |
| `app/page.tsx` | alterado | 4 abas + DataToolbar + `applySession`. |
| `lib/markdown.ts` | alterado | "Memória de cálculo" + base legal + margens de erro. |
| `lib/pdf.ts` | alterado | "Memoria de calculo" + base legal + margens de erro. |
| `lib/precision.ts` | criado (Fase 2) | Figuras r/R do OIV → margem de erro por parâmetro. |
| `lib/plausibility.ts` | criado (Fase 2) | Faixas físico-químicas típicas (sanity checks). |
| `app/error.tsx` | criado (Fase 2) | Fronteira de erro de rota (anti white-screen). |
| `app/global-error.tsx` | criado (Fase 2) | Fronteira de erro do layout raiz. |
| `next.config.ts` | alterado (Fase 2) | CSP + cabeçalhos de segurança. |
| `tests/*.test.ts` | criado (Fase 2) | Suite `bun test` (46 testes). |

---

## Código-chave

### `lib/validate.ts` — extensão de `Measurement`
```ts
export interface Measurement {
  value: number | null;
  unit: string;
  calc?: { method: string; formula: string; inputs: Record<string, number | null> };
}
```

### `lib/calculators.ts` (núcleo)
```ts
export interface Calculator {
  method: string;                                   // código OIV
  formula: string;                                  // fórmula legível
  outputUnit: string;                               // = 1.ª unidade do CANONICAL
  inputs: CalcInputDef[];
  compute: (v: Record<string, number | null>) => number | null;
  note?: string;
}

// Titulação genérica: resultado = (V × N × fator) / V_amostra.
function titration(fator: number): Calculator["compute"] {
  return (v) => {
    const V = num(v.V), N = num(v.N), Vam = num(v.Vam);
    if (V === null || N === null || Vam === null || Vam === 0) return null;
    return (V * N * fator) / Vam;
  };
}

export const CALCULATORS: Record<string, Calculator> = {
  acidez_total: {
    method: "OIV-MA-AS313-01",
    formula: "(V × N × 75) ÷ V_amostra",
    outputUnit: "g/L (tartárico)",
    inputs: [
      { key: "V", label: "Volume de titulante gasto", suffix: "mL" },
      { key: "N", label: "Concentração da NaOH", default: 0.1, suffix: "mol/L" },
      { key: "Vam", label: "Volume de amostra", default: 10, suffix: "mL" },
    ],
    compute: titration(75),
  },
  // … acidez_volatil, so2_total, so2_livre, cloretos, cinzas, sulfatos,
  //    metanol, cobre, chumbo, ferro, cadmio, arsenio, ocratoxina
};

export function calculatorFor(id: string) { return CALCULATORS[id]; }
```

### `lib/methods.ts` (acesso aos métodos OIV)
```ts
import methodsJson from "@/data/legal/methods.json";

export interface OivMethod {
  name: string; principle: string; equipment: string[]; reagents: string[];
  procedure: string[]; calculation: string; precision: string;
  regulatory_acceptance: string;
}

export const CANONICAL_TO_METHOD: Record<string, string> = {
  tav_adquirido: "OIV-MA-AS312-01A", acucar: "OIV-MA-AS311-01A",
  acidez_total: "OIV-MA-AS313-01",  acidez_volatil: "OIV-MA-AS313-02",
  so2_total: "OIV-MA-AS323-04B",    so2_livre: "OIV-MA-AS323-04B",
  cinzas: "OIV-MA-AS2-04",          sulfatos: "OIV-MA-AS321-05A",
  cloretos: "OIV-MA-AS321-02",      /* … metais, ocratoxina, pesticidas */
  // ph: sem método dedicado (potenciometria direta).
};

export function methodForCanonical(id: string) {
  const code = CANONICAL_TO_METHOD[id]; if (!code) return undefined;
  const method = (methodsJson as Record<string, OivMethod>)[code];
  return method ? { code, method } : undefined;
}
```

### `lib/session.ts` (export/import com validação defensiva)
```ts
export const SESSION_VERSION = 1;
export const SESSION_KIND = "vinho-lab/session";

export interface SessionData {
  kind: typeof SESSION_KIND; version: number;
  tipoId: string; brCat: string; ptCat: string;
  meta: SampleMeta; measurements: Measurements;
  scores: Record<string, number>; defeitos: string[]; notas: string;
}

export function downloadSession(data: SessionData, name: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `vinho-lab_${(name || "sessao").replace(/[^\w-]+/g, "_")}.json`;
  a.click(); URL.revokeObjectURL(a.href);
}

// Um ficheiro antigo/corrompido NUNCA deve partir a app: cai para valores seguros.
export function parseSession(raw: unknown): SessionData {
  if (typeof raw !== "object" || raw === null) throw new Error("Ficheiro inválido: não é um objeto JSON.");
  const o = raw as Record<string, unknown>;
  if (o.kind !== SESSION_KIND) throw new Error("Ficheiro não reconhecido como uma sessão do Vinho Lab Comp.");

  const tipo = (typeof o.tipoId === "string" && unifiedById(o.tipoId)) ? o.tipoId : "tinto";
  const u = unifiedById(tipo)!;
  const brCat = (typeof o.brCat === "string" && LEGISLATION_BR.categories[o.brCat]) ? o.brCat : (u.br ?? "vinho_fino_tinto");
  const ptCat = (typeof o.ptCat === "string" && LEGISLATION_PT_EU.categories[o.ptCat]) ? o.ptCat : (u.ptEu ?? "vinho_tinto");
  // … resto normalizado com defaults (meta, measurements, scores, defeitos, notas)
}
```

### `app/page.tsx` (ligação da barra + restauro de estado)
```tsx
const sessionData = useMemo<SessionData>(
  () => buildSession({ tipoId, brCat, ptCat, meta, measurements, scores, defeitos, notas }),
  [tipoId, brCat, ptCat, meta, measurements, scores, defeitos, notas],
);

const applySession = (d: SessionData) => {
  setTipoId(d.tipoId); setBrCat(d.brCat); setPtCat(d.ptCat);
  setMeta(d.meta); setMeasurements(d.measurements);
  setScores(d.scores); setDefeitos(d.defeitos); setNotas(d.notas);
};

// Barra fixa acima dos separadores → presente nas 4 abas:
<DataToolbar data={sessionData} onImport={applySession} />
```

### `lib/markdown.ts` (memória de cálculo)
```ts
function memoriaCalculo(rep: Report): string[] {
  const blocks: string[] = [];
  for (const [id, m] of Object.entries(rep.measurements)) {
    if (!m.calc) continue;
    const label = CANONICAL[id]?.label ?? id;
    const leituras = (CALCULATORS[id]?.inputs ?? []).map(i =>
      `${i.label} = ${m.calc!.inputs[i.key] ?? "—"}${i.suffix ? " " + i.suffix : ""}`).join("; ");
    blocks.push(`- **${label}** (${m.calc.method}): \`${m.calc.formula}\` · ${leituras} → **${m.value ?? "—"} ${m.unit}**`);
  }
  return blocks.length ? ["## Memória de cálculo", "", ...blocks, ""] : [];
}
```

---

## Fluxo de dados (golden path)

```
Calculadora de resultados      Análise química            Resultado
─────────────────────────      ───────────────            ─────────
leituras brutas (V, N, Vam) ─►  valor final (badge        validação BR + PT/UE
   compute() OIV                "calculado") ──────────►  verdict exportabilidade
                                conversão de unidades      relatório PDF / Markdown
                                (meq/L ↔ g/L)              (com memória de cálculo)

   Importar / Exportar (.json)  ── barra fixa, visível em todas as abas ──
```

---

## Bug encontrado e corrigido durante a verificação

**Sintoma:** importar um ficheiro com `tipoId`/categoria desconhecidos fazia
*white-screen* da aplicação inteira.

**Causa:** `validateRegime` acedia a `leg.categories[chave].parameters` numa
categoria inexistente → `Cannot read properties of undefined (reading 'parameters')`.

**Correção:** `parseSession` passou a validar `tipoId`/`brCat`/`ptCat` contra os
registos reais (`unifiedById`, `LEGISLATION_BR/PT_EU.categories`) e a recuar para
valores seguros (`tinto`) quando não reconhece.

---

## Fase 2 — robustez, ciência e segurança

Em resposta à revisão cruzada por cinco modelos (Qwen, DeepSeek, ChatGPT,
Z.ai/GLM, Gemini), implementaram-se todas as melhorias recomendadas, sempre
ancoradas em fontes (nunca em valores inventados).

### 6. Correção de SO₂ na acidez volátil (`lib/calculators.ts`)
A calculadora `acidez_volatil` passou a reproduzir a fórmula completa
OIV-MA-AS313-02 (verbatim de `methods.json`), com os volumes de iodo opcionais
**V₂** (SO₂ livre) e **V₃** (SO₂ combinado). Sem V₂/V₃ devolve a acidez bruta
(válida para vinhos secos sem SO₂).
> **A confirmar com a fonte Python/OIV:** o fator `0,001` presente na string do
> método torna os termos de correção ~1000× menores do que o esperado
> (negligenciáveis face à reprodutibilidade R ≈ 0,06 g/L). Reproduziu-se
> **fielmente** o método; assinala-se para verificação contra o original.

### 7. Margens de erro / incerteza de medição (`lib/precision.ts`, `lib/validate.ts`)
Cada resultado é comparado com a **reprodutibilidade R** (ou repetibilidade r,
em recurso) extraída do campo `precision` dos métodos OIV. Quando o valor cai a
menos de uma margem de erro de um limite legal, é assinalado como **"zona de
incerteza"** (aviso consultivo — **não** altera o veredicto legal). O `±` e a
zona de incerteza aparecem na UI, no Markdown e no PDF.

### 8. Sanity checks (`lib/plausibility.ts`)
Faixas físico-químicas **típicas** (NÃO legais) por parâmetro, para apanhar
erros grosseiros de digitação/unidade (pH 35, acidez volátil 60 g/L…). Avisos
amarelos não-bloqueantes em `Field.tsx` e `CalculatorTab.tsx`; o volume de
amostra a zero é assinalado visualmente (ponto do Gemini).

### 9. Fronteira de erro + cabeçalhos de segurança
`app/error.tsx` e `app/global-error.tsx` evitam o *white-screen* (mensagem
PT-PT + "Tentar novamente"). `next.config.ts` emite CSP restritiva,
`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy` e
`Permissions-Policy` (verificado por `curl -I`).

### 10. Base legal nos relatórios
`RegimeReport.regulatoryBasis` (de `regulatory_basis` dos JSON) é mostrada na UI,
no Markdown e no PDF — versionamento normativo exequível sem tocar no Python.

### 11. Testes + correções menores
Suite `bun test` (`tests/*.test.ts`): conversões, calculadoras (incl. SO₂),
validação/exportabilidade, parsing de precisão e plausibilidade — **46 testes**.
`DataToolbar` limpa a mensagem ao fim de 5 s; `parseSession` valida agora a
forma de cada `Measurement` (`sanitizeMeasurements`).

---

## Verificação

- `./node_modules/.bin/tsc --noEmit` → sem erros.
- `./node_modules/.bin/next build` → compila e gera páginas estáticas.
- `bun test` → **46 passaram, 0 falharam** (5 ficheiros).
- `bun scripts/smoke.ts` → **13 passaram, 0 falharam**.
- Cabeçalhos de segurança confirmados via `curl -I` (CSP, X-Frame-Options, etc.).
- Browser (preview):
  - Barra Importar/Exportar presente nas 4 abas.
  - Import válido restaura amostra, lote e tipo + mensagem de confirmação.
  - Import corrompido (ids inválidos) **já não parte a app** — recua para `tinto`.

---

## Tarefas em aberto (futuras)

- Confirmar o fator `0,001` da correção de SO₂ contra a fonte Python/OIV.
- Mover a aba "Calculadora de resultados" para a última posição — se preferido.
- Acessibilidade (a11y) e modo escuro.
- Tabelas de densidade OIV (TAV/extrato/açúcares) — requer fonte autorizada.
- PWA/offline; histórico por lote (IndexedDB); `git init` + deploy Vercel.
