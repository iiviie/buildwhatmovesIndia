import { describe, expect, it } from "vitest";
import {
  claimableTds,
  defaultDraft,
  demoCase,
  formatRupees,
  incomeEntries,
  strandedTds,
  type DraftState,
} from "../app/case-data";
import { deductions, taxPaidSchedules } from "../app/tax-paid";

/* The tax-paid schedules print figures that the engine also computes. Two
   sources for the same number is how a demo ends up telling a reviewer one
   thing on screen and another in the arithmetic, so the point of this file is
   that they cannot drift apart quietly. */

/* The intended answers: every prefilled entry accepted except the Trilok Bank
   line, which is the synthetic PAN mix-up the case is built around. */
const answered: DraftState = {
  ...defaultDraft,
  incomeAnswers: Object.fromEntries(
    incomeEntries.map((entry) => [
      entry.id,
      entry.id === "fd-trilok" ? "not-mine" : "mine",
    ]),
  ),
};

/* The rupee cell is the last column in every schedule that has rows. */
const moneyIn = (row: string[]) => row[row.length - 1];

const rowsOf = (id: string) => {
  const schedule = taxPaidSchedules.en.find((entry) => entry.id === id);
  if (!schedule) throw new Error(`no schedule ${id}`);
  return schedule;
};

describe("the schedules against the engine", () => {
  it("claims exactly what TDS1 and TDS2 print, and nothing else", () => {
    const printed = [...rowsOf("tds1").rows, ...rowsOf("tds2").rows].map(
      moneyIn,
    );

    expect(printed).toContain(formatRupees(demoCase.salaryTds, "en"));
    /* Every rupee on screen adds up to the credit the engine will claim. */
    const total = printed.reduce((sum, cell) => {
      const digits = Number(cell.replace(/[^\d]/g, ""));
      return sum + digits;
    }, 0);

    expect(total).toBe(claimableTds(answered));
  });

  it("keeps the disputed entry's credit off every schedule", () => {
    const trilok = incomeEntries.find((entry) => entry.id === "fd-trilok");
    if (!trilok) throw new Error("the Trilok Bank fixture has moved");

    /* Claiming a credit while leaving its income out is the exact mismatch
       that produces a defective return, so the credit must not appear as
       claimable anywhere. */
    expect(strandedTds(answered)).toBe(trilok.tds);

    const everyCell = taxPaidSchedules.en
      .flatMap((schedule) => schedule.rows)
      .flat();
    expect(everyCell).not.toContain(formatRupees(trilok.tds, "en"));
  });

  it("explains the empty schedules instead of printing nothing", () => {
    for (const schedule of taxPaidSchedules.en) {
      if (schedule.rows.length > 0) continue;
      /* "None" tells a citizen nothing. Each empty schedule has to say what
         would put a line in it. */
      expect(schedule.emptyNote.length).toBeGreaterThan(40);
    }
  });

  it("gives every row a cell for every column, in both languages", () => {
    for (const language of ["en", "hi"] as const) {
      for (const schedule of taxPaidSchedules[language]) {
        for (const row of schedule.rows) {
          expect(row).toHaveLength(schedule.columns.length);
        }
      }
    }
  });
});

describe("deductions under the new regime", () => {
  it("separates 'the regime disallows it' from 'you have none'", () => {
    /* Both come out as zero, and a citizen who cannot tell them apart cannot
       tell whether choosing the old regime would have been worth it. */
    const kinds = new Set(deductions.en.map((row) => row.allowedUnderNewRegime));
    expect(kinds.size).toBe(2);
  });

  it("says something specific about every zero", () => {
    for (const row of deductions.en) {
      expect(row.amount).toBe(0);
      expect(row.note.length).toBeGreaterThan(30);
    }
  });
});

describe("the two languages", () => {
  it("carry the same figures and the same structure", () => {
    const shape = (language: "en" | "hi") => ({
      sections: deductions[language].map((row) => row.section),
      amounts: deductions[language].map((row) => row.amount),
      allowed: deductions[language].map((row) => row.allowedUnderNewRegime),
      ids: taxPaidSchedules[language].map((schedule) => schedule.id),
      rows: taxPaidSchedules[language].map((schedule) => schedule.rows),
    });

    expect(shape("hi")).toEqual(shape("en"));
  });
});
