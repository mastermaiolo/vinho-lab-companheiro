# 🍷 Vinho-Lab Companheiro

Companheiro de laboratório que valida **o mesmo vinho** contra dois regimes
regulamentares — **Brasil (MAPA, IN 14/2018)** e **Portugal/UE (IVV; Reg. UE
1308/2013, 2019/934 e 2018/848)** — e indica a **exportabilidade**.

Todo o processamento é feito **100 % no navegador**: sem servidor, sem analítica,
sem envio de dados. Coerente com o RGPD.

> ⚠️ Ferramenta de **apoio à decisão**. Não substitui o boletim oficial de um
> laboratório autorizado.

---

## Funcionalidades

- **Validação cruzada BR ↔ PT/UE** por categoria de vinho, com conversão
  automática de unidades (ex.: `meq/L` ↔ `g/L`).
- **Veredito de exportabilidade** entre os dois regimes.
- **Calculadora de resultados** — calcula o valor final a partir das leituras
  brutas de bancada (volume de titulante, concentração, volume de amostra),
  usando as fórmulas oficiais **OIV**; o resultado flui para a validação.
- **Painel "Ver método OIV"** — princípio, equipamento, reagentes, procedimento,
  cálculo, precisão e aceitação regulatória de cada parâmetro.
- **Análise sensorial** (pontuação OIV + defeitos).
- **Exportação de relatório** em **PDF** e **Markdown**, com memória de cálculo.
- **Importar / Exportar sessão** em `.json` para guardar e retomar o trabalho.
- **Interface multilíngue** — Português (PT-PT, fonte de verdade), Inglês, Espanhol
  e Chinês simplificado. A tradução abrange também todo o **conteúdo de domínio**
  (parâmetros, métodos OIV, critérios sensoriais), aplicada apenas na renderização —
  os valores legais e as fórmulas mantêm-se na fonte e nunca são traduzidos.

---

## Princípio do projeto

**Nunca inventar valores legais nem fórmulas.** Todos os limites e fórmulas
analíticas provêm de JSON gerado a partir de um projeto de origem
(`data/legal/*.json`). Parâmetros que dependem de tabelas de densidade OIV sem
fórmula fechada (TAV, extrato seco, açúcares) mantêm entrada direta do valor.

---

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19 · TypeScript · [Tailwind CSS v4](https://tailwindcss.com)
- [pdfmake](https://pdfmake.org) (geração de PDF no cliente)
- Gestor de pacotes: **pnpm**

---

## Começar

```bash
pnpm install
pnpm dev      # servidor de desenvolvimento em http://localhost:3000
```

Outros scripts:

```bash
pnpm build    # build de produção
pnpm start    # servir o build
pnpm lint     # ESLint
pnpm test     # testes unitários (bun test)
pnpm check    # verificação completa: tipos + lint + testes
```

---

## Estrutura

```
app/                 Páginas e componentes (App Router)
  components/        Field, CalculatorTab, SensoryTab, ResultTab, MethodPanel, DataToolbar…
lib/                 Núcleo: validate, canonical, fields, calculators, methods,
                     categories, legal, sensory, chemistry, report, markdown, pdf, session
data/legal/*.json    Fonte de verdade: limites legais + métodos OIV (não editar à mão)
scripts/             Testes de fumo (smoke)
```

Ver [`REGISTO-TRABALHO.md`](./REGISTO-TRABALHO.md) para um registo detalhado da
arquitetura e das decisões de implementação.

---

## Deploy

Otimizado para [Vercel](https://vercel.com): importar o repositório e o deploy é
automático (não são necessárias variáveis de ambiente — a app é totalmente
client-side).

---

## Licença

Distribuído sob a licença MIT. Ver [`LICENSE`](./LICENSE).
