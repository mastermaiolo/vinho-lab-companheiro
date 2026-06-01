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

export default function Home() {
  const { t, td } = useI18n();
  const [tab, setTab] = useState<Tab>("quimica");
  const [tipoId, setTipoId] = useState("tinto");
  const initial = unifiedById("tinto")!;
  const [brCat, setBrCat] = useState<string>(initial.br ?? "vinho_fino_tinto");
  const [ptCat, setPtCat] = useState<string>(initial.ptEu ?? "vinho_tinto");
  const [showAdjust, setShowAdjust] = useState(false);

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <PrivacyModal />

      <header className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold">🍷 Vinho-Lab</h1>
          <LanguageSwitcher />
        </div>
        <p className="text-sm text-[var(--muted)]">{t("page.tagline")}</p>
      </header>

      {/* Seleção de categoria + identificação */}
      <section className="mb-5 rounded-lg glass p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">{t("page.wineType")}</label>
            <select
              value={tipoId}
              onChange={(e) => onTipoChange(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-2 py-2 text-sm"
            >
              {UNIFIED_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {td(c.label)}
                </option>
              ))}
            </select>
            {tipo.nota && <p className="mt-1 text-xs text-[var(--muted)]">{td(tipo.nota)}</p>}
            <button
              onClick={() => setShowAdjust((s) => !s)}
              className="mt-2 text-xs text-[var(--secondary)] underline"
            >
              {showAdjust ? t("page.hideEquiv") : t("page.adjustEquiv")}
            </button>
            {showAdjust && (
              <div className="mt-2 grid gap-2">
                <label className="text-xs">
                  {t("page.catBR")}
                  <select
                    value={brCat}
                    onChange={(e) => setBrCat(e.target.value)}
                    className="mt-0.5 w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-2 py-1.5 text-sm"
                  >
                    {Object.entries(LEGISLATION_BR.categories).map(([k, c]) => (
                      <option key={k} value={k}>
                        {td(c.label)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs">
                  {t("page.catPT")}
                  <select
                    value={ptCat}
                    onChange={(e) => setPtCat(e.target.value)}
                    className="mt-0.5 w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-2 py-1.5 text-sm"
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
          <div className="grid grid-cols-2 gap-2">
            <input
              aria-label={t("page.sample")}
              placeholder={t("page.sample")}
              value={meta.amostra}
              onChange={(e) => setMeta({ ...meta, amostra: e.target.value })}
              className="rounded-md border border-[var(--border)] bg-[var(--input)] px-2 py-2 text-sm"
            />
            <input
              aria-label={t("page.lot")}
              placeholder={t("page.lot")}
              value={meta.lote}
              onChange={(e) => setMeta({ ...meta, lote: e.target.value })}
              className="rounded-md border border-[var(--border)] bg-[var(--input)] px-2 py-2 text-sm"
            />
            <input
              type="date"
              aria-label={t("page.date")}
              value={meta.data}
              onChange={(e) => setMeta({ ...meta, data: e.target.value })}
              className="rounded-md border border-[var(--border)] bg-[var(--input)] px-2 py-2 text-sm"
            />
            <input
              aria-label={t("page.responsible")}
              placeholder={t("page.responsible")}
              value={meta.responsavel}
              onChange={(e) => setMeta({ ...meta, responsavel: e.target.value })}
              className="rounded-md border border-[var(--border)] bg-[var(--input)] px-2 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Importar / exportar — disponível em todas as abas */}
      <div className="mb-4 flex items-center justify-between gap-2 rounded-lg glass px-3 py-2">
        <span className="text-xs text-[var(--muted)]">{t("page.toolbarHint")}</span>
        <DataToolbar data={sessionData} onImport={applySession} />
      </div>

      {/* Separadores */}
      <nav
        role="tablist"
        aria-label={t("page.tabsLabel")}
        onKeyDown={onTabKeyDown}
        className="mb-4 flex gap-1 border-b border-[var(--border)]"
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
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === id
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {t(`tab.${id}`)}
          </button>
        ))}
      </nav>

      {tab === "quimica" && (
        <div role="tabpanel" id="panel-quimica" aria-labelledby="tab-quimica">
          <p className="mb-3 text-xs text-[var(--muted)]">{t("page.chemIntro")}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((f) => (
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

      <footer className="mt-10 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
        {t("page.footer")}
      </footer>
    </div>
  );
}
