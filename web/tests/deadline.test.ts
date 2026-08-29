import { describe, expect, it } from "vitest";
import {
  BELATED_DATE_ISO,
  buildFilingWindow,
  DUE_DATE_ISO,
  LATE_FEE_HIGH,
  LATE_FEE_LOW,
} from "../app/case-data";

/* Missing the due date is the failure this product most needs to stop being a
   surprise, so the state machine behind the warning is pinned to fixed dates
   rather than to whenever the suite happens to run. */

const at = (iso: string) => new Date(`${iso}T09:00:00+05:30`);

describe("the filing window", () => {
  it("counts down to the due date while there is still time", () => {
    const window = buildFilingWindow(at("2026-07-21"), 1_311_600);
    expect(window.state).toBe("on-time");
    expect(window.daysLeft).toBe(10);
    expect(window.lateFee).toBe(0);
  });

  it("treats the due date itself as still on time", () => {
    const window = buildFilingWindow(at(DUE_DATE_ISO), 1_311_600);
    expect(window.state).toBe("on-time");
    expect(window.daysLeft).toBe(0);
    expect(window.lateFee).toBe(0);
  });

  it("flips to belated the day after, and starts charging", () => {
    const window = buildFilingWindow(at("2026-08-01"), 1_311_600);
    expect(window.state).toBe("belated");
    expect(window.lateFee).toBe(LATE_FEE_HIGH);
    /* The countdown now runs to the belated date, not the missed one. */
    expect(window.daysLeft).toBe(152);
    expect(window.daysToDue).toBeLessThan(0);
  });

  it("charges the lower fee on a small total income", () => {
    const window = buildFilingWindow(at("2026-08-01"), 400_000);
    expect(window.lateFee).toBe(LATE_FEE_LOW);
  });

  it("still accepts a belated return on the last day", () => {
    const window = buildFilingWindow(at(BELATED_DATE_ISO), 1_311_600);
    expect(window.state).toBe("belated");
    expect(window.daysLeft).toBe(0);
  });

  it("closes the window after the belated date", () => {
    const window = buildFilingWindow(at("2027-01-01"), 1_311_600);
    expect(window.state).toBe("closed");
  });

  it("gives the same answer regardless of the machine's timezone", () => {
    /* Late evening in India is still the previous day in UTC. The window must
       follow the Indian calendar, not the server's. */
    const lateIst = new Date("2026-07-31T23:30:00+05:30");
    expect(buildFilingWindow(lateIst, 1_311_600).state).toBe("on-time");

    const justAfter = new Date("2026-08-01T00:30:00+05:30");
    expect(buildFilingWindow(justAfter, 1_311_600).state).toBe("belated");
  });
});
