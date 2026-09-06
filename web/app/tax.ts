/* Deterministic demonstration tax engine for Assessment Year 2026-27.
 *
 * Every number here is synthetic and every rule is written out in full so a
 * reviewer can check the arithmetic by hand. The prototype never calls a tax
 * service: the slabs, the rebate, the cess and the deduction caps below are the
 * whole calculation. They are versioned so a receipt can name the rules that
 * produced it.
 *
 * This is a hackathon demonstration, not tax advice. */

export const CALCULATION_VERSION = "DEMO-AY26-27-v2";

export type Regime = "new" | "old";

export type Slab = { upTo: number | null; rate: number };

/* New regime slabs. The video walkthrough tells a citizen "no tax up to 12
   lakh" without showing why; the rebate below is the why, and the product
   shows this table rather than asserting the conclusion. */
export const NEW_REGIME_SLABS: Slab[] = [
  { upTo: 400_000, rate: 0 },
  { upTo: 800_000, rate: 0.05 },
  { upTo: 1_200_000, rate: 0.1 },
  { upTo: 1_600_000, rate: 0.15 },
  { upTo: 2_000_000, rate: 0.2 },
  { upTo: 2_400_000, rate: 0.25 },
  { upTo: null, rate: 0.3 },
];

export const OLD_REGIME_SLABS: Slab[] = [
  { upTo: 250_000, rate: 0 },
  { upTo: 500_000, rate: 0.05 },
  { upTo: 1_000_000, rate: 0.2 },
  { upTo: null, rate: 0.3 },
];

export const STANDARD_DEDUCTION_NEW = 75_000;
export const STANDARD_DEDUCTION_OLD = 50_000;

/* Section 87A rebate: the reason a total income at or below the threshold pays
   nothing under the new regime. */
export const REBATE_NEW_LIMIT = 1_200_000;
export const REBATE_NEW_MAX = 60_000;
export const REBATE_OLD_LIMIT = 500_000;
export const REBATE_OLD_MAX = 12_500;

export const CESS_RATE = 0.04;

/* Old-regime deduction caps used by the side-by-side comparison. */
export const CAP_80C = 150_000;
export const CAP_80D = 25_000;
export const CAP_80TTA = 10_000;

export type SlabBand = {
  from: number;
  to: number;
  rate: number;
  taxable: number;
  tax: number;
};

/* Returns one row per band actually used, so the interface can show the
   citizen the working rather than a single opaque total. */
export const applySlabs = (income: number, slabs: Slab[]): SlabBand[] => {
  const bands: SlabBand[] = [];
  let floor = 0;

  for (const slab of slabs) {
    if (income <= floor) break;
    const ceiling = slab.upTo ?? income;
    const to = Math.min(income, ceiling);
    const taxable = Math.max(0, to - floor);
    if (taxable > 0) {
      bands.push({
        from: floor,
        to,
        rate: slab.rate,
        taxable,
        tax: taxable * slab.rate,
      });
    }
    floor = ceiling;
  }

  return bands;
};

export type Computation = {
  regime: Regime;
  grossSalary: number;
  standardDeduction: number;
  salaryAfterStandard: number;
  otherIncome: number;
  grossTotalIncome: number;
  chapterViaDeductions: number;
  totalIncome: number;
  bands: SlabBand[];
  taxBeforeRebate: number;
  rebate: number;
  taxAfterRebate: number;
  cess: number;
  totalTax: number;
  tdsPaid: number;
  refundDue: number;
  balancePayable: number;
};

export type ComputeInput = {
  regime: Regime;
  grossSalary: number;
  otherIncome: number;
  /* Only meaningful under the old regime. The new regime allows almost none of
     these, which is the point the deductions step has to make plainly. */
  /* s80G is already the eligible deduction, after the applicable donation
     percentage and evidence checks—not the gross amount on a receipt. */
  deductions?: { s80C?: number; s80D?: number; s80G?: number; s80TTA?: number };
  tdsPaid: number;
};

const roundRupees = (value: number) => Math.round(value);

export const compute = (input: ComputeInput): Computation => {
  const isNew = input.regime === "new";

  const standardDeduction = isNew
    ? STANDARD_DEDUCTION_NEW
    : STANDARD_DEDUCTION_OLD;

  const salaryAfterStandard = Math.max(0, input.grossSalary - standardDeduction);
  const grossTotalIncome = salaryAfterStandard + input.otherIncome;

  /* The new regime keeps none of the Chapter VI-A deductions this product
     covers, so the comparison must zero them rather than quietly carry them. */
  const d = input.deductions ?? {};
  const chapterViaDeductions = isNew
    ? 0
    : Math.min(d.s80C ?? 0, CAP_80C) +
      Math.min(d.s80D ?? 0, CAP_80D) +
      Math.max(0, d.s80G ?? 0) +
      Math.min(d.s80TTA ?? 0, CAP_80TTA);

  const totalIncome = Math.max(0, grossTotalIncome - chapterViaDeductions);

  const bands = applySlabs(totalIncome, isNew ? NEW_REGIME_SLABS : OLD_REGIME_SLABS);
  const taxBeforeRebate = bands.reduce((sum, band) => sum + band.tax, 0);

  const rebateLimit = isNew ? REBATE_NEW_LIMIT : REBATE_OLD_LIMIT;
  const rebateMax = isNew ? REBATE_NEW_MAX : REBATE_OLD_MAX;
  const rebate =
    totalIncome <= rebateLimit ? Math.min(taxBeforeRebate, rebateMax) : 0;

  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate);
  const cess = taxAfterRebate * CESS_RATE;
  const totalTax = roundRupees(taxAfterRebate + cess);

  const refundDue = Math.max(0, input.tdsPaid - totalTax);
  const balancePayable = Math.max(0, totalTax - input.tdsPaid);

  return {
    regime: input.regime,
    grossSalary: input.grossSalary,
    standardDeduction,
    salaryAfterStandard,
    otherIncome: input.otherIncome,
    grossTotalIncome,
    chapterViaDeductions,
    totalIncome,
    bands,
    taxBeforeRebate: roundRupees(taxBeforeRebate),
    rebate: roundRupees(rebate),
    taxAfterRebate: roundRupees(taxAfterRebate),
    cess: roundRupees(cess),
    totalTax,
    tdsPaid: input.tdsPaid,
    refundDue,
    balancePayable,
  };
};

export type RegimeComparison = {
  newRegime: Computation;
  oldRegime: Computation;
  better: Regime;
  saving: number;
};

export const compareRegimes = (
  input: Omit<ComputeInput, "regime">,
): RegimeComparison => {
  const newRegime = compute({ ...input, regime: "new" });
  const oldRegime = compute({ ...input, regime: "old" });
  const better = newRegime.totalTax <= oldRegime.totalTax ? "new" : "old";
  const saving = Math.abs(newRegime.totalTax - oldRegime.totalTax);
  return { newRegime, oldRegime, better, saving };
};
