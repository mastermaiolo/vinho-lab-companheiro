/** Calculadoras OIV — reproduzem fielmente as fórmulas de methods.json. */
import { test, expect, describe } from "bun:test";
import { CALCULATORS, calculatorFor } from "../lib/calculators";

describe("acidez_total (titulação)", () => {
  const c = CALCULATORS.acidez_total;
  test("(V×N×75)/Vam", () => {
    // V=10, N=0,1, Vam=10 → (10×0,1×75)/10 = 7,5 g/L
    expect(c.compute({ V: 10, N: 0.1, Vam: 10 })).toBeCloseTo(7.5, 9);
  });
  test("Vam = 0 devolve null (sem divisão por zero)", () => {
    expect(c.compute({ V: 10, N: 0.1, Vam: 0 })).toBeNull();
  });
  test("input em falta devolve null", () => {
    expect(c.compute({ V: null, N: 0.1, Vam: 10 })).toBeNull();
  });
  test("NaN tratado como ausente", () => {
    expect(c.compute({ V: NaN, N: 0.1, Vam: 10 })).toBeNull();
  });
});

describe("acidez_volatil (OIV-MA-AS313-02 com correção SO₂)", () => {
  const c = CALCULATORS.acidez_volatil;
  test("sem V₂/V₃ devolve a acidez bruta", () => {
    // V1=10, N=0,1, Vam=20 → (10×0,1×60)/20 = 3,0 g/L
    expect(c.compute({ V: 10, N: 0.1, Vam: 20 })).toBeCloseTo(3.0, 9);
  });
  test("a correção SO₂ reduz o resultado", () => {
    const semCorr = c.compute({ V: 10, N: 0.1, Vam: 20 })!;
    const comCorr = c.compute({ V: 10, N: 0.1, Vam: 20, V2: 5, V3: 2 })!;
    expect(comCorr).toBeLessThan(semCorr);
  });
  test("correção verbatim do método (fator 0,001)", () => {
    // base 3,0 − (0,1×5×32/20×0,001) − (0,05×2×32/20×0,001)
    const corrLivre = ((0.1 * 5 * 32) / 20) * 0.001;
    const corrComb = ((0.05 * 2 * 32) / 20) * 0.001;
    expect(c.compute({ V: 10, N: 0.1, Vam: 20, V2: 5, V3: 2 })!).toBeCloseTo(3.0 - corrLivre - corrComb, 9);
  });
  test("Vam = 0 devolve null", () => {
    expect(c.compute({ V: 10, N: 0.1, Vam: 0 })).toBeNull();
  });
});

describe("so2_total", () => {
  test("(V×N×32×1000)/Vam", () => {
    // V=10, N=0,01, Vam=20 → (10×0,01×32000)/20 = 160 mg/L
    expect(CALCULATORS.so2_total.compute({ V: 10, N: 0.01, Vam: 20 })).toBeCloseTo(160, 6);
  });
});

describe("cinzas / sulfatos (gravimetria)", () => {
  test("cinzas (m/Vam)×1000", () => {
    expect(CALCULATORS.cinzas.compute({ m: 0.04, Vam: 20 })).toBeCloseTo(2, 9);
  });
  test("sulfatos (m×0,7464/Vam)×1000", () => {
    expect(CALCULATORS.sulfatos.compute({ m: 0.1, Vam: 100 })).toBeCloseTo(0.7464, 6);
  });
});

describe("instrumental", () => {
  test("leitura × fator", () => {
    expect(CALCULATORS.metanol.compute({ leitura: 50, fator: 2 })).toBeCloseTo(100, 9);
  });
});

describe("calculatorFor", () => {
  test("devolve a calculadora existente", () => {
    expect(calculatorFor("acidez_total")).toBeDefined();
  });
  test("devolve undefined para id desconhecido", () => {
    expect(calculatorFor("inexistente")).toBeUndefined();
  });
});
