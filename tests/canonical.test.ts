/** Conversão de unidades — fatores de química padrão (não são limites legais). */
import { test, expect, describe } from "bun:test";
import { convert, ETHANOL_WEIGHT_FACTOR } from "../lib/canonical";

describe("convert", () => {
  test("unidade igual devolve o mesmo valor", () => {
    expect(convert(42, "mg/L", "mg/L")).toBe(42);
  });

  test("acidez acética meq/L → g/L (fator 0,060052)", () => {
    expect(convert(20, "meq/L (acético)", "g/L (acético)")).toBeCloseTo(1.20104, 5);
  });

  test("acidez acética g/L → meq/L (inverso)", () => {
    expect(convert(1.2, "g/L (acético)", "meq/L (acético)")).toBeCloseTo(19.9827, 3);
  });

  test("acidez tartárica meq/L → g/L (fator 0,075044)", () => {
    expect(convert(55, "meq/L (tartárico)", "g/L (tartárico)")).toBeCloseTo(4.12742, 4);
  });

  test("pressão atm → bar", () => {
    expect(convert(1, "atm", "bar")).toBeCloseTo(1.01325, 5);
  });

  test("round-trip preserva o valor", () => {
    const v = convert(convert(0.6, "g/L (acético)", "meq/L (acético)"), "meq/L (acético)", "g/L (acético)");
    expect(v).toBeCloseTo(0.6, 9);
  });

  test("unidade desconhecida lança (não devolve NaN)", () => {
    expect(() => convert(1, "parsec", "mg/L")).toThrow();
  });

  test("dimensões incompatíveis lançam", () => {
    expect(() => convert(1, "mg/L", "bar")).toThrow();
  });

  test("fator etanol documentado", () => {
    expect(ETHANOL_WEIGHT_FACTOR).toBeCloseTo(7.8934, 4);
  });
});
