import { describe, expect, it } from "vitest";
import {
  daysToVerify,
  DEMO_VERIFY_ROUTE,
  VERIFY_WINDOW_DAYS,
  verificationCopy,
  verifyDeadline,
  verifyRoutes,
} from "../app/verification";

const filed = new Date("2026-08-29T10:00:00.000Z");

describe("the verification window", () => {
  it("closes thirty days after the return was filed", () => {
    expect(VERIFY_WINDOW_DAYS).toBe(30);
    expect(verifyDeadline(filed).toISOString()).toBe("2026-09-28T10:00:00.000Z");
  });

  it("counts the days left from today, not from the filing date", () => {
    expect(daysToVerify(filed, filed)).toBe(30);
    expect(daysToVerify(filed, new Date("2026-09-27T10:00:00.000Z"))).toBe(1);
    expect(daysToVerify(filed, new Date("2026-09-28T10:00:00.000Z"))).toBe(0);
  });

  /* Negative rather than clamped at zero, because "today is the last day" and
     "the window has closed" are different sentences to a citizen and the
     interface has to be able to tell them apart. */
  it("goes negative once the window has closed", () => {
    expect(daysToVerify(filed, new Date("2026-09-29T10:00:00.000Z"))).toBe(-1);
    expect(daysToVerify(filed, new Date("2026-10-29T10:00:00.000Z"))).toBe(-31);
  });
});

describe("the verification routes", () => {
  it("carries the same routes in both languages, in the same order", () => {
    expect(verifyRoutes.en.map((route) => route.id)).toEqual(
      verifyRoutes.hi.map((route) => route.id),
    );
    expect(verifyRoutes.en).toHaveLength(7);
  });

  it("simulates a route it actually offers", () => {
    expect(
      verifyRoutes.en.some((route) => route.id === DEMO_VERIFY_ROUTE),
    ).toBe(true);
  });

  /* Portal wording is a quotation, so it stays in English on both halves the
     way every other quoted control in this prototype does. */
  it("quotes the portal's own option names in both halves", () => {
    for (const [index, route] of verifyRoutes.hi.entries()) {
      expect(route.official).toBe(verifyRoutes.en[index].official);
    }
  });

  /* The paper route is the one that runs out of time, so nothing may describe
     it as finishing on the day it is chosen. */
  it("marks the postal route as the one that is not instant", () => {
    const paper = verifyRoutes.en.find((route) => route.id === "itr-v");
    expect(paper?.instant).toBe(false);
    expect(
      verifyRoutes.en.filter((route) => !route.instant),
    ).toHaveLength(1);
  });

  it("says in both languages that an unverified return is not a filed return", () => {
    expect(verificationCopy.en.intro).toMatch(/never filed/);
    expect(verificationCopy.hi.intro).toMatch(/भरा ही न गया/);
  });
});
