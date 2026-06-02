"use client";
import { useMemo, useState } from "react";
import PrivacyModal from "./components/PrivacyModal";
import Field from "./components/Field";
import CalculatorTab from "./components/CalculatorTab";
import SensoryTab from "./components/SensoryTab";
import ResultTab from "./components/ResultTab";
import { UNIFIED_CATEGORIES, unifiedById } from "@/lib/categories";
import { LEGISLATION_BR, LEGISLATION_PT_EU } from "@/lib/legal";
import { fieldsFor } from "@/lib/fields";
import {
  validateRegime,
  exportVerdict,
  type Measurements,
  type Measurement,
} from "@/lib/validate";
import { ETHANOL_WEIGHT_FACTOR, convert } from "@/lib/canonical";
import { assessMolecularSo2, classifySparklingSweetness, classifyPortSweetness } from "@/lib/chemistry";
import { computeOivScore } from "@/lib/sensory";
import { Report, SampleMeta } from "@/lib/report";
import DataToolbar from "./components/DataToolbar";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useI18n } from "./components/I18nProvider";
import { buildSession, type SessionData } from "@/lib/session";

type Tab = "calculadora" | "quimica" | "sensorial" | "resultado";

/** Ordem dos separadores (também a ordem de navegação por setas, WAI-ARIA Tabs). */
const TABS: Tab[] = ["quimica", "calculadora", "sensorial", "resultado"];

const CATEGORY_STYLES: Record<string, { dot: string; bg: string; text: string }> = {
  tinto: { dot: "bg-[#8b1c2b]", bg: "rgba(139, 28, 43, 0.12)", text: "#fcc2c9" },
  branco_rose: { dot: "bg-[#e2af84]", bg: "rgba(226, 175, 132, 0.12)", text: "#fae2cd" },
  mesa_tinto: { dot: "bg-[#5e0a1b]", bg: "rgba(94, 10, 27, 0.12)", text: "#f6b5c0" },
  mesa_branco_rose: { dot: "bg-[#df9ba6]", bg: "rgba(223, 155, 166, 0.12)", text: "#ffe5e9" },
  doce: { dot: "bg-[#c5981a]", bg: "rgba(197, 152, 26, 0.12)", text: "#fdf0c5" },
  espumante: { dot: "bg-[#7dbbbb] shadow-[0_0_8px_#7dbbbb]", bg: "rgba(125, 187, 187, 0.12)", text: "#dff6f6" },
  espumante_nq: { dot: "bg-[#6ba0a0]", bg: "rgba(107, 160, 160, 0.12)", text: "#cceee9" },
  frisante: { dot: "bg-[#7eaab3]", bg: "rgba(126, 170, 179, 0.12)", text: "#dbeef0" },
  licoroso: { dot: "bg-[#80421e]", bg: "rgba(128, 66, 30, 0.12)", text: "#ebcfc0" },
  porto: { dot: "bg-[#6c2c16]", bg: "rgba(108, 44, 22, 0.12)", text: "#ebc2b5" },
  madeira: { dot: "bg-[#5c3822]", bg: "rgba(92, 56, 34, 0.12)", text: "#e3ccbf" },
  moscatel: { dot: "bg-[#9a6f1a]", bg: "rgba(154, 111, 26, 0.12)", text: "#ffebcc" },
  bio_tinto: { dot: "bg-[#3e5f22]", bg: "rgba(62, 95, 34, 0.12)", text: "#cceeaf" },
  bio_branco_rose: { dot: "bg-[#738e3f]", bg: "rgba(115, 142, 63, 0.12)", text: "#eef8ce" },
};

const GROUPS = [
  {
    id: "alcool_extratos",
    labelKey: "page.groupAlcool",
    emoji: "🍷",
    fieldIds: ["tav_adquirido", "tav_total", "extrato_seco_reduzido", "relacao_alcool_extrato"],
  },
  {
    id: "acidez_ph",
    labelKey: "page.groupAcidez",
    emoji: "🧪",
    fieldIds: ["acidez_total", "acidez_volatil", "ph"],
  },
  {
    id: "so2",
    labelKey: "page.groupSo2",
    emoji: "🛡️",
    fieldIds: ["so2_total", "so2_livre", "acucar"],
  },
  {
    id: "sais_compostos",
    labelKey: "page.groupSais",
    emoji: "🏺",
    fieldIds: ["cinzas", "sulfatos", "cloretos", "metanol", "sobrepressao_co2"],
  },
  {
    id: "metais_contaminantes",
    labelKey: "page.groupMetais",
    emoji: "⚠️",
    fieldIds: ["cobre", "ferro", "chumbo", "cadmio", "arsenio", "ocratoxina", "pesticidas"],
  },
];

export default function Home() {
  const { t, td } = useI18n();
  const [tab, setTab] = useState<Tab>("quimica");
  const [tipoId, setTipoId] = useState("tinto");
  const initial = unifiedById("tinto")!;
  const [brCat, setBrCat] = useState<string>(initial.br ?? "vinho_fino_tinto");
  const [ptCat, setPtCat] = useState<string>(initial.ptEu ?? "vinho_tinto");
  const [showAdjust, setShowAdjust] = useState(false);
  const [metaOpen, setMetaOpen] = useState(false);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    alcool_extratos: true,
    acidez_ph: true,
    so2: true,
  });

  const [meta, setMeta] = useState<SampleMeta>({
    amostra: "",
    lote: "",
    data: "",
    responsavel: "",
    observacoes: "",
  });
  const [measurements, setMeasurements] = useState<Measurements>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [defeitos, setDefeitos] = useState<string[]>([]);
  const [notas, setNotas] = useState("");

  const tipo = unifiedById(tipoId)!;
  const fields = useMemo(() => fieldsFor(brCat, ptCat), [brCat, ptCat]);

  const setMeasurement = (id: string, m: Measurement) =>
    setMeasurements((prev) => ({ ...prev, [id]: m }));

  const onTipoChange = (id: string) => {
    setTipoId(id);
    const u = unifiedById(id)!;
    if (u.br) setBrCat(u.br);
    if (u.ptEu) setPtCat(u.ptEu);
  };

  // Navegação por teclado entre separadores (padrão WAI-ARIA Tabs).
  const onTabKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const i = TABS.indexOf(tab);
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next === null) return;
    e.preventDefault();
    const id = TABS[next];
    setTab(id);
    document.getElementById(`tab-${id}`)?.focus();
  };

  // Valor calculado da relação álcool/extrato (para o campo computed).
  const relacao = useMemo(() => {
    const tav = measurements["tav_adquirido"];
    const esr = measurements["extrato_seco_reduzido"];
    if (tav?.value == null || esr?.value == null || esr.value === 0) return null;
    const tavBase = convert(tav.value, tav.unit, "% vol");
    return (tavBase * ETHANOL_WEIGHT_FACTOR) / esr.value;
  }, [measurements]);

  const report = useMemo<Report>(() => {
    const br = validateRegime("BR", brCat, measurements);
    const pt = validateRegime("PT_EU", ptCat, measurements);
    const verdict = exportVerdict(br, pt);

    const so2livre = measurements["so2_livre"]?.value ?? null;
    const ph = measurements["ph"]?.value ?? null;
    const molecular =
      so2livre !== null && ph !== null ? assessMolecularSo2(so2livre, ph) : undefined;

    const acucar = measurements["acucar"]?.value ?? null;
    let docura: Report["doçura"];
    if (acucar !== null) {
      if (tipoId === "espumante" || tipoId === "espumante_nq") {
        const c = classifySparklingSweetness(acucar);
        docura = { tipo: "Espumante", classificacao: c.designacaoPrincipal, designacoes: c.designacoesPermitidas };
      } else if (tipoId === "porto") {
        docura = { tipo: "Vinho do Porto", classificacao: classifyPortSweetness(acucar) };
      }
    }

    const oiv = computeOivScore(scores);
    const sensoryEnabled = oiv.total > 0 || defeitos.length > 0;

    return {
      meta,
      tipoLabel: tipo.label,
      br,
      pt,
      verdict,
      measurements,
      molecular,
      "doçura": docura,
      sensory: {
        enabled: sensoryEnabled,
        tipoVinho: tipoId,
        score: oiv,
        defeitos,
        notas,
      },
      geradoEm: new Date().toLocaleString("pt-PT"),
    };
  }, [brCat, ptCat, measurements, scores, defeitos, notas, meta, tipo, tipoId]);

  const sessionData = useMemo<SessionData>(
    () => buildSession({ tipoId, brCat, ptCat, meta, measurements, scores, defeitos, notas }),
    [tipoId, brCat, ptCat, meta, measurements, scores, defeitos, notas],
  );

  const applySession = (d: SessionData) => {
    setTipoId(d.tipoId);
    setBrCat(d.brCat);
    setPtCat(d.ptCat);
    setMeta(d.meta);
    setMeasurements(d.measurements);
    setScores(d.scores);
    setDefeitos(d.defeitos);
    setNotas(d.notas);
  };

  // Agrupamento dinâmico de campos químicos
  const groupedFields = useMemo(() => {
    const result: { id: string; label: string; emoji: string; fields: typeof fields }[] = [];
    const mappedIds = new Set<string>();

    for (const g of GROUPS) {
      const matched = fields.filter((f) => g.fieldIds.includes(f.id));
      if (matched.length > 0) {
        result.push({ id: g.id, label: t(g.labelKey), emoji: g.emoji, fields: matched });
        matched.forEach((f) => mappedIds.add(f.id));
      }
    }

    const remaining = fields.filter((f) => !mappedIds.has(f.id));
    if (remaining.length > 0) {
      result.push({ id: "outros", label: t("page.otherParams"), emoji: "📋", fields: remaining });
    }

    return result;
  }, [fields, t]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const getFilledCount = (groupFields: typeof fields) => {
    return groupFields.filter(
      (f) => measurements[f.id]?.value !== null && measurements[f.id]?.value !== undefined
    ).length;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PrivacyModal />

      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-wide text-[var(--primary)] flex items-center gap-2">
            🍷 Vinho-Lab <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-[var(--accent)] text-white select-none">v1.0</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)] font-sans">{t("page.tagline")}</p>
        </div>
        <div className="shrink-0 flex items-center">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Seleção visual de vinhos e ajuste de equivalências */}
      <section className="mb-6 rounded-2xl glass p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
          {t("page.wineType")}
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-2 px-2 snap-x snap-mandatory scrollbar-thin">
          {UNIFIED_CATEGORIES.map((c) => {
            const selected = tipoId === c.id;
            const st = CATEGORY_STYLES[c.id] || { dot: "bg-gray-400", bg: "rgba(255,255,255,0.05)", text: "#fff" };
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onTipoChange(c.id)}
                className={`snap-start shrink-0 rounded-xl px-4 py-3 flex flex-col items-start min-w-[150px] md:min-w-[170px] border transition-all duration-300 cursor-pointer select-none ${
                  selected
                    ? "bg-[var(--card)] border-[var(--secondary)] shadow-lg scale-[1.02] ring-1 ring-[var(--secondary)]"
                    : "bg-transparent border-[var(--border)] hover:bg-[var(--input)] hover:border-white/20"
                }`}
              >
                <span className="flex items-center gap-1.5 mb-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${st.dot}`}></span>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">
                    {c.id.includes("bio") ? "Biológico" : c.id.includes("mesa") ? "Mesa" : "Fino / DOP"}
                  </span>
                </span>
                <span className="text-xs font-semibold text-left line-clamp-2 min-h-[2rem] leading-tight text-[var(--foreground)]">
                  {td(c.label)}
                </span>
              </button>
            );
          })}
        </div>

        {tipo.nota && (
          <p className="mt-3 text-xs text-[var(--muted)] italic bg-white/5 p-2 rounded-lg border border-[var(--border)]">
            ℹ️ {td(tipo.nota)}
          </p>
        )}

        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowAdjust((s) => !s)}
            className="text-xs text-[var(--secondary)] hover:text-[var(--primary)] transition-colors underline cursor-pointer"
          >
            {showAdjust ? t("page.hideEquiv") : t("page.adjustEquiv")}
          </button>
          {showAdjust && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 bg-black/25 p-3 rounded-lg border border-[var(--border)]">
              <label className="text-xs text-[var(--muted)]">
                {t("page.catBR")}
                <select
                  value={brCat}
                  onChange={(e) => setBrCat(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-2.5 py-1.5 text-sm"
                >
                  {Object.entries(LEGISLATION_BR.categories).map(([k, c]) => (
                    <option key={k} value={k}>
                      {td(c.label)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-[var(--muted)]">
                {t("page.catPT")}
                <select
                  value={ptCat}
                  onChange={(e) => setPtCat(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-2.5 py-1.5 text-sm"
                >
                  {Object.entries(LEGISLATION_PT_EU.categories).map(([k, c]) => (
                    <option key={k} value={k}>
                      {td(c.label)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>
      </section>

      {/* Ficha de Amostra Colapsável */}
      <section className="mb-6 rounded-2xl glass p-4 transition-all duration-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
            <span className="font-semibold text-[var(--primary)] flex items-center gap-1.5 select-none">
              📋 {t("page.sampleSheet")}:
            </span>
            <span className="text-[var(--foreground)] font-medium">
              {meta.amostra ? meta.amostra : <span className="italic text-[var(--muted)]">{t("page.noSample")}</span>}
            </span>
            {meta.lote && (
              <span className="text-[var(--muted)] text-xs md:text-sm border-l border-[var(--border)] pl-3">
                {t("page.lot")}: <strong className="text-[var(--foreground)]">{meta.lote}</strong>
              </span>
            )}
            {meta.data && (
              <span className="text-[var(--muted)] text-xs md:text-sm border-l border-[var(--border)] pl-3">
                {t("page.date")}: <strong className="text-[var(--foreground)]">{new Date(meta.data).toLocaleDateString("pt-PT")}</strong>
              </span>
            )}
            {meta.responsavel && (
              <span className="text-[var(--muted)] text-xs md:text-sm border-l border-[var(--border)] pl-3">
                {t("page.responsible")}: <strong className="text-[var(--foreground)]">{meta.responsavel}</strong>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMetaOpen(!metaOpen)}
            className="text-xs text-[var(--secondary)] font-semibold hover:text-[var(--primary)] transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            {metaOpen ? `▲ ${t("page.hide")}` : `▼ ${t("page.edit")}`}
          </button>
        </div>

        {metaOpen && (
          <div className="mt-4 grid gap-4 border-t border-[var(--border)] pt-4 sm:grid-cols-2 md:grid-cols-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex flex-col">
              <label className="text-xs text-[var(--muted)] mb-1 font-medium">{t("page.sample")}</label>
              <input
                placeholder="Ex: Cabernet 2025"
                value={meta.amostra}
                onChange={(e) => setMeta({ ...meta, amostra: e.target.value })}
                className="rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-[var(--muted)] mb-1 font-medium">{t("page.lot")}</label>
              <input
                placeholder="Ex: Lote 12-A"
                value={meta.lote}
                onChange={(e) => setMeta({ ...meta, lote: e.target.value })}
                className="rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-[var(--muted)] mb-1 font-medium">{t("page.date")}</label>
              <input
                type="date"
                value={meta.data}
                onChange={(e) => setMeta({ ...meta, data: e.target.value })}
                className="rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-[var(--muted)] mb-1 font-medium">{t("page.responsible")}</label>
              <input
                placeholder="Analista"
                value={meta.responsavel}
                onChange={(e) => setMeta({ ...meta, responsavel: e.target.value })}
                className="rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-4 flex flex-col">
              <label className="text-xs text-[var(--muted)] mb-1 font-medium">{t("sensory.tastingNotes")}</label>
              <textarea
                placeholder="..."
                value={meta.observacoes}
                onChange={(e) => setMeta({ ...meta, observacoes: e.target.value })}
                rows={2}
                className="rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none"
              />
            </div>
          </div>
        )}
      </section>

      {/* Importar / exportar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl glass px-4 py-3">
        <span className="text-xs text-[var(--muted)]">{t("page.toolbarHint")}</span>
        <div className="flex justify-end">
          <DataToolbar data={sessionData} onImport={applySession} />
        </div>
      </div>

      {/* Separadores estilo Segmented Control */}
      <nav
        role="tablist"
        aria-label={t("page.tabsLabel")}
        onKeyDown={onTabKeyDown}
        className="mb-6 bg-black/30 p-1.5 rounded-2xl border border-[var(--border)] flex gap-1 w-full"
      >
        {TABS.map((id) => (
          <button
            key={id}
            id={`tab-${id}`}
            role="tab"
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            tabIndex={tab === id ? 0 : -1}
            onClick={() => setTab(id)}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer select-none ${
              tab === id
                ? "bg-[var(--accent)] text-white shadow-lg shadow-[rgba(139,28,43,0.3)] scale-[1.01]"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/5"
            }`}
          >
            {t(`tab.${id}`)}
          </button>
        ))}
      </nav>

      {/* Paineis de Abas */}
      {tab === "quimica" && (
        <div role="tabpanel" id="panel-quimica" aria-labelledby="tab-quimica" className="space-y-4">
          <p className="text-xs text-[var(--muted)] italic mb-4">{t("page.chemIntro")}</p>

          <div className="space-y-3">
            {groupedFields.map((group) => {
              const isOpen = !!expandedGroups[group.id];
              const filled = getFilledCount(group.fields);
              const total = group.fields.length;

              return (
                <div key={group.id} className="rounded-2xl glass overflow-hidden border border-[var(--border)] transition-all">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between gap-4 p-4 hover:bg-white/5 text-left cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl select-none">{group.emoji}</span>
                      <h3 className="text-sm font-semibold text-[var(--primary)]">{group.label}</h3>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        filled > 0 ? "bg-[var(--ok-bg)] text-[var(--ok-fg)]" : "bg-white/5 text-[var(--muted)]"
                      }`}>
                        {filled} / {total}
                      </span>
                      <span className="text-xs text-[var(--muted)] transition-transform duration-300">
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-4 border-t border-[var(--border)] bg-black/10 animate-[fadeIn_0.2s_ease-out]">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {group.fields.map((f) => (
                          <Field
                            key={f.id}
                            field={f}
                            value={measurements[f.id]}
                            onChange={(m) => setMeasurement(f.id, m)}
                            computedValue={f.id === "relacao_alcool_extrato" ? relacao : undefined}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "calculadora" && (
        <div role="tabpanel" id="panel-calculadora" aria-labelledby="tab-calculadora">
          <CalculatorTab fields={fields} measurements={measurements} setMeasurement={setMeasurement} />
        </div>
      )}

      {tab === "sensorial" && (
        <div role="tabpanel" id="panel-sensorial" aria-labelledby="tab-sensorial">
          <SensoryTab
            scores={scores}
            setScore={(k, v) => setScores((prev) => ({ ...prev, [k]: v }))}
            defeitos={defeitos}
            toggleDefeito={(d) =>
              setDefeitos((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
            }
            notas={notas}
            setNotas={setNotas}
          />
        </div>
      )}

      {tab === "resultado" && (
        <div role="tabpanel" id="panel-resultado" aria-labelledby="tab-resultado">
          <ResultTab report={report} />
        </div>
      )}

      <footer className="mt-12 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)] text-center font-sans">
        {t("page.footer")}
      </footer>
    </div>
  );
}
