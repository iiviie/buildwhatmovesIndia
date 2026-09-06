import { describe, expect, it } from "vitest";
import {
  applySlabs,
  compareRegimes,
  compute,
  NEW_REGIME_SLABS,
  REBATE_NEW_LIMIT,
} from "../app/tax";

/* The demonstration calculation is the one claim the prototype makes that a
   citizen cannot check by reading the screen, so it is pinned here. */

describe("slab arithmetic", () => {
  it("taxes only the part of income inside each band", () => {
    const bands = applySlabs(1_311_600, NEW_REGIME_SLABS);
    expect(bands.map((band) => [band.taxable, Math.round(band.tax)])).toEqual([
      [400_000, 0],
      [400_000, 20_000],
      [400_000, 40_000],
      [111_600, 16_740],
    ]);
  });

  it("produces no bands for zero income", () => {
    expect(applySlabs(0, NEW_REGIME_SLABS)).toEqual([]);
  });

  it("never taxes a raise at more than the top band rate", () => {
    const before = applySlabs(1_199_999, NEW_REGIME_SLABS).reduce(
      (sum, band) => sum + band.tax,
      0,
    );
    const after = applySlabs(1_299_999, NEW_REGIME_SLABS).reduce(
      (sum, band) => sum + band.tax,
      0,
    );
    expect(after - before).toBeLessThanOrEqual(100_000 * 0.15 + 1);
  });
});

describe("the demo case", () => {
  const input = {
    grossSalary: 1_320_000,
    otherIncome: 66_600,
    deductions: { s80C: 150_000, s80D: 25_000, s80TTA: 12_400 },
    tdsPaid: 90_420,
  };

  it("computes the new regime end to end", () => {
    const result = compute({ ...input, regime: "new" });
    expect(result.standardDeduction).toBe(75_000);
    expect(result.chapterViaDeductions).toBe(0);
    expect(result.totalIncome).toBe(1_311_600);
    expect(result.taxBeforeRebate).toBe(76_740);
    expect(result.rebate).toBe(0);
    expect(result.cess).toBe(3_070);
    expect(result.totalTax).toBe(79_810);
    expect(result.refundDue).toBe(10_610);
    expect(result.balancePayable).toBe(0);
  });

  it("computes the old regime end to end", () => {
    const result = compute({ ...input, regime: "old" });
    expect(result.standardDeduction).toBe(50_000);
    expect(result.chapterViaDeductions).toBe(185_000);
    expect(result.totalIncome).toBe(1_151_600);
    expect(result.totalTax).toBe(164_299);
    expect(result.refundDue).toBe(0);
  });

  it("recommends the cheaper regime and names the saving", () => {
    const comparison = compareRegimes(input);
    expect(comparison.better).toBe("new");
    expect(comparison.saving).toBe(84_489);
  });

  it("adds only the verified eligible share of an 80G donation to the old regime", () => {
    const comparison = compareRegimes({
      ...input,
      deductions: { ...input.deductions, s80G: 5_500 },
    });
    expect(comparison.oldRegime.chapterViaDeductions).toBe(190_500);
    expect(comparison.newRegime.chapterViaDeductions).toBe(0);
    expect(comparison.saving).toBe(82_773);
  });
});

describe("the section 87A rebate", () => {
  it("cancels the tax at the new-regime limit", () => {
    const result = compute({
      regime: "new",
      grossSalary: REBATE_NEW_LIMIT + 75_000,
      otherIncome: 0,
      tdsPaid: 0,
    });
    expect(result.totalIncome).toBe(REBATE_NEW_LIMIT);
    expect(result.totalTax).toBe(0);
  });

  it("stops applying one rupee above the limit", () => {
    const result = compute({
      regime: "new",
      grossSalary: REBATE_NEW_LIMIT + 75_001,
      otherIncome: 0,
      tdsPaid: 0,
    });
    expect(result.rebate).toBe(0);
    expect(result.totalTax).toBeGreaterThan(0);
  });
});

describe("deduction caps", () => {
  it("caps each old-regime deduction at its statutory limit", () => {
    const result = compute({
      regime: "old",
      grossSalary: 2_000_000,
      otherIncome: 0,
      deductions: { s80C: 900_000, s80D: 900_000, s80TTA: 900_000 },
      tdsPaid: 0,
    });
    expect(result.chapterViaDeductions).toBe(150_000 + 25_000 + 10_000);
  });

  it("allows no chapter VI-A deduction under the new regime", () => {
    const result = compute({
      regime: "new",
      grossSalary: 2_000_000,
      otherIncome: 0,
      deductions: { s80C: 150_000, s80D: 25_000, s80TTA: 10_000 },
      tdsPaid: 0,
    });
    expect(result.chapterViaDeductions).toBe(0);
  });
});
