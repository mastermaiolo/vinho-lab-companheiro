/** Validação de conformidade + exportabilidade + incerteza de medição. */
import { test, expect, describe } from "bun:test";
import { validateRegime, exportVerdict, type Measurements } from "../lib/validate";

function baseAmostra(): Measurements {
  return {
    tav_adquirido: { value: 13, unit: "% vol" },
    acidez_total: { value: 5.5, unit: "g/L (tartárico)" },
    acidez_volatil: { value: 0.6, unit: "g/L (acético)" },
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
}

describe("validateRegime", () => {
  test("amostra típica BR fino tinto: sem não-conformes", () => {
    const br = validateRegime("BR", "vinho_fino_tinto", baseAmostra());
    expect(br.summary["Não conforme"]).toBe(0);
  });

  test("expõe a base legal (regulatory_basis)", () => {
    const br = validateRegime("BR", "vinho_fino_tinto", baseAmostra());
    expect(Array.isArray(br.regulatoryBasis)).toBe(true);
  });

  test("acidez volátil exagerada → não conforme", () => {
    const m = baseAmostra();
    m.acidez_volatil = { value: 5, unit: "g/L (acético)" };
    const br = validateRegime("BR", "vinho_fino_tinto", m);
    const av = br.results.find((r) => r.parameter.toLowerCase().includes("volátil"));
    expect(av?.status).toBe("Não conforme");
  });

  test("parâmetro não medido → 'Não medido', não 'Conforme'", () => {
    const m = baseAmostra();
    delete m.tav_adquirido;
    const br = validateRegime("BR", "vinho_fino_tinto", m);
    const tav = br.results.find((r) => /alco/i.test(r.parameter));
    expect(tav).toBeDefined();
    expect(tav?.status).toBe("Não medido");
  });

  test("acidez volátil em meq/L recebe margem de erro (g/L→meq/L)", () => {
    const br = validateRegime("BR", "vinho_fino_tinto", baseAmostra());
    const av = br.results.find((r) => r.parameter.toLowerCase().includes("volátil"));
    // R ≤ 0,06 g/L (acético) ≈ 1 meq/L — a conversão dimensionada tem de resultar.
    expect(av?.uncertainty).toBeGreaterThan(0);
    expect(av?.uncertainty).toBeCloseTo(1.0, 1);
  });

  test("valor junto ao limite legal é assinalado como 'zona de incerteza'", () => {
    const m = baseAmostra();
    m.acidez_volatil = { value: 1.18, unit: "g/L (acético)" }; // ≈ 19,65 meq/L, limite ≤ 20
    const br = validateRegime("BR", "vinho_fino_tinto", m);
    const av = br.results.find((r) => r.parameter.toLowerCase().includes("volátil"));
    expect(av?.borderline).toBe(true);
  });

  test("PT/UE tinto açúcar<5 → só um escalão de SO₂ aplicável", () => {
    const pt = validateRegime("PT_EU", "vinho_tinto", baseAmostra());
    const so2 = pt.results.filter((r) => r.parameter.includes("SO₂"));
    expect(so2.length).toBe(1);
  });
});

describe("exportVerdict", () => {
  test("amostra conforme em ambos → exportável nos dois sentidos", () => {
    const m = baseAmostra();
    const br = validateRegime("BR", "vinho_fino_tinto", m);
    const pt = validateRegime("PT_EU", "vinho_tinto", m);
    const v = exportVerdict(br, pt);
    expect(typeof v.exportPTtoBR).toBe("boolean");
    expect(typeof v.exportBRtoPT).toBe("boolean");
    expect(v.conformeBR).toBe(br.summary.conforme);
  });

  test("não-conformidade gera bloqueios", () => {
    const m = baseAmostra();
    m.acidez_volatil = { value: 5, unit: "g/L (acético)" };
    const br = validateRegime("BR", "vinho_fino_tinto", m);
    const pt = validateRegime("PT_EU", "vinho_tinto", m);
    const v = exportVerdict(br, pt);
    expect(v.bloqueiosBR.length).toBeGreaterThan(0);
  });
});
