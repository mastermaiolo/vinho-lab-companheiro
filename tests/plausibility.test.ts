/** Sanity checks — NÃO são limites legais, só apanham erros grosseiros. */
import { test, expect, describe } from "bun:test";
import { checkPlausibility, checkCalcInputs } from "../lib/plausibility";

describe("checkPlausibility", () => {
  test("valor plausível não gera aviso", () => {
    expect(checkPlausibility("ph", 3.5, "—")).toBeNull();
    expect(checkPlausibility("tav_adquirido", 13, "% vol")).toBeNull();
  });

  test("pH fisicamente impossível gera aviso", () => {
    expect(checkPlausibility("ph", 35, "—")).not.toBeNull();
  });

  test("acidez volátil enorme (erro de unidade) gera aviso", () => {
    expect(checkPlausibility("acidez_volatil", 60, "g/L (acético)")).not.toBeNull();
  });

  test("converte a unidade de entrada antes de comparar", () => {
    // 10 meq/L ≈ 0,6 g/L → dentro da faixa típica (0–2,5)
    expect(checkPlausibility("acidez_volatil", 10, "meq/L (acético)")).toBeNull();
  });

  test("valor null não gera aviso", () => {
    expect(checkPlausibility("ph", null, "—")).toBeNull();
  });

  test("parâmetro sem faixa: só apanha negativos", () => {
    expect(checkPlausibility("ocratoxina", -1, "µg/kg")).not.toBeNull();
  });
});

describe("checkCalcInputs", () => {
  test("Vam = 0 é assinalado", () => {
    const w = checkCalcInputs({ V: 10, N: 0.1, Vam: 0 });
    expect(w.length).toBeGreaterThan(0);
  });

  test("inputs válidos não geram avisos", () => {
    expect(checkCalcInputs({ V: 10, N: 0.1, Vam: 20 })).toEqual([]);
  });

  test("leitura negativa é assinalada", () => {
    expect(checkCalcInputs({ V: -3, N: 0.1, Vam: 20 }).length).toBeGreaterThan(0);
  });
});
