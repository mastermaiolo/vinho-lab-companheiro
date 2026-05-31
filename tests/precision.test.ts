/** Parsing das figuras de precisão (r/R) das strings de methods.json. */
import { test, expect, describe } from "bun:test";
import { parsePrecision } from "../lib/precision";

describe("parsePrecision", () => {
  test("string vazia → sem figuras", () => {
    expect(parsePrecision("")).toEqual([]);
  });

  test("extrai r e R com unidade g/L", () => {
    const figs = parsePrecision("r ≤ 0,07 g/L; R ≤ 0,13 g/L");
    expect(figs.length).toBe(2);
    const R = figs.find((f) => f.kind === "R");
    expect(R?.value).toBeCloseTo(0.13, 6);
    expect(R?.unit).toBe("g/L");
  });

  test("decimal com vírgula é convertido", () => {
    const figs = parsePrecision("R ≤ 0,19 % vol");
    expect(figs[0].value).toBeCloseTo(0.19, 6);
  });

  test("captura qualificador entre parênteses", () => {
    const figs = parsePrecision("r ≤ 5 mg/L (livre)");
    expect(figs[0].qualifier).toBe("livre");
  });

  test("ignora figuras sem unidade reconhecida (só LD/LQ)", () => {
    expect(parsePrecision("LD = 2; LQ = 5")).toEqual([]);
  });

  test("margem relativa em %", () => {
    const figs = parsePrecision("r ≤ 20%");
    expect(figs[0].unit).toBe("%");
    expect(figs[0].value).toBeCloseTo(20, 6);
  });
});
